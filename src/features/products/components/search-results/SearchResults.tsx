"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchProducts } from "../../hooks/use-products";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProductCardsGrid from "../prod-cards-grid/ProductCardsGrid";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import { useSearchParams } from "next/navigation";

const SearchResults = () => {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const { ref, inView } = useInView({ rootMargin: "300px" });
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
  } = useSearchProducts(query);

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

  if (isError && !data) return <p>Щось пішло не так.</p>;

  if (!data) return null;

  const cards = data.pages.flatMap((page) => page.data);

  const { totalElements } = data.pages[0].metadata;

  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">
        {query ? `Результати пошуку для «${query}»` : "Пошук"}
      </h1>
      {totalElements === 0 ? (
        <p>Не знайдено жодного товару</p>
      ) : (
        <p className="mb-4">Знайдено товарів: {totalElements}</p>
      )}
      <ProductCardsGrid cards={cards} />
      <div ref={ref} className="h-px" aria-hidden="true" />
      {isFetchingNextPage && <LoadingSpinner />}

      {isFetchNextPageError && (
        <NextPageFetchError onRetry={() => void fetchNextPage()} />
      )}
    </>
  );
};

export default SearchResults;
