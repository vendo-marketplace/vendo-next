import client from "@/axios/axios";
import type {
  SearchProductsQuery,
  SearchProductsResponse,
} from "@/types/product";
import { apiEndpoints } from "./endpoints";

export const productsApi = {
  search: async (q: string, query: SearchProductsQuery) =>
    client.post<SearchProductsResponse>(
      apiEndpoints.products.search,
      query,
      {
        params: {
          q,
        },
      },
    ),
};
