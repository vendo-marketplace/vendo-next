import { autoSearchApi } from "@/api/auto-search";
import { queryOptions } from "@tanstack/react-query";
import type {
  AutoSearch,
  AutoSearchProduct,
  AutoSearchProductsResponse,
  AutoSearchProductsQuery,
} from "../types/auto-search";

const toArray = <T>(value: unknown): T[] => {
  let current = value;

  for (let depth = 0; depth < 3; depth += 1) {
    if (Array.isArray(current)) return current as T[];
    if (current === null || current === undefined) return [];
    if (typeof current !== "object" || !("data" in current)) break;
    current = current.data;
  }

  if (current === null || current === undefined) return [];
  throw new Error("Unexpected auto search response format");
};

const toProductsResponse = (value: unknown): AutoSearchProductsResponse => {
  let current = value;

  for (let depth = 0; depth < 3; depth += 1) {
    if (Array.isArray(current)) return { data: current as AutoSearchProduct[] };
    if (current === null || typeof current !== "object" || !("data" in current)) {
      break;
    }

    const response = current as Partial<AutoSearchProductsResponse>;
    if (Array.isArray(response.data)) {
      return { data: response.data, metadata: response.metadata };
    }
    current = response.data;
  }

  if (current === null || current === undefined) return { data: [] };
  throw new Error("Unexpected auto search products response format");
};

export const autoSearchKeys = {
  all: ["auto-search"] as const,
  list: (userId?: string) =>
    userId
      ? ([...autoSearchKeys.all, "list", userId] as const)
      : ([...autoSearchKeys.all, "list"] as const),
  products: (id: string, params?: AutoSearchProductsQuery) =>
    params
      ? ([...autoSearchKeys.all, "products", id, params] as const)
      : ([...autoSearchKeys.all, "products", id] as const),
};

export const autoSearchQueries = {
  list: (userId?: string) =>
    queryOptions({
      queryKey: autoSearchKeys.list(userId),
      queryFn: async () => {
        const response = await autoSearchApi.list();
        return toArray<AutoSearch>(response.data);
      },
      staleTime: 0,
      refetchOnMount: "always",
    }),
  products: (id: string, params: AutoSearchProductsQuery) =>
    queryOptions({
      queryKey: autoSearchKeys.products(id, params),
      queryFn: async () => {
        const response = await autoSearchApi.products(id, params);
        return toProductsResponse(response.data);
      },
    }),
};
