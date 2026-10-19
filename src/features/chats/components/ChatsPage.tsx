"use client";

import {
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Smile,
  Tag,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from "react";
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
import type { Conversation, Message } from "@/features/chats/types/chat";
import { Link, useRouter } from "@/i18n/navigation";
import type { ProductCardType, SearchProductsQuery } from "@/types/product";

const FILTERS = [
  { value: "all", label: "Усі" },
  { value: "buying", label: "Купую" },
  { value: "selling", label: "Продаю" },
] as const;

type ConversationFilter = (typeof FILTERS)[number]["value"];

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
  }).format(date);
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(price);

const subscribeToSession = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getSessionSnapshot = (): boolean | null =>
  typeof window === "undefined"
    ? null
    : Boolean(
        localStorage.getItem("access-token") ||
          localStorage.getItem("refresh-token"),
      );

function ParticipantAvatar({
  label,
  color = "bg-blue-100 text-blue-700",
  size = "size-11",
}: {
  label: string;
  color?: string;
  size?: string;
}) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
    >
      {label.slice(0, 2).toLocaleUpperCase("uk")}
    </div>
  );
}

function ConversationProduct({ product }: { product?: ProductCardType }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-secondary p-2.5">
      {product?.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.images[0]}
          alt=""
          className="size-12 shrink-0 rounded-lg bg-white object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white text-text-brand">
          <Tag className="size-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-text-tertiary">Товар у чаті</p>
        <p className="truncate text-sm font-medium text-text-primary">
          {product?.title ?? "Оголошення"}
        </p>
      </div>
      {product && (
        <p className="shrink-0 text-sm font-semibold text-text-primary">
          {formatPrice(product.price)}
        </p>
      )}
    </div>
  );
}

function EmptyState({ title, description, icon }: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface-secondary text-text-tertiary">
        {icon ?? <MessageCircle className="size-5" />}
      </div>
      <p className="font-medium text-text-primary">{title}</p>
      <p className="mt-1 text-sm text-text-tertiary">{description}</p>
    </div>
  );
}

function ConversationList({
  conversations,
  activeId,
  userId,
  products,
  query,
  filter,
  isError,
  onQueryChange,
  onFilterChange,
  onRetry,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string;
  userId: string;
  products: Map<string, ProductCardType>;
  query: string;
  filter: ConversationFilter;
  isError: boolean;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: ConversationFilter) => void;
  onRetry: () => void;
  onSelect: (id: string) => void;
}) {
  const visibleConversations = useMemo(
    () =>
      conversations
        .filter((conversation) => {
          const isSeller = conversation.sellerId === userId;
          if (filter === "buying" && isSeller) return false;
          if (filter === "selling" && !isSeller) return false;

          const product = products.get(conversation.productId);
          const searchableText = `${conversation.lastMessage} ${product?.title ?? ""}`;
          return searchableText
            .toLocaleLowerCase("uk")
            .includes(query.toLocaleLowerCase("uk"));
        })
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() -
            new Date(left.createdAt).getTime(),
        ),
    [conversations, filter, products, query, userId],
  );

  return (
    <aside className="flex min-h-0 flex-col border-r border-stroke-primary-subtle">
      <div className="border-b border-stroke-primary-subtle p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Вхідні</h2>
          <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-secondary">
            {conversations.length}
          </span>
        </div>
        <label className="flex h-11 items-center gap-2.5 rounded-xl border border-stroke-primary-subtle bg-surface-secondary px-3 text-text-tertiary focus-within:border-stroke-brand-light focus-within:bg-white">
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Пошук у повідомленнях"
            className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </label>
        <div className="mt-4 flex gap-2">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                filter === value
                  ? "bg-surface-brand text-white"
                  : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isError ? (
          <div className="p-6 text-center">
            <p className="text-sm text-text-secondary">Не вдалося завантажити чати.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-sm font-medium text-text-brand"
            >
              Спробувати ще раз
            </button>
          </div>
        ) : visibleConversations.length ? (
          visibleConversations.map((conversation) => {
            const isSeller = conversation.sellerId === userId;
            const role = isSeller ? "Покупець" : "Продавець";
            const product = products.get(conversation.productId);

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={`flex w-full gap-3 border-b border-stroke-primary-subtle px-4 py-4 text-left transition-colors hover:bg-surface-secondary sm:px-5 ${
                  activeId === conversation.id ? "bg-surface-brand-subtle" : ""
                }`}
              >
                <ParticipantAvatar
                  label={role}
                  color={isSeller ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-text-primary">
                      {role}
                    </span>
                    <span className="shrink-0 text-xs text-text-tertiary">
                      {formatDate(conversation.createdAt)}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-text-tertiary">
                    {product?.title ?? "Оголошення"}
                  </span>
                  <span className="mt-1.5 block truncate text-sm text-text-secondary">
                    {conversation.lastMessage}
                  </span>
                </span>
              </button>
            );
          })
        ) : (
          <EmptyState
            title={query ? "Чатів не знайдено" : "Поки немає розмов"}
            description={
              query
                ? "Змініть запит і спробуйте ще раз."
                : "Напишіть продавцю на сторінці товару, щоб почати чат."
            }
          />
        )}
      </div>
    </aside>
  );
}

