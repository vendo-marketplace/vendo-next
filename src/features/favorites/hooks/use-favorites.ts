"use client";

import { useTranslations } from "next-intl";
import { useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";

import type { ProductCardType } from "@/types/product";
import { useFavoritesStore } from "../stores/favorites.store";

const hasStoredSession = () =>
  Boolean(
    localStorage.getItem("access-token") ||
      localStorage.getItem("refresh-token"),
  );

const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const useFavorites = () => {
  const t = useTranslations("Favorites");
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleGuestFavorite = useFavoritesStore((state) => state.toggle);
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const isAuthenticated = useSyncExternalStore(
    emptySubscribe,
    hasStoredSession,
    getServerSnapshot,
  );

  const favoriteIds = useMemo(
    () =>
      new Set(
        isHydrated && !isAuthenticated
          ? favorites.map(({ id }) => id)
          : [],
      ),
    [favorites, isAuthenticated, isHydrated],
  );

  const toggleFavorite = (product: ProductCardType) => {
    if (hasStoredSession()) {
      toast.info(t("signedInComingSoon"));
      return;
    }

    const wasFavorite = favoriteIds.has(product.id);
    toggleGuestFavorite(product);
    toast.success(t(wasFavorite ? "removed" : "added"));
  };

  return {
    favorites: isHydrated && !isAuthenticated ? favorites : [],
    favoriteIds,
    isAuthenticated,
    isHydrated,
    toggleFavorite,
  };
};
