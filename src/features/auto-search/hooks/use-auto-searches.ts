import { useQuery } from "@tanstack/react-query";
import { autoSearchQueries } from "../queries/auto-search.queries";

export const useAutoSearches = (enabled = true, userId?: string) =>
  useQuery({ ...autoSearchQueries.list(userId), enabled });
