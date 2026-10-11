"use client";

import { useMemo, useState } from "react";

import { useSearchProductsPage } from "@/features/products/hooks/use-products";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import ProductSortSelect from "@/features/products/components/product-sort-select/ProductSortSelect";
import { useProductSortParams } from "@/features/products/hooks/use-product-sort-params";
import { getProductSortQuery } from "@/features/products/lib/product-sort";
import type { SearchProductsQuery } from "@/types/product";

export default function RecommendedProducts() {
  const { sort, setSort: updateSort } = useProductSortParams();
  const [page, setPage] = useState(1);
  const setSort = (value: Parameters<typeof updateSort>[0]) => {
    setPage(1);
    updateSort(value);
  };
  const productsQuery = useMemo(() => ({
    page,
    size: 25,
    sort: getProductSortQuery(sort),
  }) satisfies SearchProductsQuery, [page, sort]);
  const {
    data,
    isFetching,
    isLoading,
  } = useSearchProductsPage("", productsQuery);

  const cards = data?.data ?? [];
  const pagination = data?.metadata;
  const visiblePages = pagination
    ? Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
        const start = Math.min(
          Math.max(1, page - 2),
          Math.max(1, pagination.totalPages - 4),
        );
        return start + index;
      })
    : [];

  if (!isLoading && cards.length === 0) return null;

  return (
    <section className="py-4 px-15 space-y-7">
      <h2 className="text-3xl font-semibold text-text-primary">
        Товари, що вам можуть сподобатись
      </h2>
      <div className="flex justify-end">
        <ProductSortSelect value={sort} onChange={setSort} />
      </div>

      <ProductCardsGrid cards={cards} isLoading={isLoading || isFetching} />
      {pagination && pagination.totalPages > 1 && (
        <nav
          aria-label="Сторінки рекомендованих товарів"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            disabled={!pagination.hasPrevious}
            className="h-10 rounded-lg border border-stroke-secondary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Назад
          </button>
          {visiblePages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              aria-current={pageNumber === page ? "page" : undefined}
              onClick={() => setPage(pageNumber)}
              className={`size-10 rounded-lg border text-sm font-medium transition-colors ${
                pageNumber === page
                  ? "border-surface-brand bg-surface-brand text-text-invert"
                  : "border-stroke-secondary text-text-primary hover:bg-surface-secondary"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            disabled={!pagination.hasNext}
            className="h-10 rounded-lg border border-stroke-secondary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Далі
          </button>
        </nav>
      )}
    </section>
  );
}
