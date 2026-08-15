import { useQuery } from "@tanstack/react-query";

import { favoriteQueries } from "../queries/favorite.queries";

export const useFavoriteProducts = (enabled: boolean = true) =>
  useQuery({ ...favoriteQueries.list(), enabled });
