"use client";

import { useMemo, useRef, useState } from "react";

import { Pagination } from "@/components/ui/pagination";

import { useSearchProductsPage } from "@/features/products/hooks/use-products";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import type { SearchProductsQuery } from "@/types/product";

const PAGE_SIZE = 28;

// A recommendation feed under a centred title, with no sorting: the order is the
// recommendation itself.
export default function RecommendedProducts() {
  const [page, setPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const productsQuery = useMemo((): SearchProductsQuery => ({ page, size: PAGE_SIZE }), [page]);
  const { data, isFetching, isLoading } = useSearchProductsPage("", productsQuery);

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
      className="page-container scroll-mt-18 space-y-5 py-4 md:scroll-mt-20 md:space-y-7 lg:scroll-mt-23"
    >
      <h2 className="text-center text-xl font-semibold text-text-primary sm:text-2xl lg:text-3xl">
        Товари, що вам можуть сподобатись
      </h2>

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
