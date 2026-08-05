import client from "@/axios/axios";
import type { SearchProductsResponse } from "@/types/product";

export const productsApi = {
  search: async (q: string, page = 1) =>
    client.post<SearchProductsResponse>("/search"),
};
