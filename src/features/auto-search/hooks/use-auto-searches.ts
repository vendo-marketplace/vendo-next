import { useQuery } from "@tanstack/react-query";
import { autoSearchQueries } from "../queries/auto-search.queries";

export const useAutoSearches = (enabled = true) =>
  useQuery({ ...autoSearchQueries.list(), enabled });
