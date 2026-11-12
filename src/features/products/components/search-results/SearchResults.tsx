"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button/button";
import { Pagination } from "@/components/ui/pagination";
import { ActiveFilterChips } from "@/features/categories/components/category-filters/ActiveFilterChips";
import { CategoryFiltersDrawer } from "@/features/categories/components/category-filters/CategoryFiltersDrawer";
import { CategoryFiltersPanel } from "@/features/categories/components/category-filters/CategoryFiltersPanel";
import { getActiveFilterChips } from "@/features/categories/components/category-filters/lib/active-filter-chips";
import { formatListingsFound } from "@/features/categories/components/category-filters/lib/filter-display";
import { toSearchFilters } from "@/features/categories/components/category-filters/lib/filter-query";
import {
  EMPTY_FILTERS,
  type CategoryFilters,
} from "@/features/categories/components/category-filters/lib/filter-state";
import { CategoryEmptyResults } from "@/features/categories/components/category-products/CategoryEmptyResults";
import { CategoryToolbar } from "@/features/categories/components/category-products/CategoryToolbar";
import { openPhotoSearch, usePhotoSearch } from "@/features/photo-search/lib/photo-search-store";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SearchProductsQuery } from "@/types/product";

import { useSearchProductsPage } from "../../hooks/use-products";
import {
  DEFAULT_PRODUCT_SORT,
  getProductSortQuery,
  PRODUCT_SORT_VALUES,
  type ProductSortOption,
} from "../../lib/product-sort";
import ProductCardsGrid from "../prod-cards-grid/ProductCardsGrid";
import { getCardCondition } from "../prod-cards-grid/prod-card/lib/card-specs";

const PAGE_SIZE = 18;
const FILTERS_DEBOUNCE_MS = 400;
// Search spans every category, so only the filters every listing has: city, price, condition.
const NO_ATTRIBUTES: never[] = [];

// Shown above photo search results: the searched photo, or a way back to pick one.
function PhotoSearchHeader({ photoUrl }: { photoUrl: string | null }) {
  if (!photoUrl) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-stroke-secondary bg-surface-primary p-4">
        <p className="text-sm text-text-secondary">
          Фото для пошуку не вибрано: його прибрали або сторінку оновили. Оберіть фото ще раз.
        </p>
        <Button variant="secondary" size="sm" onClick={openPhotoSearch}>
          Обрати фото
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL */}
      <img
        src={photoUrl}
        alt="Фото, за яким шукаємо"
        className="size-16 shrink-0 rounded-lg border border-stroke-secondary object-cover"
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-text-primary">Схожі оголошення</h1>
        {/* TODO(api): the backend has no image search yet; until it does, the newest
            listings are shown so the flow can be tried end to end. */}
        <p className="text-sm text-text-secondary">
          Пошук за фото ще в розробці, тож поки показуємо нові оголошення.
        </p>
      </div>
    </div>
  );
}

