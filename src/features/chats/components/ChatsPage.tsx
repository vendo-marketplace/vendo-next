"use client";

import {
  ArrowLeft,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { productsApi } from "@/api/products";
import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import {
  useChatMutations,
  useConversation,
  useConversationMessages,
  useConversations,
} from "@/features/chats/hooks/use-chats";
import { useConversationSocket } from "@/features/chats/hooks/use-conversation-socket";
import { getReadUpTo, useMarkConversationRead } from "@/features/chats/hooks/use-read-receipts";
import { Link, useRouter } from "@/i18n/navigation";
import type { SearchProductsQuery } from "@/types/product";
import ConversationSidebar, {
  ConversationProduct,
  getConversationPeer,
  ParticipantAvatar,
  type ConversationFilter,
} from "./ConversationSidebar";
import MessageHistory from "./MessageHistory";
import MessageComposer from "./MessageComposer";

export default function ChatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedConversationId = searchParams.get("conversationId") ?? "";
  const requestedProductId = searchParams.get("productId") ?? "";
  const firstMessage = searchParams.get("firstMessage") ?? "";
  const [selectedId, setSelectedId] = useState(requestedConversationId);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const [draft, setDraft] = useState(firstMessage);
  const [scrollToBottomKey, setScrollToBottomKey] = useState(0);

  const { data: user, isLoading: isUserLoading } = useMe();
  const {
    data: conversations = [],
    isLoading,
    isError,
    refetch,
  } = useConversations(Boolean(user));
  const {
    create: createMutation,
    send: sendMutation,
    remove: removeMutation,
    markRead: markReadMutation,
  } = useChatMutations();

  const productIds = useMemo(
    () =>
      // Sorted so the query key stays the same when the list is reordered by a new message.
      [...new Set([...conversations.map((item) => item.productId), requestedProductId])]
        .filter(Boolean)
        .sort(),
    [conversations, requestedProductId],
  );
  const productQuery = useMemo(
    () =>
      ({
        ids: productIds,
        page: 1,
        size: Math.max(productIds.length, 1),
        sort: { sortBy: "CREATED_AT", direction: "DESC" },
      }) satisfies SearchProductsQuery,
    [productIds],
  );
  const { data: products = [] } = useQuery({
    queryKey: ["chat-products", productIds],
    enabled: Boolean(user && productIds.length),
    // Keep the current products on screen while a new set of ids loads.
    placeholderData: keepPreviousData,
    queryFn: async () => (await productsApi.search(undefined, productQuery)).data.data,
  });
  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const activeId = selectedId || requestedConversationId;
  const isDraftConversation = Boolean(requestedProductId && !activeId);
  const isChatOpen = Boolean(activeId || isDraftConversation);
  const activeListItem = conversations.find((conversation) => conversation.id === activeId);
  // The list already carries the conversation; fetch it on its own only when
  // it is missing there (just created, or opened from a link).
  const {
    data: conversationDetails,
    isLoading: isConversationLoading,
    isError: conversationError,
    refetch: refetchConversation,
  } = useConversation(activeId, !isLoading && !activeListItem);
  const activeConversation = conversationDetails ?? activeListItem;
  useConversationSocket(activeId, Boolean(user && activeConversation));

  const {
    data: messagePage,
    isLoading: areMessagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
    hasNextPage: hasOlderMessages,
    isFetchingNextPage: isFetchingOlderMessages,
    fetchNextPage,
  } = useConversationMessages(activeId);
  const messages = useMemo(
    () =>
      (messagePage?.pages.flatMap((page) => page.content) ?? []).sort(
        (left, right) =>
          Date.parse(left.createdAt) - Date.parse(right.createdAt),
      ),
    [messagePage],
  );
  const activeProduct = activeConversation
    ? productById.get(activeConversation.productId)
    : isDraftConversation
      ? productById.get(requestedProductId)
      : undefined;
  // A draft has no conversation yet; its peer is the seller of the product.
  const peer =
    activeConversation && user
      ? getConversationPeer(activeConversation, user.id)
      : { isUserSeller: false, id: "", name: "Продавець", role: "Продавець" };
  const peerIsSeller = !peer.isUserSeller;
  const peerReadUpTo = getReadUpTo(activeConversation?.readStates[peer.id], messages);

  useMarkConversationRead(activeConversation, messages, user?.id, markReadMutation.mutate);

  const selectConversation = (conversationId: string) => {
    setSelectedId(conversationId);
    router.replace(`/chats?conversationId=${encodeURIComponent(conversationId)}`);
  };

  const showConversationList = () => {
    setSelectedId("");
    router.replace("/chats");
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || createMutation.isPending) return;

    if (activeConversation) {
      // The message is already shown optimistically, so the composer is freed at
      // once; on failure the text comes back so it can be resent.
      setDraft("");
      setScrollToBottomKey((key) => key + 1);
      sendMutation
        .mutateAsync({
          id: activeConversation.id,
          request: { message },
          senderId: user?.id ?? "",
        })
        .catch(() => {
          setDraft((current) => current || message);
          toast.error("Не вдалося надіслати повідомлення. Спробуйте ще раз.");
        });
      return;
    }

    if (!isDraftConversation || !activeProduct) return;
    createMutation.mutate(
      { firstMessage: message, productId: activeProduct.id },
      {
        onSuccess: ({ data }) => {
          setDraft("");
          router.replace(
            `/chats?conversationId=${encodeURIComponent(data.conversationId)}`,
          );
        },
        onError: () => toast.error("Не вдалося створити чат. Спробуйте ще раз."),
      },
    );
  };

  const deleteConversation = () => {
    if (!activeConversation || !window.confirm("Видалити цю розмову?")) return;
    removeMutation.mutate(activeConversation.id, {
      onSuccess: () => {
        showConversationList();
        toast.success("Розмову видалено");
      },
      onError: () => toast.error("Не вдалося видалити розмову."),
    });
  };

  if (isUserLoading || (user && isLoading && !conversations.length)) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="page-container flex min-h-[60vh] flex-1 flex-col items-center justify-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-surface-secondary text-text-brand">
          <MessageCircle className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Увійдіть, щоб переглянути повідомлення
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
          Тут будуть ваші розмови з продавцями та покупцями.
        </p>
        <Button asChild className="mt-5">
          <Link href="/sign-in">Увійти</Link>
        </Button>
      </section>
    );
  }

  // Only creating a chat blocks the composer; messages in an existing chat are sent optimistically.
  const isSending = createMutation.isPending;
  const isComposerDisabled = isDraftConversation && !activeProduct;

  return (
    <section className="page-container flex flex-1 flex-col py-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-medium text-text-brand">Ваші розмови</p>
          <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
            Повідомлення
          </h1>
        </div>
        <span className="rounded-full bg-surface-secondary px-3 py-1.5 text-xs font-medium text-text-secondary">
          {conversations.length} чатів
        </span>
      </div>

      <div className="grid min-h-[680px] flex-1 grid-cols-1 overflow-hidden rounded-2xl border border-stroke-primary-subtle bg-surface-primary shadow-sm lg:h-[min(760px,calc(100dvh-13rem))] lg:min-h-[560px] lg:flex-none lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className={`min-w-0 ${isChatOpen ? "hidden lg:flex" : "flex"}`}>
          <ConversationSidebar
            conversations={conversations}
            activeId={activeId}
            userId={user.id}
            products={productById}
            query={query}
            filter={filter}
            isError={isError}
            onQueryChange={setQuery}
            onFilterChange={setFilter}
            onRetry={() => void refetch()}
            onSelect={selectConversation}
          />
        </div>

        {isChatOpen && (activeConversation || isDraftConversation) ? (
          <div className="flex min-h-0 min-w-0 flex-col">
            <header className="flex items-center justify-between border-b border-stroke-primary-subtle px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="До списку чатів"
                  onClick={showConversationList}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-surface-secondary lg:hidden"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <ParticipantAvatar
                  label={peer.name}
                  color={peerIsSeller ? "bg-surface-brand-subtle text-text-brand" : "bg-purple-100 text-purple-700"}
                  size="size-10"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-text-primary sm:text-base">
                    {peer.name}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-text-tertiary">
                    {peer.role}
                  </p>
                </div>
              </div>
              {!isDraftConversation && (
                <button
                  type="button"
                  onClick={deleteConversation}
                  disabled={removeMutation.isPending}
                  aria-label="Видалити розмову"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-surface-error-subtle hover:text-text-error disabled:opacity-50"
                >
                  <Trash2 className="size-[18px]" />
                </button>
              )}
            </header>

            <div className="border-b border-stroke-primary-subtle px-4 py-3 sm:px-6">
              <ConversationProduct product={activeProduct} />
            </div>
              <MessageHistory
                key={activeId || requestedProductId}
                messages={messages}
                userId={user.id}
                peerName={peer.name}
                peerReadUpTo={peerReadUpTo}
                isLoading={
                  areMessagesLoading ||
                  (isDraftConversation && !activeProduct) ||
                  (Boolean(activeId) && isConversationLoading && !activeListItem)
                }
                isError={messagesError || conversationError}
                hasMore={Boolean(hasOlderMessages)}
                isLoadingMore={isFetchingOlderMessages}
                onLoadMore={fetchNextPage}
                scrollToBottomKey={scrollToBottomKey}
                onRetry={() => {
                  void refetchMessages();
                  void refetchConversation();
                }}
              />
            <MessageComposer
              value={draft}
              onChange={setDraft}
              onSubmit={sendMessage}
              isSending={isSending}
              disabled={isComposerDisabled}
            />
          </div>
        ) : (
          <div
            className={`${isChatOpen ? "flex" : "hidden lg:flex"} flex-col items-center justify-center bg-surface-secondary px-8 text-center`}
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white text-text-brand shadow-sm">
              <MessageCircle className="size-7" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Оберіть чат</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
              Ваші розмови з продавцями та покупцями з’являться тут.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
