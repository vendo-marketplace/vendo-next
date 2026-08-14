"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchProducts } from "../../hooks/use-products";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProductCardsGrid from "../prod-cards-grid/ProductCardsGrid";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import { useSearchParams } from "next/navigation";
import type { SearchProductsQuery } from "@/types/product";
import ProductSortSelect from "../product-sort-select/ProductSortSelect";
import {
  DEFAULT_PRODUCT_SORT,
  getProductSortQuery,
  type ProductSortOption,
} from "../../lib/product-sort";

const SearchResults = () => {
  const [sort, setSort] = useState<ProductSortOption>(DEFAULT_PRODUCT_SORT);
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const { ref, inView } = useInView({ rootMargin: "300px" });
  const productsQuery = {
    page: 1,
    size: 20,
    sort: getProductSortQuery(sort),
  } satisfies SearchProductsQuery;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
  } = useSearchProducts(query, productsQuery);

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

  if (isError && !data) return <p>Щось пішло не так.</p>;

  const cards = data?.pages.flatMap((page) => page.data) ?? [];
  const totalElements = data?.pages[0].metadata.totalElements;

  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">
        {query ? `Результати пошуку для «${query}»` : "Пошук"}
      </h1>
      {totalElements !== undefined &&
        (totalElements === 0 ? (
          <p>Не знайдено жодного товару</p>
        ) : (
          <p className="mb-4">Знайдено товарів: {totalElements}</p>
        ))}
      <div className="mb-4 flex justify-end">
        <ProductSortSelect value={sort} onChange={setSort} />
      </div>
      <ProductCardsGrid cards={cards} isLoading={isLoading} />
      <div ref={ref} className="h-px" aria-hidden="true" />
      {isFetchingNextPage && <LoadingSpinner />}

      {isFetchNextPageError && (
        <NextPageFetchError onRetry={() => void fetchNextPage()} />
      )}
    </>
  );
};

export default SearchResults;
