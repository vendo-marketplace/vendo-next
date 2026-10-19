"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";

import { chatKeys } from "@/features/chats/queries/chat.queries";
import type { Message, MessagePage } from "@/features/chats/types/chat";

const HEARTBEAT_INTERVAL = 10_000;
const MAX_RECONNECT_DELAY = 30_000;
const FRAME_END = "\0";
const STOMP_SUBPROTOCOLS = ["v12.stomp", "v11.stomp", "v10.stomp"];

function getSocketUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_URL is not configured");

  const url = new URL(`${baseUrl.replace(/\/+$/, "")}/ws`);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

function parseMessageFrame(frame: string): Message | null {
  const normalizedFrame = frame.replaceAll("\r\n", "\n").replace(/^\n+/, "");
  if (!normalizedFrame.startsWith("MESSAGE\n")) return null;

  const bodyStart = normalizedFrame.indexOf("\n\n");
  if (bodyStart < 0) return null;

  try {
    const payload: unknown = JSON.parse(normalizedFrame.slice(bodyStart + 2));
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("id" in payload) ||
      !("conversationId" in payload) ||
      !("senderId" in payload) ||
      !("content" in payload) ||
      !("createdAt" in payload)
    ) {
      return null;
    }

    return payload as Message;
  } catch {
    return null;
  }
}

function appendMessage(
  data: InfiniteData<MessagePage> | undefined,
  message: Message,
) {
  if (!data) return data;

  const hasMessage = data.pages.some((page) =>
    page.content.some(({ id }) => id === message.id),
  );
  if (hasMessage) return data;

  const optimisticMessage = data.pages
    .flatMap((page) => page.content)
    .find(
      (candidate) =>
        candidate.id.startsWith("optimistic-") &&
        candidate.senderId === message.senderId &&
        candidate.content === message.content &&
        Math.abs(Date.parse(candidate.createdAt) - Date.parse(message.createdAt)) < 30_000,
    );

  if (optimisticMessage) {
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        content: page.content
          .map((item) => (item.id === optimisticMessage.id ? message : item))
          .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)),
      })),
    };
  }

  return {
    ...data,
    pages: data.pages.map((page, index) =>
      index === 0
        ? {
            ...page,
            content: [...page.content, message].sort(
              (left, right) =>
                Date.parse(right.createdAt) - Date.parse(left.createdAt),
            ),
          }
        : page,
    ),
  };
}

function sendConnectFrame(socket: WebSocket, host: string, token: string) {
  socket.send(
    [
      "CONNECT",
      "accept-version:1.2",
      `host:${host}`,
      `heart-beat:${HEARTBEAT_INTERVAL},${HEARTBEAT_INTERVAL}`,
      `Authorization:Bearer ${token}`,
      "",
      FRAME_END,
    ].join("\n"),
  );
}

function sendSubscribeFrame(socket: WebSocket, conversationId: string) {
  socket.send(
    [
      "SUBSCRIBE",
      `id:conversation-${conversationId}`,
      `destination:/topic/conversations/${conversationId}`,
      "ack:auto",
      "",
      FRAME_END,
    ].join("\n"),
  );
}

export function useConversationSocket(conversationId: string, enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId || !enabled) return;

    const token = localStorage.getItem("access-token");
    if (!token) return;

    let socket: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout>;
    let heartbeatTimer: ReturnType<typeof setInterval>;
    let retryDelay = 1_000;
    let frameBuffer = "";
    let disposed = false;

    const subscribe = () => {
      if (!socket || socket.readyState !== WebSocket.OPEN) return;

      sendSubscribeFrame(socket, conversationId);
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      heartbeatTimer = setInterval(() => socket?.send("\n"), HEARTBEAT_INTERVAL);
    };

    const handleFrame = (rawFrame: string) => {
      const frame = rawFrame.replaceAll("\r\n", "\n").replace(/^\n+/, "");

      if (frame.startsWith("CONNECTED\n")) {
        retryDelay = 1_000;
        subscribe();
        return;
      }

      if (frame.startsWith("ERROR\n")) {
        socket?.close();
        return;
      }

      const message = parseMessageFrame(frame);
      if (!message || message.conversationId !== conversationId) return;

      queryClient.setQueryData<InfiniteData<MessagePage>>(
        chatKeys.messages(conversationId),
        (data) => appendMessage(data, message),
      );
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
    };

    const connect = () => {
      if (disposed) return;

      const url = getSocketUrl();
      const host = new URL(url).host;
      socket = new WebSocket(url, STOMP_SUBPROTOCOLS);
      socket.onopen = () => {
        if (socket) sendConnectFrame(socket, host, token);
      };
      socket.onmessage = ({ data }: MessageEvent<string>) => {
        frameBuffer += data;
        let frameEnd = frameBuffer.indexOf(FRAME_END);

        while (frameEnd !== -1) {
          handleFrame(frameBuffer.slice(0, frameEnd));
          frameBuffer = frameBuffer.slice(frameEnd + 1);
          frameEnd = frameBuffer.indexOf(FRAME_END);
        }
      };
      socket.onclose = () => {
        clearInterval(heartbeatTimer);
        if (disposed) return;

        retryTimer = setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, MAX_RECONNECT_DELAY);
      };
      socket.onerror = () => socket?.close();
    };

    try {
      connect();
    } catch {
      retryTimer = setTimeout(connect, retryDelay);
    }

    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      clearInterval(heartbeatTimer);

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(`DISCONNECT\n\n${FRAME_END}`);
      }
      socket?.close();
    };
  }, [conversationId, enabled, queryClient]);
}