// The search page laid out like a category page: the filters sidebar on desktop, a
// "Фільтри" button with a sheet (phones) or side panel (tablets) below that.
const SearchResults = () => {
  const [sort, setSort] = useState<ProductSortOption>(DEFAULT_PRODUCT_SORT);
  const [filters, setFilters] = useState<CategoryFilters>(EMPTY_FILTERS);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const appliedFilters = useDebouncedValue(filters, FILTERS_DEBOUNCE_MS);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { photoUrl } = usePhotoSearch();
  const isPhotoSearch = params.get("photo") === "1";
  const query = isPhotoSearch ? "" : (params.get("q") ?? "");
  const page = Math.max(1, Number(params.get("page")) || 1);

  const setPage = (nextPage: number) => {
    const nextParams = new URLSearchParams(params.toString());
    if (nextPage === 1) nextParams.delete("page");
    else nextParams.set("page", String(nextPage));
    const queryString = nextParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: true });
  };

  // A new sort or filter starts the results over from the first page.
  const changeFilters = (update: (current: CategoryFilters) => CategoryFilters) => {
    setFilters(update);
    if (page !== 1) setPage(1);
  };

  const changeSort = (next: ProductSortOption) => {
    setSort(next);
    if (page !== 1) setPage(1);
  };

  const productsQuery = useMemo((): SearchProductsQuery => {
    const sortQuery = getProductSortQuery(sort);
    return {
      active: true,
      ...toSearchFilters(appliedFilters, NO_ATTRIBUTES),
      page,
      size: PAGE_SIZE,
      ...(sortQuery && { sort: sortQuery }),
    };
  }, [appliedFilters, page, sort]);
  const { data, isError, isFetching, isLoading } = useSearchProductsPage(query, productsQuery);

  if (isError && !data) return <p>Щось пішло не так.</p>;

  // TODO(api): "like-new" has no backend field yet, so it is narrowed down here.
  const conditions = appliedFilters.conditions;
  const cards = (data?.data ?? []).filter(
    (card) => !conditions.length || conditions.includes(getCardCondition(card)),
  );
  const pagination = data?.metadata;
  const totalElements = pagination?.totalElements;
  const activeChips = getActiveFilterChips(filters, NO_ATTRIBUTES);
  const showResults = !isPhotoSearch || Boolean(photoUrl);
  const resetFilters = () => changeFilters(() => EMPTY_FILTERS);
  const autoSearchQuery = {
    ...(filters.price.min && { minPrice: filters.price.min }),
    ...(filters.price.max && { maxPrice: filters.price.max }),
    ...(filters.cities[0] && { city: filters.cities[0] }),
  };

  return (
    <div className="flex flex-col gap-4">
      {isPhotoSearch ? (
        <PhotoSearchHeader photoUrl={photoUrl} />
      ) : (
        <div className="flex flex-col gap-1">
          {/* The query is the title, like a category name: "Смартфон", not "Результати пошуку для…". */}
          <h1 className="text-2xl font-semibold text-text-primary first-letter:uppercase">
            {query.trim() || "Пошук"}
          </h1>
          {/* Desktop shows the count in the toolbar, next to the sort. */}
          {totalElements !== undefined && (
            <p aria-hidden="true" className="text-sm text-text-secondary md:text-md lg:hidden">
              {formatListingsFound(totalElements)}
            </p>
          )}
        </div>
      )}

      {showResults && (
        <>
          <div className="flex flex-col gap-4 lg:border-b lg:border-stroke-primary-subtle lg:pb-4">
            <CategoryToolbar
              totalElements={totalElements}
              sort={sort}
              onSortChange={changeSort}
              sortValues={PRODUCT_SORT_VALUES}
              activeFiltersCount={activeChips.length}
              onOpenFilters={() => setIsMobileFiltersOpen(true)}
              autoSearchQuery={autoSearchQuery}
            />
            <ActiveFilterChips
              chips={activeChips}
              onRemove={(chip) => changeFilters(chip.remove)}
              onClearAll={resetFilters}
            />
          </div>

          <CategoryFiltersDrawer
            open={isMobileFiltersOpen}
            onOpenChange={setIsMobileFiltersOpen}
            totalElements={totalElements}
            chips={activeChips}
            onRemoveChip={(chip) => changeFilters(chip.remove)}
            onReset={resetFilters}
            autoSearchQuery={autoSearchQuery}
          >
            <CategoryFiltersPanel
              inDrawer
              filters={filters}
              attributes={NO_ATTRIBUTES}
              onChange={changeFilters}
            />
          </CategoryFiltersDrawer>

          <div className="grid items-start gap-3 lg:grid-cols-[311px_minmax(0,1fr)]">
            <div className="hidden lg:block">
              <CategoryFiltersPanel
                filters={filters}
                attributes={NO_ATTRIBUTES}
                onChange={changeFilters}
              />
            </div>

            <div className="flex min-w-0 flex-col gap-7">
              {totalElements === 0 ? (
                <CategoryEmptyResults
                  hasFilters={activeChips.length > 0}
                  onReset={resetFilters}
                  emptyMessage="Спробуйте інше слово або коротший запит."
                />
              ) : (
                <ProductCardsGrid cards={cards} isLoading={isLoading || isFetching} withSidebar />
              )}
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  label="Сторінки результатів пошуку"
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
