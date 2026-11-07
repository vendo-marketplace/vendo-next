"use client";

import { ChevronDown, ChevronUp, Image as ImageIcon, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import LoadingSpinner from "@/components/ui/loading-spinner";
import Select from "@/components/ui/select/select";
import { useAutoSearchProducts } from "@/features/auto-search/hooks/use-auto-search-products";
import type {
  AutoSearchProductSortDirection,
  AutoSearchProductSortField,
  AutoSearchProductsQuery,
} from "@/features/auto-search/types/auto-search";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/features/auto-search/utils/auto-search-utils";

type Props = { id: string };

export default function AutoSearchProducts({ id }: Props) {
  const t = useTranslations("AutoSearch");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const requestedSize = Number(searchParams.get("size")) || 20;
  const size = [10, 20, 50].includes(requestedSize) ? requestedSize : 20;
  const sortBy: AutoSearchProductSortField =
    searchParams.get("sortBy") === "PRICE" ? "PRICE" : "CREATED_AT";
  const direction: AutoSearchProductSortDirection =
    sortBy === "PRICE" && searchParams.get("direction") === "ASC"
      ? "ASC"
      : "DESC";
  const query: AutoSearchProductsQuery = { page, size, sortBy, direction };
  const {
    data: productResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useAutoSearchProducts(id, true, query);
  const products = productResponse?.data ?? [];

  const updateParams = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) nextParams.delete(key);
      else nextParams.set(key, value);
    }
    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const sortValue =
    sortBy === "PRICE"
      ? direction === "ASC"
        ? "PRICE:ASC"
        : "PRICE:DESC"
      : "CREATED_AT:DESC";
  const sortOptions = [
    { value: "CREATED_AT:DESC", label: t("sortNewest") },
    { value: "PRICE:ASC", label: t("sortPriceAscending") },
    { value: "PRICE:DESC", label: t("sortPriceDescending") },
  ] as const;
  const sizeOptions = [10, 20, 50].map((option) => ({
    value: String(option),
    label: t("productsPerPage", { count: option }),
  }));

  const controls = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Select
        className="w-52!"
        options={sortOptions}
        value={sortValue}
        onChange={(value) => {
          const [nextSortBy, nextDirection] = value.split(":") as [
            AutoSearchProductSortField,
            AutoSearchProductSortDirection,
          ];
          updateParams({
            page: null,
            sortBy: nextSortBy,
            direction: nextDirection,
          });
        }}
      />
      <Select
        options={sizeOptions}
        value={String(size)}
        onChange={(value) => updateParams({ page: null, size: value })}
      />
    </div>
  );

  const pagination = (
    <nav
      aria-label={t("productsPaginationLabel")}
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <button
        type="button"
        disabled={
          !(productResponse?.metadata?.hasPrevious ?? page > 1) || isFetching
        }
        onClick={() => updateParams({ page: String(page - 1) })}
        className="h-10 rounded-lg border border-stroke-secondary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("previousPage")}
      </button>
      <span aria-live="polite" className="text-sm text-text-secondary">
        {t("pageNumber", { page })}
      </span>
      <button
        type="button"
        disabled={
          !(productResponse?.metadata?.hasNext ?? products.length === size) ||
          isFetching
        }
        onClick={() => updateParams({ page: String(page + 1) })}
        className="h-10 rounded-lg border border-stroke-secondary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("nextPage")}
      </button>
    </nav>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {controls}
        <div className="flex justify-center rounded-xl bg-surface-secondary px-5 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-surface-secondary p-5 text-sm text-text-secondary">
        <p>{t("productsError")}</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-2 font-medium text-text-brand hover:underline"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (!products.length && page > 1) {
    return (
      <div className="space-y-4">
        {controls}
        <div className="rounded-xl bg-surface-secondary px-5 py-8 text-center text-sm text-text-secondary">
          {t("noProductsOnPage")}
        </div>
        {pagination}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {controls}
      {products.length ? (
        <ul className="divide-y divide-stroke-secondary rounded-xl border border-stroke-primary-subtle bg-surface-primary">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex flex-col gap-1.5 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                href={`/product/${product.id}?q=${encodeURIComponent(product.title)}`}
                className="flex min-w-0 flex-1 flex-col gap-3 rounded-lg outline-none transition-colors hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-stroke-brand sm:flex-row sm:items-center sm:justify-between sm:px-2 sm:py-1"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-secondary sm:size-16">
                    {(product.images?.[0] ?? product.imageKeys?.[0]) ? (
                      <Image
                        src={product.images?.[0] ?? product.imageKeys?.[0] ?? ""}
                        alt={product.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-text-tertiary">
                        <ImageIcon aria-hidden="true" className="size-5" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {product.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                      {product.description}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-text-tertiary">
                      <MapPin aria-hidden="true" className="size-3.5" />
                      {product.address?.city ?? t("unknownCity")}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-semibold text-text-primary">
                  {formatPrice(product.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl bg-surface-secondary px-5 py-8 text-center text-sm text-text-secondary">
          {t("noProducts")}
        </div>
      )}
      {pagination}
    </div>
  );
}
