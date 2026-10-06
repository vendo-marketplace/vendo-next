import client from "@/axios/axios";
import type {
  SearchProductsQuery,
  SearchProductsResponse,
} from "@/types/product";
import { apiEndpoints } from "./endpoints";

export const productsApi = {
  search: async (q: string | undefined, query: SearchProductsQuery) =>
    client.post<SearchProductsResponse>(
      apiEndpoints.products.search,
      query,
      q ? { params: { q } } : undefined,
    ),
};
