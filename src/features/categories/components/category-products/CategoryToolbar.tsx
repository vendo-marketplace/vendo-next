"use client";

import { BellIcon } from "@/assets/icons/BellIcon";
import { FilterIcon } from "@/assets/icons/FilterIcon";
import { Button } from "@/components/ui/button/button";
import ProductSortSelect from "@/features/products/components/product-sort-select/ProductSortSelect";
import {
  CATEGORY_PRODUCT_SORT_VALUES,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";
import { Link } from "@/i18n/navigation";

import { formatListingsFound } from "../category-filters/lib/filter-display";

export function CategoryToolbar({
  totalElements,
  sort,
  onSortChange,
  activeFiltersCount,
  filtersPanelId,
  isFiltersOpen,
  onToggleFilters,
}: {
  totalElements?: number;
  sort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  activeFiltersCount: number;
  filtersPanelId: string;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-lg font-medium text-text-secondary" aria-live="polite">
        {totalElements !== undefined && formatListingsFound(totalElements)}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          className="lg:hidden"
          aria-expanded={isFiltersOpen}
          aria-controls={filtersPanelId}
          onClick={onToggleFilters}
        >
          <FilterIcon size={16} />
          Фільтри{activeFiltersCount > 0 && ` · ${activeFiltersCount}`}
        </Button>
        {totalElements !== 0 && (
          <ProductSortSelect
            value={sort}
            onChange={onSortChange}
            sortValues={CATEGORY_PRODUCT_SORT_VALUES}
          />
        )}
        {/* TODO: prefill the auto-search form with the current category and filters. */}
        <Button asChild variant="outline">
          <Link href="/auto-search">
            <BellIcon size={16} />
            Стежити за пошуком
          </Link>
        </Button>
      </div>
    </div>
  );
}
