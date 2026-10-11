import { autoSearchApi } from "@/api/auto-search";
import { queryOptions } from "@tanstack/react-query";
import type { AutoSearch, AutoSearchProduct } from "../types/auto-search";

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

export const autoSearchKeys = {
  all: ["auto-search"] as const,
  list: () => [...autoSearchKeys.all, "list"] as const,
  products: (id: string) => [...autoSearchKeys.all, "products", id] as const,
};

export const autoSearchQueries = {
  list: () =>
    queryOptions({
      queryKey: autoSearchKeys.list(),
      queryFn: async () => {
        const response = await autoSearchApi.list();
        return toArray<AutoSearch>(response.data);
      },
    }),
  products: (id: string) =>
    queryOptions({
      queryKey: autoSearchKeys.products(id),
      queryFn: async () => {
        const response = await autoSearchApi.products(id);
        return toArray<AutoSearchProduct>(response.data);
      },
    }),
};
