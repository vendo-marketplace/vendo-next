"use client";

import {
  CalendarClock,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MapPin,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";
import type { AutoSearch } from "@/features/auto-search/types/auto-search";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/features/auto-search/utils/auto-search-utils";
import { toUkrainianCityName } from "@/features/products/lib/city-name";
import AutoSearchProducts from "./AutoSearchProducts";

type Props = {
  autoSearch: AutoSearch;
  categoryTrail: string[];
  showProducts: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function AutoSearchCard({
  autoSearch,
  categoryTrail,
  showProducts,
  isDeleting,
  onEdit,
  onDelete,
}: Props) {
  const t = useTranslations("AutoSearch");
  const priceSummary =
    autoSearch.minPrice !== undefined || autoSearch.maxPrice !== undefined
      ? `${autoSearch.minPrice !== undefined ? formatPrice(autoSearch.minPrice) : t("anyPrice")} – ${autoSearch.maxPrice !== undefined ? formatPrice(autoSearch.maxPrice) : t("noLimit")}`
      : t("anyPrice");

  return (
    <article className="rounded-2xl border border-stroke-primary-subtle bg-surface-primary p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              {categoryTrail.at(-1) ?? t("unknownCategory")}
            </h2>
            <AutoSearchStatusBadge status={autoSearch.status} />
          </div>

          {categoryTrail.length > 1 && (
            <nav
              aria-label={t("categoryPath")}
              className="mt-2 flex flex-wrap items-center gap-1"
            >
              {categoryTrail.slice(0, -1).map((category, index) => (
                <span
                  key={`${category}-${index}`}
                  className="inline-flex items-center gap-1"
                >
                  {index > 0 && (
                    <ChevronRight
                      aria-hidden="true"
                      className="size-3.5 text-text-tertiary"
                    />
                  )}
                  <span className="rounded-md bg-surface-primary-subtle px-2 py-1 text-xs text-text-tertiary">
                    {category}
                  </span>
                </span>
              ))}
            </nav>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <span className="rounded-lg bg-surface-secondary px-3 py-1.5 font-medium text-text-primary">
              {priceSummary}
            </span>
            {autoSearch.address?.city && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-secondary px-3 py-1.5">
                <MapPin aria-hidden="true" className="size-4" />
                {toUkrainianCityName(autoSearch.address.city)}
              </span>
            )}
            <ExpirationDate date={autoSearch.expirationDate} />
          </div>
        </div>

        <AutoSearchCardActions
          autoSearchId={autoSearch.id}
          showProducts={showProducts}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {showProducts && (
        <div className="mt-5 border-t border-stroke-secondary pt-5">
          <AutoSearchProducts id={autoSearch.id} />
        </div>
      )}
    </article>
  );
}

function AutoSearchStatusBadge({ status }: { status: AutoSearch["status"] }) {
  const t = useTranslations("AutoSearch");
  const isActive = status === "ACTIVE";
  const label =
    status === "ACTIVE"
      ? t("active")
      : status === "CANCELLED"
        ? t("paused")
        : t("expired");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-surface-brand-subtle text-text-brand"
          : "bg-surface-secondary text-text-secondary"
      }`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${
          isActive ? "bg-text-brand" : "bg-text-tertiary"
        }`}
      />
      {label}
    </span>
  );
}

function ExpirationDate({ date }: { date: string }) {
  const t = useTranslations("AutoSearch");

  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-stroke-primary-subtle bg-surface-primary px-3 py-1.5">
      <CalendarClock aria-hidden="true" className="size-4 text-text-brand" />
      <span className="text-xs text-text-tertiary">{t("expirationShort")}</span>
      <span className="font-medium text-text-primary">
        {new Intl.DateTimeFormat("uk-UA", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(`${date.slice(0, 10)}T12:00:00`))}
      </span>
    </span>
  );
}

function AutoSearchCardActions({
  autoSearchId,
  showProducts,
  isDeleting,
  onEdit,
  onDelete,
}: {
  autoSearchId: string;
  showProducts: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("AutoSearch");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="secondary" size="sm" className="h-10">
        <Link
          href={
            showProducts ? "/auto-search" : `/auto-search/${autoSearchId}/products`
          }
          aria-expanded={showProducts}
        >
          <Search aria-hidden="true" className="size-4" />
          {t("matchedProducts")}
          {showProducts ? (
            <ChevronUp aria-hidden="true" className="size-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="size-4" />
          )}
        </Link>
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onEdit}
        className="h-10"
        aria-label={t("edit")}
      >
        <Pencil aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">{t("edit")}</span>
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={isDeleting}
        onClick={onDelete}
        className="h-10 text-text-error hover:text-text-error"
        aria-label={t("delete")}
      >
        <Trash2 aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">
          {t(isDeleting ? "deleting" : "delete")}
        </span>
      </Button>
    </div>
  );
}
