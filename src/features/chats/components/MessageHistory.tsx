"use client";

import { Check, CheckCheck, LoaderCircle } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Message } from "@/features/chats/types/chat";
import { ParticipantAvatar } from "./ConversationSidebar";

type Props = {
  messages: Message[];
  userId: string;
  peerRole: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => Promise<unknown>;
  scrollToBottomKey: number;
};

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function MessageHistory({
  messages,
  userId,
  peerRole,
  isLoading,
  isError,
  onRetry,
  hasMore,
  isLoadingMore,
  onLoadMore,
  scrollToBottomKey,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToInitialPosition = useRef(false);
  const isNearBottom = useRef(true);
  const previousScrollToBottomKey = useRef(scrollToBottomKey);
  const latestScrollToBottomKey = useRef(scrollToBottomKey);
  const previousScrollPosition = useRef<{ height: number; top: number } | null>(null);
  const isLoadingOlderRef = useRef(false);

  useLayoutEffect(() => {
    latestScrollToBottomKey.current = scrollToBottomKey;
    const container = containerRef.current;
    if (!container || isLoading || isError) return;

    const shouldForceScroll = previousScrollToBottomKey.current !== scrollToBottomKey;
    previousScrollToBottomKey.current = scrollToBottomKey;

    if (!hasScrolledToInitialPosition.current || isNearBottom.current || shouldForceScroll) {
      container.scrollTop = container.scrollHeight;
      hasScrolledToInitialPosition.current = true;
      isNearBottom.current = true;
    }
  }, [isError, isLoading, messages.length, scrollToBottomKey]);

  const loadMoreMessages = async () => {
    if (!hasMore || isLoadingMore || isLoadingOlderRef.current) return;

    isLoadingOlderRef.current = true;
    const scrollKeyBeforeLoad = scrollToBottomKey;
    const container = containerRef.current;
    if (container) {
      previousScrollPosition.current = {
        height: container.scrollHeight,
        top: container.scrollTop,
      };
      isNearBottom.current = false;
    }

    try {
      await onLoadMore();
    } finally {
      requestAnimationFrame(() => {
        const currentContainer = containerRef.current;
        const previousPosition = previousScrollPosition.current;
        if (currentContainer && scrollKeyBeforeLoad !== latestScrollToBottomKey.current) {
          currentContainer.scrollTop = currentContainer.scrollHeight;
          isNearBottom.current = true;
        } else if (currentContainer && previousPosition) {
          currentContainer.scrollTop =
            currentContainer.scrollHeight - previousPosition.height + previousPosition.top;
        }

        previousScrollPosition.current = null;
        isLoadingOlderRef.current = false;
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={(event) => {
        const container = event.currentTarget;
        isNearBottom.current =
          container.scrollHeight - container.scrollTop - container.clientHeight < 120;

        if (container.scrollTop <= 80) void loadMoreMessages();
      }}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-surface-secondary px-4 py-5 sm:px-8"
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="m-auto text-center">
          <p className="text-sm text-text-secondary">
            Не вдалося завантажити повідомлення.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-text-brand"
          >
            Спробувати ще раз
          </button>
        </div>
      ) : !messages.length ? (
        <p className="m-auto text-center text-sm text-text-secondary">
          Поки що немає повідомлень. Напишіть першим.
        </p>
      ) : (
        <>
          {isLoadingMore && (
            <div role="status" className="mx-auto flex justify-center py-1">
              <LoaderCircle
                aria-label="Завантаження"
                className="size-6 animate-spin text-text-brand"
              />
            </div>
          )}
          <div className="mx-auto mb-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-text-tertiary shadow-sm">
            Історія повідомлень
          </div>
          {messages.map((message, index) => {
            const fromMe = message.senderId === userId;
            const previous = messages[index - 1];
            const showAvatar = !fromMe && (!previous || previous.senderId === userId);

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${fromMe ? "justify-end" : "justify-start"}`}
              >
                {!fromMe &&
                  (showAvatar ? (
                    <ParticipantAvatar
                      label={peerRole}
                      color="bg-blue-100 text-blue-700"
                      size="size-7"
                    />
                  ) : (
                    <span className="w-7 shrink-0" />
                  ))}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 sm:max-w-[70%] ${
                    fromMe
                      ? "rounded-br-md bg-surface-brand text-white"
                      : "rounded-bl-md border border-stroke-primary-subtle bg-white text-text-primary"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      fromMe ? "text-white/75" : "text-text-tertiary"
                    }`}
                  >
                    <span>{formatTime(message.createdAt)}</span>
                    {fromMe &&
                      (index === messages.length - 1 ? (
                        <CheckCheck className="size-3.5" />
                      ) : (
                        <Check className="size-3" />
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
