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
  onOpenFilters,
  autoSearchQuery,
}: {
  totalElements?: number;
  sort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  activeFiltersCount: number;
  onOpenFilters: () => void;
  autoSearchQuery: Record<string, string>;
}) {
  const autoSearchHref = { pathname: "/auto-search", query: autoSearchQuery };

  // Phones: the count on top, then filters and sort sharing the full width ("Стежити за
  // пошуком" lives in the filters panel there). Tablets: the count on top, filters on the left
  // and sort with "Стежити" pushed right. Desktop: one row, with the sidebar instead of the button.
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Phones and tablets show the count next to the title; here it stays for screen readers. */}
      <p className="sr-only text-md font-medium text-text-secondary lg:not-sr-only" aria-live="polite">
        {totalElements !== undefined && formatListingsFound(totalElements)}
      </p>
      {/* Phones: filters and sort split the row in half. */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
        <Button
          className="h-10 w-full min-w-0 gap-2 sm:mr-auto sm:w-fit sm:px-6 lg:hidden"
          aria-haspopup="dialog"
          onClick={onOpenFilters}
        >
          <FilterIcon size={16} />
          Фільтри{activeFiltersCount > 0 && ` · ${activeFiltersCount}`}
        </Button>
        <ProductSortSelect
          value={sort}
          onChange={onSortChange}
          sortValues={CATEGORY_PRODUCT_SORT_VALUES}
          className="h-10 w-full min-w-0 sm:w-fit"
        />
        <Button
          asChild
          variant="outline"
          className="hidden h-10 gap-1.5 px-3 text-sm font-medium shadow-xs sm:inline-flex"
        >
          <Link href={autoSearchHref}>
            <BellIcon size={16} />
            Стежити за пошуком
          </Link>
        </Button>
      </div>
    </div>
  );
}
