"use client";

import {
  BadgeCheck,
  CalendarDays,
  Heart,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Dialog, Tabs } from "radix-ui";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { useFavoriteProducts } from "@/features/favorites/hooks/use-favorite-products";
import { useAutoSearches } from "@/features/auto-search/hooks/use-auto-searches";
import type { MeResponse } from "@/features/auth/types/auth";
import { Link } from "@/i18n/navigation";

type Props = {
  user: MeResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("uk-UA", { dateStyle: "long" }).format(date);
};

const tabClassName =
  "flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary outline-none transition-colors hover:bg-surface-secondary data-[state=active]:bg-surface-brand data-[state=active]:text-text-invert";

export default function ProfileDialog({ user, open, onOpenChange }: Props) {
  const { data: favorites = [], isLoading: favoritesLoading } =
    useFavoriteProducts(open);
  const { data: autoSearches = [], isLoading: autoSearchesLoading } =
    useAutoSearches(open);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 flex max-h-[min(760px,calc(100dvh-2rem))] w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-stroke-secondary bg-surface-primary shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-stroke-secondary px-6 py-5 sm:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-secondary text-text-brand">
                <UserRound aria-hidden="true" className="size-6" />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="truncate text-xl font-semibold text-text-primary">
                  {user.fullName || "Мій профіль"}
                </Dialog.Title>
                <Dialog.Description className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-secondary">
                  <span className="truncate">{user.email}</span>
                  {user.emailVerified ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <BadgeCheck aria-hidden="true" className="size-3.5" />
                      Підтверджено
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <ShieldCheck aria-hidden="true" className="size-3.5" />
                      Потрібне підтвердження
                    </span>
                  )}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Закрити профіль"
                className="grid size-9 shrink-0 place-items-center rounded-full text-xl leading-none text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary"
              >
                ×
              </button>
            </Dialog.Close>
          </div>

          <Tabs.Root defaultValue="profile" className="flex min-h-0 flex-1 flex-col">
            <Tabs.List
              aria-label="Розділи профілю"
              className="flex gap-1 border-b border-stroke-secondary px-4 py-3 sm:px-7"
            >
              <Tabs.Trigger value="profile" className={tabClassName}>
                Профіль
              </Tabs.Trigger>
              <Tabs.Trigger value="favorites" className={tabClassName}>
                Обране
              </Tabs.Trigger>
              <Tabs.Trigger value="auto-search" className={tabClassName}>
                Автопошуки
              </Tabs.Trigger>
            </Tabs.List>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              <Tabs.Content value="profile" className="outline-none">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<UserRound aria-hidden="true" className="size-4" />}
                    label="Ім’я"
                    value={user.fullName || "Ще не вказано"}
                  />
                  <InfoCard
                    icon={<Mail aria-hidden="true" className="size-4" />}
                    label="Електронна пошта"
                    value={user.email}
                  />
                  <InfoCard
                    icon={<CalendarDays aria-hidden="true" className="size-4" />}
                    label="Дата народження"
                    value={
                      user.birthDate ? formatDate(user.birthDate) : "Ще не вказано"
                    }
                  />
                  <InfoCard
                    icon={<ShieldCheck aria-hidden="true" className="size-4" />}
                    label="Статус акаунта"
                    value={
                      user.emailVerified
                        ? "Email підтверджено"
                        : "Email не підтверджено"
                    }
                  />
                </div>
                <p className="mt-5 text-sm text-text-tertiary">
                  Учасник Vendo з {formatDate(user.createdAt)}
                </p>
              </Tabs.Content>

              <Tabs.Content value="favorites" className="outline-none">
                <SummaryCard
                  icon={<Heart aria-hidden="true" className="size-5" />}
                  title="Збережені товари"
                  description="Товари, які ви додали до обраного, щоб швидко повернутися до них."
                  count={favorites.length}
                  countLabel="товарів"
                  isLoading={favoritesLoading}
                  actionLabel="Перейти до обраного"
                  href="/favorites"
                  onNavigate={() => onOpenChange(false)}
                />
              </Tabs.Content>

              <Tabs.Content value="auto-search" className="outline-none">
                <SummaryCard
                  icon={<Search aria-hidden="true" className="size-5" />}
                  title="Ваші автопошуки"
                  description="Збережені умови пошуку допомагають стежити за новими пропозиціями."
                  count={autoSearches.length}
                  countLabel="автопошуків"
                  isLoading={autoSearchesLoading}
                  actionLabel="Керувати автопошуками"
                  href="/auto-search"
                  onNavigate={() => onOpenChange(false)}
                />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
    icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-stroke-secondary bg-surface-primary p-4">
      <div className="flex items-center gap-2 text-text-tertiary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 break-words text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

function SummaryCard({
  icon,
  title,
  description,
  count,
  countLabel,
  isLoading,
  actionLabel,
  href,
  onNavigate,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  count: number;
  countLabel: string;
  isLoading: boolean;
  actionLabel: string;
  href: "/favorites" | "/auto-search";
  onNavigate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-stroke-secondary bg-surface-primary p-5 sm:p-7">
      <div className="grid size-11 place-items-center rounded-xl bg-surface-secondary text-text-brand">
        {icon}
      </div>
      <div className="mt-5 flex flex-wrap items-baseline gap-2">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <span className="text-sm text-text-tertiary">
          {isLoading ? (
            <span
              aria-label="Завантаження"
              className="inline-block size-3 animate-spin rounded-full border-2 border-current border-r-transparent align-[-2px]"
            />
          ) : (
            `${count} ${countLabel}`
          )}
        </span>
      </div>
      <p className="mt-2 max-w-lg text-sm leading-6 text-text-secondary">{description}</p>
      <Button asChild className="mt-6">
        <Link href={href} onClick={onNavigate}>
          {actionLabel}
        </Link>
      </Button>
    </div>
  );
}
