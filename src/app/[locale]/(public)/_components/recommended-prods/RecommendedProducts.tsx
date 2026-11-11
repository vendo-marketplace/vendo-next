"use client";

import { useMemo, useRef, useState } from "react";

import { Pagination } from "@/components/ui/pagination";

import { useSearchProductsPage } from "@/features/products/hooks/use-products";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import ProductSortSelect from "@/features/products/components/product-sort-select/ProductSortSelect";
import { useProductSortParams } from "@/features/products/hooks/use-product-sort-params";
import { getProductSortQuery } from "@/features/products/lib/product-sort";
import type { SearchProductsQuery } from "@/types/product";

export default function RecommendedProducts() {
  const { sort, setSort: updateSort } = useProductSortParams();
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const setSort = (value: Parameters<typeof updateSort>[0]) => {
    setPage(1);
    updateSort(value);
  };
  const productsQuery = useMemo((): SearchProductsQuery => {
    const sortQuery = getProductSortQuery(sort);
    return { page, size: 28, ...(sortQuery && { sort: sortQuery }) };
  }, [page, sort]);
  const {
    data,
    isFetching,
    isLoading,
  } = useSearchProductsPage("", productsQuery);

  const cards = data?.data ?? [];
  const pagination = data?.metadata;

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!isLoading && cards.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="page-container scroll-mt-18 space-y-5 py-4 md:scroll-mt-23 lg:space-y-7"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Phones: just the centred title; sorting a recommendation feed there is noise. */}
        <h2 className="min-w-0 text-center text-xl font-semibold text-text-primary sm:text-left sm:text-2xl lg:text-3xl">
          Товари, що вам можуть сподобатись
        </h2>
        <div className="hidden shrink-0 justify-end sm:ml-4 sm:flex">
          <ProductSortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <ProductCardsGrid cards={cards} isLoading={isLoading || isFetching} />
      {pagination && (
        <Pagination
          label="Сторінки рекомендованих товарів"
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      )}
    </section>
  );
}
