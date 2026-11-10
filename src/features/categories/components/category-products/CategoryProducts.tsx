"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { BellIcon } from "@/assets/icons/BellIcon";
import { FilterIcon } from "@/assets/icons/FilterIcon";
import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import { Pagination } from "@/components/ui/pagination";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import ProductSortSelect from "@/features/products/components/product-sort-select/ProductSortSelect";
import { useSearchProducts } from "@/features/products/hooks/use-products";
import {
  CATEGORY_PRODUCT_SORT_VALUES,
  DEFAULT_CATEGORY_PRODUCT_SORT,
  getProductSortQuery,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";
import { Link } from "@/i18n/navigation";
import type { SearchProductsQuery } from "@/types/product";

import type { CategoryAttribute } from "../../types/category";
import { ActiveFilterChips } from "../category-filters/ActiveFilterChips";
import {
  EMPTY_FILTERS,
  formatListingsFound,
  getActiveFilterChips,
  toSearchFilters,
  type CategoryFilters,
} from "../category-filters/category-filters";
import { CategoryFiltersPanel } from "../category-filters/CategoryFiltersPanel";

const FILTERS_DEBOUNCE_MS = 400;
const FILTERS_PANEL_ID = "category-filters";
const PAGE_SIZE = 18;

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

export default function CategoryProducts({
  categoryId,
  attributes,
}: {
  categoryId: string;
  attributes: CategoryAttribute[];
}) {
  const [sort, setSort] = useState<ProductSortOption>(DEFAULT_CATEGORY_PRODUCT_SORT);
  const [filters, setFilters] = useState<CategoryFilters>(EMPTY_FILTERS);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  // First page of the loaded run; "Показати ще" appends pages after it.
  const [startPage, setStartPage] = useState(1);
  const appliedFilters = useDebouncedValue(filters, FILTERS_DEBOUNCE_MS);
  const resultsRef = useRef<HTMLDivElement>(null);

  const changeFilters = (next: CategoryFilters) => {
    setFilters(next);
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg font-medium text-text-secondary" aria-live="polite">
            {totalElements !== undefined && formatListingsFound(totalElements)}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="lg:hidden"
              aria-expanded={isMobileFiltersOpen}
              aria-controls={FILTERS_PANEL_ID}
              onClick={() => setIsMobileFiltersOpen((open) => !open)}
            >
              <FilterIcon size={16} />
              Фільтри{activeChips.length > 0 && ` · ${activeChips.length}`}
            </Button>
            <ProductSortSelect
              value={sort}
              onChange={changeSort}
              sortValues={CATEGORY_PRODUCT_SORT_VALUES}
            />
            {/* TODO: prefill the auto-search form with the current category and filters. */}
            <Button asChild variant="outline">
              <Link href="/auto-search">
                <BellIcon size={16} />
                Стежити за пошуком
              </Link>
            </Button>
          </div>
        </div>
        <ActiveFilterChips
          chips={activeChips}
          filters={filters}
          onChange={changeFilters}
          onClearAll={() => changeFilters(EMPTY_FILTERS)}
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
            <EmptyResults
              hasFilters={activeChips.length > 0}
              onReset={() => changeFilters(EMPTY_FILTERS)}
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

function EmptyResults({
  hasFilters,
  onReset,
}: {
  hasFilters: boolean;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-stroke-secondary bg-surface-primary px-6 py-16 text-center">
      <h2 className="text-xl font-semibold text-text-primary">Нічого не знайдено</h2>
      <p className="max-w-sm text-sm text-text-secondary">
        {hasFilters
          ? "Спробуйте змінити або скинути фільтри."
          : "У цій категорії поки немає оголошень."}
      </p>
      {hasFilters && (
        <Button variant="outline" className="mt-4" onClick={onReset}>
          Скинути фільтри
        </Button>
      )}
    </div>
  );
}
