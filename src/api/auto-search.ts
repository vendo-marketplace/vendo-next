import client from "@/axios/axios";
import type {
  AutoSearchListResponse,
  AutoSearchProductsResponse,
  AutoSearchFilters,
  UpdateAutoSearchRequest,
} from "@/features/auto-search/types/auto-search";
import { apiEndpoints } from "./endpoints";

export const autoSearchApi = {
  list: async () =>
    client.get<AutoSearchListResponse>(apiEndpoints.autoSearch.list),
  create: async (filters: AutoSearchFilters) =>
    client.post<void>(apiEndpoints.autoSearch.list, filters),
  update: async (id: string, filters: UpdateAutoSearchRequest) =>
    client.put<void>(apiEndpoints.autoSearch.item(id), filters),
  remove: async (id: string) =>
    client.delete<void>(apiEndpoints.autoSearch.item(id)),
  products: async (id: string) =>
    client.get<AutoSearchProductsResponse>(apiEndpoints.autoSearch.products(id)),
};
