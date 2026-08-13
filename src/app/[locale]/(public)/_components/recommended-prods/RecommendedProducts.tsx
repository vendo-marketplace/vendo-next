"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSearchProducts } from "@/features/products/hooks/use-products";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import ProductSortSelect from "@/features/products/components/product-sort-select/ProductSortSelect";
import { useProductSortParams } from "@/features/products/hooks/use-product-sort-params";
import { getProductSortQuery } from "@/features/products/lib/product-sort";
import type { SearchProductsQuery } from "@/types/product";

export default function RecommendedProducts() {
  const { sort, setSort } = useProductSortParams();
  const { ref, inView } = useInView({ rootMargin: "300px" });
  const productsQuery = {
    page: 1,
    size: 25,
    sort: getProductSortQuery(sort),
  } satisfies SearchProductsQuery;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
  } = useSearchProducts("", productsQuery);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    inView,
    isFetchNextPageError,
    isFetchingNextPage,
  ]);

  if (isLoading) return <LoadingSpinner />;

  if (!data) return null;

  const cards = data.pages.flatMap((page) => page.data);

  if (cards.length === 0) return null;
  return (
    <section className="py-4 px-15 space-y-7">
      <h2 className="text-3xl font-semibold text-neutral-950">
        Товари, що вам можуть сподобатись
      </h2>
      <div className="flex justify-between">
        <span>Cities</span>
        <ProductSortSelect value={sort} onChange={setSort} />
      </div>
      <ProductCardsGrid cards={cards} />
      <div ref={ref} className="h-px" aria-hidden="true" />
      {isFetchingNextPage && <LoadingSpinner />}
      {isFetchNextPageError && (
        <NextPageFetchError onRetry={() => void fetchNextPage()} />
      )}
    </section>
  );
}
