"use client";

import {
  ArrowRight,
  BellRing,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import type { CategoryOption } from "@/features/categories/types/category";
import { useAutoSearchMutations } from "@/features/auto-search/hooks/use-auto-search-mutations";
import { useAutoSearches } from "@/features/auto-search/hooks/use-auto-searches";
import type {
  AutoSearch,
  AutoSearchFormValues,
  UpdatableAutoSearchStatus,
} from "@/features/auto-search/types/auto-search";
import type { AutoSearchFilters } from "@/features/auto-search/types/auto-search";
import { Link } from "@/i18n/navigation";
import { getCategoryTrails, toLocalDate } from "@/features/auto-search/utils/auto-search-utils";
import AutoSearchCard from "./AutoSearchCard";
import AutoSearchForm from "./AutoSearchForm";
import { toUkrainianCityName } from "@/features/products/lib/city-name";

type Props = {
  categories: CategoryOption[];
  categoryError?: boolean;
};

const getFormValues = (autoSearch: AutoSearch): AutoSearchFormValues => ({
  categoryId: autoSearch.categoryId,
  minPrice: autoSearch.minPrice?.toString() ?? "",
  maxPrice: autoSearch.maxPrice?.toString() ?? "",
  city: autoSearch.address?.city ? toUkrainianCityName(autoSearch.address.city) : "",
  expirationDate: toLocalDate(autoSearch.expirationDate),
  status: autoSearch.status === "EXPIRED" ? "CANCELLED" : autoSearch.status,
});

export default function AutoSearchManager({
  categories,
  categoryError = false,
  selectedAutoSearchId,
}: Props & { selectedAutoSearchId?: string }) {
  const t = useTranslations("AutoSearch");
  const { data: user, isPending: isAuthPending } = useMe();
  const isAuthenticated = Boolean(user);
  const { data: autoSearches = [], isLoading, isError, refetch } =
    useAutoSearches(isAuthenticated, user?.id);
  const { create, update, remove } = useAutoSearchMutations();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const categoryTrails = useMemo(() => getCategoryTrails(categories), [categories]);
  const editingSearch = autoSearches.find(({ id }) => id === editingId);

  if (isAuthPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-text-secondary">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-13rem)] w-full max-w-330 flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-lg rounded-2xl border border-stroke-primary-subtle bg-surface-primary p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-surface-brand-subtle text-text-brand">
            <Search aria-hidden="true" className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {t("signInRequiredTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-text-secondary">
            {t("signInRequiredText")}
          </p>
          <Button asChild className="mt-6 w-full justify-center sm:w-auto">
            <Link href="/sign-in">
              {t("signInButton")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const handleCreate = async (filters: AutoSearchFilters) => {
    await create.mutateAsync(filters);
    setIsCreating(false);
    toast.success(t("created"));
  };

  const handleUpdate = async (
    filters: AutoSearchFilters,
    status: UpdatableAutoSearchStatus,
  ) => {
    if (!editingId) return;
    await update.mutateAsync({ id: editingId, filters: { ...filters, status } });
    setEditingId(null);
    toast.success(t("updated"));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    setDeletingId(id);
    try {
      await remove.mutateAsync(id);
      toast.success(t("deleted"));
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-330 flex-1 px-4 py-8 sm:px-6 lg:px-0 lg:py-10">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-surface-brand-subtle px-3 py-1 text-xs font-medium text-text-brand">
            <BellRing aria-hidden="true" className="size-3.5" />
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
            {t("description")}
          </p>
        </div>
        {autoSearches.length > 0 && !isCreating && !editingSearch && !categoryError && (
          <Button type="button" onClick={() => setIsCreating(true)} className="h-11 shrink-0 px-4">
            <Plus aria-hidden="true" className="size-4" />
            {t("create")}
          </Button>
        )}
      </div>

      {categoryError && (
        <div role="alert" className="mb-5 rounded-xl border border-stroke-error bg-surface-primary p-4 text-sm text-text-error">
          {t("categoriesError")}
        </div>
      )}

      {isCreating && !categoryError && (
        <div className="mb-6">
          <AutoSearchForm
            key="new"
            categories={categories}
            isSaving={create.isPending}
            onCancel={() => {
              setIsCreating(false);
            }}
            onSave={async (filters) => handleCreate(filters)}
          />
        </div>
      )}

      <Dialog.Root
        open={Boolean(editingSearch)}
        onOpenChange={(open) => {
          if (!open) setEditingId(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[min(90dvh,640px)] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-stroke-primary-subtle bg-surface-primary p-5 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-text-primary">
                  {t("editTitle")}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-text-secondary">
                  {t("editFormDescription")}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label={t("cancel")}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-text-tertiary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-brand"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </Dialog.Close>
            </div>
            {editingSearch && (
              <AutoSearchForm
                key={editingSearch.id}
                categories={categories}
                initialValues={getFormValues(editingSearch)}
                isEditing
                isSaving={update.isPending}
                onCancel={() => setEditingId(null)}
                onSave={handleUpdate}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="rounded-2xl border border-stroke-primary-subtle bg-surface-primary px-6 py-12 text-center">
          <h2 className="text-lg font-semibold">{t("loadErrorTitle")}</h2>
          <p className="mt-2 text-sm text-text-secondary">{t("loadError")}</p>
          <Button type="button" variant="secondary" onClick={() => void refetch()} className="mt-5">
            {t("retry")}
          </Button>
        </div>
      ) : selectedAutoSearchId &&
        !autoSearches.some(({ id }) => id === selectedAutoSearchId) ? (
        <div className="rounded-2xl border border-stroke-primary-subtle bg-surface-primary px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("searchNotFound")}
          </h2>
          <Button asChild variant="secondary" className="mt-5">
            <Link href="/auto-search">{t("backToAutoSearches")}</Link>
          </Button>
        </div>
      ) : autoSearches.length === 0 && !isCreating && !editingSearch ? (
        <div className="rounded-2xl border border-dashed border-stroke-primary-subtle bg-surface-primary px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface-brand-subtle text-text-brand">
            <BellRing aria-hidden="true" className="size-6" />
          </div>
          <h2 className="text-lg font-semibold">{t("emptyTitle")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">{t("empty")}</p>
          {!isCreating && !categoryError && (
            <Button type="button" onClick={() => setIsCreating(true)} className="mt-5 h-11 px-4">
              <Plus aria-hidden="true" className="size-4" />
              {t("create")}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {autoSearches.map((autoSearch) => (
            <AutoSearchCard
              key={autoSearch.id}
              autoSearch={autoSearch}
              categoryTrail={categoryTrails.get(autoSearch.categoryId) ?? []}
              showProducts={autoSearch.id === selectedAutoSearchId}
              isDeleting={deletingId === autoSearch.id}
              onEdit={() => {
                setIsCreating(false);
                setEditingId(autoSearch.id);
              }}
              onDelete={() => void handleDelete(autoSearch.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
