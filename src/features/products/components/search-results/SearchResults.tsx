"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSearchProductsPage } from "../../hooks/use-products";
import ProductCardsGrid from "../prod-cards-grid/ProductCardsGrid";
import ProductSortSelect from "../product-sort-select/ProductSortSelect";
import type { SearchProductsQuery } from "@/types/product";
import {
  DEFAULT_PRODUCT_SORT,
  getProductSortQuery,
  type ProductSortOption,
} from "../../lib/product-sort";

const SearchResults = () => {
  const [sort, setSort] = useState<ProductSortOption>(DEFAULT_PRODUCT_SORT);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const productsQuery = useMemo(() => ({
    page,
    size: 20,
    sort: getProductSortQuery(sort),
  }) satisfies SearchProductsQuery, [page, sort]);
  const {
    data,
    isError,
    isFetching,
    isLoading,
  } = useSearchProductsPage(query, productsQuery);

  if (isError && !data) return <p>Щось пішло не так.</p>;

  const cards = data?.data ?? [];
  const pagination = data?.metadata;
  const setPage = (nextPage: number) => {
    const nextParams = new URLSearchParams(params.toString());
    if (nextPage === 1) nextParams.delete("page");
    else nextParams.set("page", String(nextPage));
    const queryString = nextParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: true,
    });
  };
  const visiblePages = pagination
    ? Array.from(
        { length: Math.min(5, pagination.totalPages) },
        (_, index) => {
          const start = Math.min(
            Math.max(1, page - 2),
            Math.max(1, pagination.totalPages - 4),
          );
          return start + index;
        },
      )
    : [];

  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">
        {query ? `Результати пошуку для «${query}»` : "Пошук"}
      </h1>
      {pagination &&
        (pagination.totalElements === 0 ? (
          <p>Не знайдено жодного товару</p>
        ) : (
          <p className="mb-4">Знайдено товарів: {pagination.totalElements}</p>
        ))}
      <div className="mb-4 flex justify-end">
        <ProductSortSelect value={sort} onChange={setSort} />
      </div>
      <ProductCardsGrid cards={cards} isLoading={isLoading || isFetching} />
      {pagination && pagination.totalPages > 1 && (
        <nav
          aria-label="Сторінки результатів пошуку"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage(page - 1)}
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
            onClick={() => setPage(page + 1)}
            disabled={!pagination.hasNext}
            className="h-10 rounded-lg border border-stroke-secondary px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Далі
          </button>
        </nav>
      )}
    </>
  );
};

export default SearchResults;
