import { favoritesApi } from "@/api/favorites";
import { queryOptions } from "@tanstack/react-query";

import { favoriteKeys } from "./favorite.keys";

export const favoriteQueries = {
  list: () =>
    queryOptions({
      queryKey: favoriteKeys.list(),
      queryFn: async () => {
        const response = await favoritesApi.get();
        return response.data.data;
      },
    }),
};
