import { favoritesApi } from "@/api/favorites";
import type { ProductCardType } from "@/types/product";
import type { ApiError } from "@/types/types";
import {
  mutationOptions,
  type QueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { favoriteKeys } from "../queries/favorite.keys";

type FavoriteMutationContext = {
  previousFavorites: ProductCardType[] | undefined;
};

const listQueryKey = favoriteKeys.list();

const restoreFavorites = (
  queryClient: QueryClient,
  context: FavoriteMutationContext | undefined,
) => {
  if (!context) return;

  if (context.previousFavorites) {
    queryClient.setQueryData(listQueryKey, context.previousFavorites);
    return;
  }

  queryClient.removeQueries({ queryKey: listQueryKey, exact: true });
};

const invalidateFavorites = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: listQueryKey });

export const favoriteMutations = {
  add: (queryClient: QueryClient) =>
    mutationOptions<
      void,
      AxiosError<ApiError>,
      ProductCardType,
      FavoriteMutationContext
    >({
      mutationFn: async (product) => {
        await favoritesApi.add(product.id);
      },
      onMutate: async (product) => {
        await queryClient.cancelQueries({ queryKey: listQueryKey });

        const previousFavorites =
          queryClient.getQueryData<ProductCardType[]>(listQueryKey);

        queryClient.setQueryData<ProductCardType[]>(
          listQueryKey,
          (favorites = []) =>
            favorites.some(({ id }) => id === product.id)
              ? favorites
              : [product, ...favorites],
        );

        return { previousFavorites };
      },
      onError: (_error, _product, context) => {
        restoreFavorites(queryClient, context);
      },
      onSettled: async () => {
        await invalidateFavorites(queryClient);
      },
    }),
  remove: (queryClient: QueryClient) =>
    mutationOptions<
      void,
      AxiosError<ApiError>,
      string,
      FavoriteMutationContext
    >({
      mutationFn: async (productId) => {
        await favoritesApi.remove(productId);
      },
      onMutate: async (productId) => {
        await queryClient.cancelQueries({ queryKey: listQueryKey });

        const previousFavorites =
          queryClient.getQueryData<ProductCardType[]>(listQueryKey);

        queryClient.setQueryData<ProductCardType[]>(
          listQueryKey,
          (favorites = []) =>
            favorites.filter(({ id }) => id !== productId),
        );

        return { previousFavorites };
      },
      onError: (_error, _productId, context) => {
        restoreFavorites(queryClient, context);
      },
      onSettled: async () => {
        await invalidateFavorites(queryClient);
      },
    }),
};