function MessageHistory({
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
}: {
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
}) {
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
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#f8fafc] px-4 py-5 sm:px-8"
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="m-auto text-center">
          <p className="text-sm text-text-secondary">Не вдалося завантажити повідомлення.</p>
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
              <LoaderCircle aria-label="Завантаження" className="size-6 animate-spin text-text-brand" />
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

function MessageComposer({
  value,
  onChange,
  onSubmit,
  isSending,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSending: boolean;
  disabled: boolean;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-stroke-primary-subtle bg-white p-3 sm:px-5 sm:py-4"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-stroke-primary-subtle bg-surface-secondary p-2 focus-within:border-stroke-brand-light focus-within:bg-white">
        <button
          type="button"
          aria-label="Додати вкладення"
          className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary"
        >
          <Plus className="size-5" />
        </button>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={4000}
          placeholder="Напишіть повідомлення…"
          className="max-h-28 min-h-9 flex-1 resize-y bg-transparent py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
        />
        <button
          type="button"
          aria-label="Емодзі"
          className="mb-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary sm:flex"
        >
          <Smile className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Додати фото"
          className="mb-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary sm:flex"
        >
          <ImageIcon className="size-5" />
        </button>
        <button
          type="submit"
          disabled={!value.trim() || isSending || disabled}
          aria-label="Надіслати повідомлення"
          className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-brand text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-text-tertiary">
        Не надсилайте коди підтвердження або платіжні дані в чаті.
      </p>
    </form>
  );
}

export default function ChatsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedConversationId = searchParams.get("conversationId") ?? "";
  const requestedProductId = searchParams.get("productId") ?? "";
  const firstMessage = searchParams.get("firstMessage") ?? "";
  const sessionSnapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    () => null,
  );
  const hasStoredSession = sessionSnapshot === true;
  const isSessionChecked = sessionSnapshot !== null;
  const [selectedId, setSelectedId] = useState(requestedConversationId);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const [draft, setDraft] = useState(firstMessage);
  const [scrollToBottomKey, setScrollToBottomKey] = useState(0);

  const { data: user, isLoading: isUserLoading } = useMe(
    isSessionChecked && hasStoredSession,
  );
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
  } = useChatMutations();

  const productIds = useMemo(
    () =>
      [...new Set([...conversations.map((item) => item.productId), requestedProductId])].filter(
        Boolean,
      ),
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
  const {
    data: conversationDetails,
    isLoading: isConversationLoading,
    isError: conversationError,
    refetch: refetchConversation,
  } = useConversation(activeId);
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
  const peerIsSeller =
    isDraftConversation ||
    Boolean(activeConversation && activeConversation.sellerId !== user?.id);
  const peerRole = peerIsSeller ? "Продавець" : "Покупець";

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
    if (!message || sendMutation.isPending || createMutation.isPending) return;

    if (activeConversation) {
      sendMutation.mutate(
        { id: activeConversation.id, request: { message }, senderId: user?.id ?? "" },
        {
          onSuccess: () => {
            setDraft("");
            setScrollToBottomKey((key) => key + 1);
          },
          onError: () =>
            toast.error("Не вдалося надіслати повідомлення. Спробуйте ще раз."),
        },
      );
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

  if (!isSessionChecked || isUserLoading || (isLoading && !conversations.length)) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!hasStoredSession) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-330 flex-1 flex-col items-center justify-center px-4 text-center">
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

  if (!user) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-330 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-semibold text-text-primary">Сесія завершилася</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Увійдіть знову, щоб продовжити листування.
        </p>
        <Button asChild className="mt-5">
          <Link href="/sign-in">Увійти</Link>
        </Button>
      </section>
    );
  }

  const isSending = sendMutation.isPending || createMutation.isPending;
  const isComposerDisabled = isDraftConversation && !activeProduct;

  return (
    <section className="mx-auto flex w-full max-w-330 flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
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

      <div className="grid min-h-[680px] flex-1 overflow-hidden rounded-2xl border border-stroke-primary-subtle bg-surface-primary shadow-sm lg:h-[min(760px,calc(100dvh-13rem))] lg:min-h-[560px] lg:flex-none lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className={isChatOpen ? "hidden lg:flex" : "flex"}>
          <ConversationList
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
          <div className="flex min-h-0 flex-col">
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
                  label={peerRole}
                  color={peerIsSeller ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}
                  size="size-10"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-text-primary sm:text-base">
                    {peerRole}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-text-tertiary">
                    Учасник розмови про товар
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!isDraftConversation && (
                  <button
                    type="button"
                    onClick={deleteConversation}
                    disabled={removeMutation.isPending}
                    aria-label="Видалити розмову"
                    className="flex size-9 items-center justify-center rounded-full text-text-secondary hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="size-[18px]" />
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Інші дії"
                  className="hidden size-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-secondary sm:flex"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </div>
            </header>

            <div className="border-b border-stroke-primary-subtle px-4 py-3 sm:px-6">
              <ConversationProduct product={activeProduct} />
            </div>
              <MessageHistory
                key={activeId || requestedProductId}
                messages={messages}
                userId={user.id}
                peerRole={peerRole}
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
