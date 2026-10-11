import { useQuery } from "@tanstack/react-query";
import { autoSearchQueries } from "../queries/auto-search.queries";

export const useAutoSearchProducts = (id: string, enabled: boolean) =>
  useQuery({ ...autoSearchQueries.products(id), enabled });
