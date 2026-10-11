import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { SearchProductsQuery } from "@/types/product";

import { productQueries } from "../queries/product.queries";

export const useSearchProducts = (
  searchTerm: string,
  query: SearchProductsQuery,
) => useInfiniteQuery(productQueries.search(searchTerm, query));

export const useSearchProductsPage = (
  searchTerm: string,
  query: SearchProductsQuery,
  enabled = true,
) => useQuery({ ...productQueries.searchPage(searchTerm, query), enabled });
