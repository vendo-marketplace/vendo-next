import { useQuery } from "@tanstack/react-query";
import { autoSearchQueries } from "../queries/auto-search.queries";
import type { AutoSearchProductsQuery } from "../types/auto-search";

export const useAutoSearchProducts = (
  id: string,
  enabled: boolean,
  params: AutoSearchProductsQuery,
) => useQuery({ ...autoSearchQueries.products(id, params), enabled });
