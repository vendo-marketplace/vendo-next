import client from "@/axios/axios";
import type {
  CreateProductRequest,
  SearchProductsQuery,
  SearchProductsResponse,
} from "@/types/product";
import { apiEndpoints } from "./endpoints";

export const productsApi = {
  create: async (request: CreateProductRequest, images: File[]) => {
    const body = new FormData();
    body.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
    images.forEach((image) => body.append("images", image));
    return client.post(apiEndpoints.products.create, body);
  },
  search: async (q: string | undefined, query: SearchProductsQuery) =>
    client.post<SearchProductsResponse>(
      apiEndpoints.products.search,
      query,
      q ? { params: { q } } : undefined,
    ),
};
