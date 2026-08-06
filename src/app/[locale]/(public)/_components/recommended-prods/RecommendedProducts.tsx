"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSearchProducts } from "@/features/products/hooks/use-products";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";

export default function RecommendedProducts() {
  const { ref, inView } = useInView({ rootMargin: "300px" });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
  } = useSearchProducts("");

  console.log("data: ", data);

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
    <section className="py-4 px-15">
      <h2 className="mb-7 text-3xl font-semibold text-neutral-950">
        Товари, що вам можуть сподобатись
      </h2>
      <ProductCardsGrid cards={cards} />
      <div ref={ref} className="h-px" aria-hidden="true" />
      {isFetchingNextPage && <LoadingSpinner />}
      {isFetchNextPageError && (
        <NextPageFetchError onRetry={() => void fetchNextPage()} />
      )}
    </section>
  );
}
