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
  } = useFavoriteProducts(isHydrated && isAuthenticated);

  const favorites = useMemo(
    () =>
      isAuthenticated
        ? authenticatedFavorites
        : isHydrated
          ? guestFavorites
          : emptyFavorites,
    [authenticatedFavorites, guestFavorites, isAuthenticated, isHydrated],
  );

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

    if (wasFavorite) {
      removeFavorite.mutate(product.id, {
        onSuccess: () => toast.success(t("removed")),
      });
      return;
    }

    addFavorite.mutate(product, {
      onSuccess: () => toast.success(t("added")),
    });
  };

  return {
    isLoading:
      !isHydrated ||
      isAuthLoading ||
      (isAuthenticated && isAuthenticatedFavoritesLoading),
    favorites,
    favoriteIds,
    toggleFavorite,
  };
};
