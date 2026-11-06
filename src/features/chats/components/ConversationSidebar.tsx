"use client";

import { MessageCircle, Search, Tag } from "lucide-react";
import { useMemo, type ReactNode } from "react";

import type { Conversation } from "@/features/chats/types/chat";
import type { ProductCardType } from "@/types/product";

const FILTERS = [
  { value: "all", label: "Усі" },
  { value: "buying", label: "Купую" },
  { value: "selling", label: "Продаю" },
] as const;

export type ConversationFilter = (typeof FILTERS)[number]["value"];

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

export function ParticipantAvatar({
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

export function ConversationProduct({ product }: { product?: ProductCardType }) {
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

function EmptyState({
  title,
  description,
  icon,
}: {
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

type Props = {
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
};

export default function ConversationSidebar({
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
}: Props) {
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
            <p className="text-sm text-text-secondary">
              Не вдалося завантажити чати.
            </p>
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
                  color={
                    isSeller
                      ? "bg-violet-100 text-violet-700"
                      : "bg-blue-100 text-blue-700"
                  }
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
