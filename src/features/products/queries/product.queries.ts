import { productsApi } from "@/api/products";
import { infiniteQueryOptions } from "@tanstack/react-query";

import { productKeys } from "./product.keys";

export const productQueries = {
  search: (query: string) =>
    infiniteQueryOptions({
      queryKey: productKeys.search(query),
      queryFn: async ({ pageParam }) => {
        const res = await productsApi.search(query, pageParam);
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: ({ metadata }) =>
        metadata.hasNext ? metadata.page + 1 : undefined,
    }),
};
