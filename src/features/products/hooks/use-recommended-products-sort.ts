"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  DEFAULT_PRODUCT_SORT,
  getProductSortQuery,
  parseProductSortQuery,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";

const DEFAULT_SORT_QUERY = getProductSortQuery(DEFAULT_PRODUCT_SORT);

export const useRecommendedProductsSort = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sort = useMemo(
    () =>
      parseProductSortQuery(
        searchParams.get("sortBy"),
        searchParams.get("direction"),
      ),
    [searchParams],
  );

  const setSort = useCallback(
    (value: ProductSortOption) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextSort = getProductSortQuery(value);

      if (nextSort.sortBy === DEFAULT_SORT_QUERY.sortBy) {
        params.delete("sortBy");
      } else {
        params.set("sortBy", nextSort.sortBy);
      }

      if (nextSort.direction === DEFAULT_SORT_QUERY.direction) {
        params.delete("direction");
      } else {
        params.set("direction", nextSort.direction);
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  return { sort, setSort };
};
