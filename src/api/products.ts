import client from "@/axios/axios";
import type { SearchProductsResponse } from "@/types/product";
import { apiEndpoints } from "./endpoints";

export const productsApi = {
  search: async (q: string, page: number) =>
    client.post<SearchProductsResponse>(
      apiEndpoints.products.search,
      {
        page,
      },
      {
        params: {
          q,
        },
      },
    ),
};
