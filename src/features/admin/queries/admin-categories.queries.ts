import { queryOptions } from "@tanstack/react-query";

import { categoriesApi } from "@/api/categories";

import { adminKeys } from "./admin.keys";

export const adminCategoryKeys = {
  all: [...adminKeys.all, "categories"] as const,
  tree: () => [...adminCategoryKeys.all, "tree"] as const,
};

export const adminCategoryQueries = {
  tree: () =>
    queryOptions({
      queryKey: adminCategoryKeys.tree(),
      queryFn: async () => {
        const response = await categoriesApi.tree();
        return response.data.data;
      },
    }),
};
