import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import { attributesApi } from "@/api/attributes";
import type { AttributeFilters } from "@/features/categories/types/category";

import { adminKeys } from "./admin.keys";

export const adminAttributeKeys = {
  all: [...adminKeys.all, "attributes"] as const,
  list: (filters: AttributeFilters = {}) =>
    [...adminAttributeKeys.all, "list", filters] as const,
};

export const adminAttributeQueries = {
  list: (filters: AttributeFilters = {}) =>
    queryOptions({
      queryKey: adminAttributeKeys.list(filters),
      queryFn: async () => {
        const response = await attributesApi.list(filters);
        return response.data;
      },
      // Keeps the list on screen while a new search or type filter loads.
      placeholderData: keepPreviousData,
    }),
};
