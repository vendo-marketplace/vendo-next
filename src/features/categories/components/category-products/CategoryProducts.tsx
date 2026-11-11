"use client";

import { useMemo, useRef, useState } from "react";

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
import { CategoryFiltersDrawer } from "../category-filters/CategoryFiltersDrawer";
import { CategoryFiltersPanel } from "../category-filters/CategoryFiltersPanel";
import { getActiveFilterChips } from "../category-filters/lib/active-filter-chips";
import { toSearchFilters } from "../category-filters/lib/filter-query";
import { EMPTY_FILTERS, type CategoryFilters } from "../category-filters/lib/filter-state";
import type { FilterAttribute } from "../category-filters/lib/mock-filter-attributes";
import { CategoryEmptyResults } from "./CategoryEmptyResults";
import { useReportListingsCount } from "../category-page/ListingsCount";
import { CategoryToolbar } from "./CategoryToolbar";
import { getSampleListings, sortListings } from "./lib/sample-listings";
import { getCardCondition } from "@/features/products/components/prod-cards-grid/prod-card/lib/card-specs";

const FILTERS_DEBOUNCE_MS = 400;
const FILTERS_PANEL_ID = "category-filters";
const PAGE_SIZE = 18;
const FIRST_CLIENT_PAGES = { start: 1, end: 1 };

export default function CategoryProducts({
  categoryId,
  attributes,
  initialFilters = EMPTY_FILTERS,
}: {
  categoryId: string;
  attributes: FilterAttribute[];
  // A brand page starts with its brand already selected.
  initialFilters?: CategoryFilters;
}) {
  const [sort, setSort] = useState<ProductSortOption>(DEFAULT_CATEGORY_PRODUCT_SORT);
  const [filters, setFilters] = useState<CategoryFilters>(initialFilters);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  // First page of the loaded run; "Показати ще" appends pages after it.
  const [startPage, setStartPage] = useState(1);
  // Pages shown when the whole listing is already on the client (see isPagedOnClient).
  const [clientPages, setClientPages] = useState(FIRST_CLIENT_PAGES);
  const appliedFilters = useDebouncedValue(filters, FILTERS_DEBOUNCE_MS);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Any filter change starts the results over from the first page.
  const changeFilters = (update: (current: CategoryFilters) => CategoryFilters) => {
    setFilters(update);
    setStartPage(1);
    setClientPages(FIRST_CLIENT_PAGES);
  };

  const changeSort = (next: ProductSortOption) => {
    setSort(next);
    setStartPage(1);
    setClientPages(FIRST_CLIENT_PAGES);
  };

  const scrollToResults = () =>
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

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

  const sampleListings = useMemo(
    () => getSampleListings(categoryId, appliedFilters, attributes),
    [appliedFilters, attributes, categoryId],
  );
  const conditions = appliedFilters.conditions;
  const realCards = (data?.pages.flatMap((page) => page.data) ?? []).filter(
    (card) => !conditions.length || conditions.includes(getCardCondition(card)),
  );
  // Samples join the real listings once the last real page is in, sorted together.
  const cards =
    data && !hasNextPage ? sortListings([...realCards, ...sampleListings], sort) : realCards;
  const lastLoadedPage = data?.pages.at(-1)?.metadata;
  // TODO(api): while the real listings fit on one page, they and the samples are paged here,
  // so "Показати ще" and the pagination work as in the mockup. Server paging takes over after.
  const isPagedOnClient = Boolean(data && data.pages.length === 1 && !hasNextPage && startPage === 1);
  const clientTotalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const shownCards = isPagedOnClient
    ? cards.slice((clientPages.start - 1) * PAGE_SIZE, clientPages.end * PAGE_SIZE)
    : cards;
  const canShowMore = isPagedOnClient ? clientPages.end < clientTotalPages : Boolean(hasNextPage);
  const currentPage = isPagedOnClient ? clientPages.end : lastLoadedPage?.page;
  const totalPages = isPagedOnClient ? clientTotalPages : lastLoadedPage?.totalPages;

  const showMore = () => {
    if (isPagedOnClient) setClientPages(({ start, end }) => ({ start, end: end + 1 }));
    else void fetchNextPage();
  };

  const goToPage = (page: number) => {
    if (isPagedOnClient) setClientPages({ start: page, end: page });
    else setStartPage(page);
    scrollToResults();
  };
  const realTotal = data?.pages[0].metadata.totalElements;
  // With every page in, the count is what is shown (like-new is only known on the client).
  const totalElements =
    realTotal === undefined
      ? undefined
      : hasNextPage
        ? realTotal + sampleListings.length
        : cards.length;
  useReportListingsCount(totalElements);
  const activeChips = getActiveFilterChips(filters, attributes);
  // Auto-search stores one city and a price range; the remaining filters are not supported there.
  const autoSearchQuery = {
    categoryId,
    ...(filters.price.min && { minPrice: filters.price.min }),
    ...(filters.price.max && { maxPrice: filters.price.max }),
    ...(filters.cities[0] && { city: filters.cities[0] }),
  };

  return (
    <div className="mt-3 flex flex-col gap-4 sm:mt-8">
      <div className="flex flex-col gap-4 lg:border-b lg:border-stroke-primary-subtle lg:pb-4">
        <CategoryToolbar
          totalElements={totalElements}
          sort={sort}
          onSortChange={changeSort}
          activeFiltersCount={activeChips.length}
          onOpenFilters={() => setIsMobileFiltersOpen(true)}
          autoSearchQuery={autoSearchQuery}
        />
        <ActiveFilterChips
          chips={activeChips}
          onRemove={(chip) => changeFilters(chip.remove)}
          onClearAll={() => changeFilters(() => EMPTY_FILTERS)}
        />
      </div>

      <CategoryFiltersDrawer
        open={isMobileFiltersOpen}
        onOpenChange={setIsMobileFiltersOpen}
        totalElements={totalElements}
        chips={activeChips}
        onRemoveChip={(chip) => changeFilters(chip.remove)}
        onReset={() => changeFilters(() => EMPTY_FILTERS)}
        autoSearchQuery={autoSearchQuery}
      >
        <CategoryFiltersPanel
          inDrawer
          filters={filters}
          attributes={attributes}
          onChange={changeFilters}
        />
      </CategoryFiltersDrawer>

      <div className="grid items-start gap-3 lg:grid-cols-[311px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <CategoryFiltersPanel
            id={FILTERS_PANEL_ID}
            filters={filters}
            attributes={attributes}
            onChange={changeFilters}
          />
        </div>

        <div ref={resultsRef} className="flex min-w-0 scroll-mt-18 flex-col gap-7 md:scroll-mt-23">
          {isError && !data ? (
            <p className="text-sm text-text-secondary">Не вдалося завантажити товари.</p>
          ) : totalElements === 0 ? (
            <CategoryEmptyResults
              hasFilters={activeChips.length > 0}
              onReset={() => changeFilters(() => EMPTY_FILTERS)}
            />
          ) : (
            <ProductCardsGrid cards={shownCards} isLoading={isLoading} withSidebar />
          )}
          {isFetchingNextPage && <LoadingSpinner />}
          {isFetchNextPageError && (
            <NextPageFetchError onRetry={() => void fetchNextPage()} />
          )}
          {canShowMore && !isFetchingNextPage && !isFetchNextPageError && (
            <Button variant="secondary" size="lg" className="mx-auto px-8" onClick={showMore}>
              Показати ще
            </Button>
          )}
          {currentPage !== undefined && totalPages !== undefined && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          )}
        </div>
      </div>
    </div>
  );
}
