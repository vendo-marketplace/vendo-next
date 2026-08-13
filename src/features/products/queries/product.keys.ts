import type { SearchProductsQuery } from "@/types/product";

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  search: (searchTerm: string, query: SearchProductsQuery) =>
    [...productKeys.lists(), 'search', searchTerm, query] as const,
};
