"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import { Pagination } from "@/components/ui/pagination";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import { useSearchProducts } from "@/features/products/hooks/use-products";
import {
  DEFAULT_CATEGORY_PRODUCT_SORT,
  getProductSortQuery,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SearchProductsQuery } from "@/types/product";

import { ActiveFilterChips } from "../category-filters/ActiveFilterChips";
import { CategoryFiltersPanel } from "../category-filters/CategoryFiltersPanel";
import { getActiveFilterChips } from "../category-filters/lib/active-filter-chips";
import { toSearchFilters } from "../category-filters/lib/filter-query";
import { EMPTY_FILTERS, type CategoryFilters } from "../category-filters/lib/filter-state";
import type { FilterAttribute } from "../category-filters/lib/mock-filter-attributes";
import { CategoryEmptyResults } from "./CategoryEmptyResults";
import { CategoryToolbar } from "./CategoryToolbar";

const FILTERS_DEBOUNCE_MS = 400;
const FILTERS_PANEL_ID = "category-filters";
const PAGE_SIZE = 18;

export default function CategoryProducts({
  categoryId,
  attributes,
}: {
  categoryId: string;
  attributes: FilterAttribute[];
}) {
  const [sort, setSort] = useState<ProductSortOption>(DEFAULT_CATEGORY_PRODUCT_SORT);
  const [filters, setFilters] = useState<CategoryFilters>(EMPTY_FILTERS);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  // First page of the loaded run; "Показати ще" appends pages after it.
  const [startPage, setStartPage] = useState(1);
  const appliedFilters = useDebouncedValue(filters, FILTERS_DEBOUNCE_MS);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Any filter change starts the results over from the first page.
  const changeFilters = (update: (current: CategoryFilters) => CategoryFilters) => {
    setFilters(update);
    setStartPage(1);
  };

  const changeSort = (next: ProductSortOption) => {
    setSort(next);
    setStartPage(1);
  };

  const goToPage = (page: number) => {
    setStartPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const query = useMemo<SearchProductsQuery>(
    () => ({
      categoryId,
      active: true,
      sort: getProductSortQuery(sort),
      ...toSearchFilters(appliedFilters, attributes),
      page: startPage,
      size: PAGE_SIZE,
    }),
    [appliedFilters, attributes, categoryId, sort, startPage],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isLoading,
  } = useSearchProducts("", query);

  const cards = data?.pages.flatMap((page) => page.data) ?? [];
  const lastLoadedPage = data?.pages.at(-1)?.metadata;
  const totalElements = data?.pages[0].metadata.totalElements;
  const activeChips = getActiveFilterChips(filters, attributes);

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-4 border-b border-stroke-primary-subtle pb-4">
        <CategoryToolbar
          totalElements={totalElements}
          sort={sort}
          onSortChange={changeSort}
          activeFiltersCount={activeChips.length}
          filtersPanelId={FILTERS_PANEL_ID}
          isFiltersOpen={isMobileFiltersOpen}
          onToggleFilters={() => setIsMobileFiltersOpen((open) => !open)}
        />
        <ActiveFilterChips
          chips={activeChips}
          onRemove={(chip) => changeFilters(chip.remove)}
          onClearAll={() => changeFilters(() => EMPTY_FILTERS)}
        />
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-[311px_minmax(0,1fr)]">
        <div className={isMobileFiltersOpen ? "block" : "hidden lg:block"}>
          <CategoryFiltersPanel
            id={FILTERS_PANEL_ID}
            filters={filters}
            attributes={attributes}
            onChange={changeFilters}
          />
        </div>

        <div ref={resultsRef} className="flex min-w-0 scroll-mt-28 flex-col gap-7">
          {isError && !data ? (
            <p className="text-sm text-text-secondary">Не вдалося завантажити товари.</p>
          ) : totalElements === 0 ? (
            <CategoryEmptyResults
              hasFilters={activeChips.length > 0}
              onReset={() => changeFilters(() => EMPTY_FILTERS)}
            />
          ) : (
            <ProductCardsGrid cards={cards} isLoading={isLoading} withSidebar />
          )}
          {isFetchingNextPage && <LoadingSpinner />}
          {isFetchNextPageError && (
            <NextPageFetchError onRetry={() => void fetchNextPage()} />
          )}
          {hasNextPage && !isFetchingNextPage && !isFetchNextPageError && (
            <Button
              variant="secondary"
              size="lg"
              className="mx-auto px-8"
              onClick={() => void fetchNextPage()}
            >
              Показати ще
            </Button>
          )}
          {lastLoadedPage && (
            <Pagination
              currentPage={lastLoadedPage.page}
              totalPages={lastLoadedPage.totalPages}
              onPageChange={goToPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
