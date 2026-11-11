import { useEffect, useRef, useSyncExternalStore } from "react";

import type { Conversation, Message, ReadState } from "@/features/chats/types/chat";

type MarkRead = (variables: {
  id: string;
  lastReadMessageId: string;
  readerId: string;
}) => void;

const isOptimistic = (message: Message) => message.id.startsWith("optimistic-");

const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};

const usePageVisible = () =>
  useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === "visible",
    () => false,
  );

// Time of the last message a reader has read, if that message is among the loaded ones.
// When it is not, it is older than everything loaded, so none of those are read.
export const getReadUpTo = (readState: ReadState | undefined, messages: Message[]) =>
  readState && messages.find(({ id }) => id === readState.lastReadMessageId)?.createdAt;

const isAlreadyRead = (latest: Message, readState: ReadState | undefined, messages: Message[]) => {
  const readUpTo = getReadUpTo(readState, messages);
  return readUpTo !== undefined && Date.parse(readUpTo) >= Date.parse(latest.createdAt);
};

// Moves the user's read position to the newest message from the other side
// while the chat is open and the tab is actually visible.
export const useMarkConversationRead = (
  conversation: Conversation | undefined,
  messages: Message[],
  userId: string | undefined,
  markRead: MarkRead,
) => {
  const isPageVisible = usePageVisible();
  // Guards against retrying the same message forever when the request fails.
  const lastRequestedId = useRef<string | null>(null);

  useEffect(() => {
    if (!conversation || !userId || !isPageVisible) return;

    const latestPeerMessage = [...messages]
      .reverse()
      .find((message) => message.senderId !== userId && !isOptimistic(message));
    if (!latestPeerMessage) return;
    if (isAlreadyRead(latestPeerMessage, conversation.readStates[userId], messages)) return;
    if (lastRequestedId.current === latestPeerMessage.id) return;

    lastRequestedId.current = latestPeerMessage.id;
    markRead({
      id: conversation.id,
      lastReadMessageId: latestPeerMessage.id,
      readerId: userId,
    });
  }, [conversation, isPageVisible, markRead, messages, userId]);
};
