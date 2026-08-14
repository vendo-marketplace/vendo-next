"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  DEFAULT_PRODUCT_SORT,
  parseProductSortOption,
  type ProductSortOption,
} from "@/features/products/lib/product-sort";

export const useProductSortParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const sort = useMemo(
    () => parseProductSortOption(searchParams.get("sort")),
    [searchParams],
  );

  const setSort = useCallback(
    (value: ProductSortOption) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("sortBy");
      params.delete("direction");

      if (value === DEFAULT_PRODUCT_SORT) {
        params.delete("sort");
      } else {
        params.set("sort", value);
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
