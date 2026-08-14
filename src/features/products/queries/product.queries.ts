import { productsApi } from "@/api/products";
import type { SearchProductsQuery } from "@/types/product";
import { infiniteQueryOptions } from "@tanstack/react-query";

import { productKeys } from "./product.keys";

export const productQueries = {
  search: (searchTerm: string, query: SearchProductsQuery) =>
    infiniteQueryOptions({
      queryKey: productKeys.search(searchTerm, query),
      queryFn: async ({ pageParam }) => {
        const productQuery: SearchProductsQuery = {
          ...query,
          page: pageParam,
        };

        const res = await productsApi.search(searchTerm, productQuery);
        return res.data;
      },
      initialPageParam: query.page,
      getNextPageParam: ({ metadata }) =>
        metadata.hasNext ? metadata.page + 1 : undefined,
    }),
};
