"use client";

import { useTranslations } from "next-intl";
import { useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { useMe } from "@/features/auth/hooks/use-me";
import type { ProductCardType } from "@/types/product";
import { useFavoritesStore } from "../stores/favorites.store";
import { useAddFavorite } from "./use-add-favorite";
import { useFavoriteProducts } from "./use-favorite-products";
import { useRemoveFavorite } from "./use-remove-favorite";

const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;
const emptyFavorites: ProductCardType[] = [];

export const useFavorites = () => {
  const t = useTranslations("Favorites");
  const guestFavorites = useFavoritesStore((state) => state.favorites);
  const toggleGuestFavorite = useFavoritesStore((state) => state.toggle);
  const removeGuestFavorites = useFavoritesStore((state) => state.removeMany);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { data: currentUser, isLoading: isAuthLoading } = useMe();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isAuthenticated = Boolean(currentUser);
  const {
    data: authenticatedFavorites = emptyFavorites,
    isLoading: isAuthenticatedFavoritesLoading,
    isError: isAuthenticatedFavoritesError,
    refetch: refetchAuthenticatedFavorites,
  } = useFavoriteProducts(isHydrated && isAuthenticated);

  const favorites = useMemo(() => {
    if (!isHydrated) return emptyFavorites;
    if (!isAuthenticated) return guestFavorites;

    const accountIds = new Set(authenticatedFavorites.map(({ id }) => id));
    return [
      ...authenticatedFavorites,
      ...guestFavorites.filter(({ id }) => !accountIds.has(id)),
    ];
  }, [authenticatedFavorites, guestFavorites, isAuthenticated, isHydrated]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map(({ id }) => id)),
    [favorites],
  );

  const toggleFavorite = (product: ProductCardType) => {
    const wasFavorite = favoriteIds.has(product.id);

    if (!isAuthenticated) {
      toggleGuestFavorite(product);
      toast.success(t(wasFavorite ? "removed" : "added"));
      return;
    }

    const isGuestOnlyFavorite =
      guestFavorites.some(({ id }) => id === product.id) &&
      !authenticatedFavorites.some(({ id }) => id === product.id);
    if (isGuestOnlyFavorite) {
      toggleGuestFavorite(product);
      toast.success(t("removed"));
      return;
    }

    if (wasFavorite) {
      removeFavorite.mutate(product.id, {
        onSuccess: () => {
          removeGuestFavorites([product.id]);
          toast.success(t("removed"));
        },
        onError: () => toast.error(t("updateError")),
      });
      return;
    }

    addFavorite.mutate(product, {
      onSuccess: () => toast.success(t("added")),
      onError: () => toast.error(t("updateError")),
    });
  };

  const isFavoritePending = (productId: string) =>
    (addFavorite.isPending && addFavorite.variables?.id === productId) ||
    (removeFavorite.isPending && removeFavorite.variables === productId);

  return {
    isLoading:
      !isHydrated ||
      isAuthLoading ||
      (isAuthenticated && isAuthenticatedFavoritesLoading),
    favorites,
    favoriteIds,
    toggleFavorite,
    isFavoritePending,
    favoritesError: isAuthenticated && isAuthenticatedFavoritesError,
    refetchFavorites: refetchAuthenticatedFavorites,
  };
};
