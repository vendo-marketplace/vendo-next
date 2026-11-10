"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { BellIcon } from "@/assets/icons/BellIcon";
import { FilterIcon } from "@/assets/icons/FilterIcon";
import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { NextPageFetchError } from "@/components/ui/next-page-fetch-error";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import ProductSortSelect from "@/features/products/components/product-sort-select/ProductSortSelect";
import { useSearchProducts } from "@/features/products/hooks/use-products";
import {
  CATEGORY_PRODUCT_SORT_VALUES,
  DEFAULT_CATEGORY_PRODUCT_SORT,
  getProductSortQuery,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Link } from "@/i18n/navigation";
import type { SearchProductsQuery } from "@/types/product";

import type { CategoryAttribute } from "../../types/category";
import { ActiveFilterChips } from "../category-filters/ActiveFilterChips";
import { CategoryFiltersPanel } from "../category-filters/CategoryFiltersPanel";
import { getActiveFilterChips } from "../category-filters/lib/active-filter-chips";
import { formatListingsFound } from "../category-filters/lib/filter-display";
import { toSearchFilters } from "../category-filters/lib/filter-query";
import { EMPTY_FILTERS, type CategoryFilters } from "../category-filters/lib/filter-state";

const FILTERS_DEBOUNCE_MS = 400;
const FILTERS_PANEL_ID = "category-filters";

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
  const appliedFilters = useDebouncedValue(filters, FILTERS_DEBOUNCE_MS);
  const { ref, inView } = useInView({ rootMargin: "300px" });

  const query = useMemo<SearchProductsQuery>(
    () => ({
      categoryId,
      active: true,
      sort: getProductSortQuery(sort),
      ...toSearchFilters(appliedFilters, attributes),
      page: 1,
      size: 20,
    }),
    [appliedFilters, attributes, categoryId, sort],
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

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchNextPageError, isFetchingNextPage]);

  const cards = data?.pages.flatMap((page) => page.data) ?? [];
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
              onChange={setSort}
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
          onRemove={(chip) => setFilters(chip.remove)}
          onClearAll={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[311px_minmax(0,1fr)]">
        <div className={isMobileFiltersOpen ? "block" : "hidden lg:block"}>
          <CategoryFiltersPanel
            id={FILTERS_PANEL_ID}
            filters={filters}
            attributes={attributes}
            onChange={setFilters}
          />
        </div>

        <div className="min-w-0">
          {isError && !data ? (
            <p className="text-sm text-text-secondary">Не вдалося завантажити товари.</p>
          ) : totalElements === 0 ? (
            <p className="py-12 text-center text-text-secondary">
              За цими фільтрами товарів не знайдено.
            </p>
          ) : (
            <ProductCardsGrid cards={cards} isLoading={isLoading} />
          )}
          <div ref={ref} className="h-px" aria-hidden="true" />
          {isFetchingNextPage && <LoadingSpinner />}
          {isFetchNextPageError && (
            <NextPageFetchError onRetry={() => void fetchNextPage()} />
          )}
        </div>
      </div>
    </div>
  );
}
