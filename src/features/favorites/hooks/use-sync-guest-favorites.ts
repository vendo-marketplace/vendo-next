"use client";

import { favoritesApi } from "@/api/favorites";
import { useMe } from "@/features/auth/hooks/use-me";
import { useFavoritesStore } from "@/features/favorites/stores/favorites.store";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { useFavoriteProducts } from "./use-favorite-products";
import { favoriteKeys } from "../queries/favorite.keys";

const emptySubscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** Copies guest favorites to the account once the authenticated list is ready. */
export const useSyncGuestFavorites = () => {
  const t = useTranslations("Favorites");
  const queryClient = useQueryClient();
  const guestFavorites = useFavoritesStore((state) => state.favorites);
  const removeMany = useFavoritesStore((state) => state.removeMany);
  const { data: currentUser } = useMe();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { data: accountFavorites = [], isLoading, isError } = useFavoriteProducts(
    isHydrated && Boolean(currentUser),
  );
  const attemptedSyncKey = useRef("");

  useEffect(() => {
    if (!isHydrated || !currentUser || isLoading || isError || !guestFavorites.length) {
      return;
    }

    const syncKey = `${currentUser.id}:${guestFavorites.map(({ id }) => id).sort().join(",")}`;
    if (attemptedSyncKey.current === syncKey) return;
    attemptedSyncKey.current = syncKey;

    let cancelled = false;
    const sync = async () => {
      const accountIds = new Set(accountFavorites.map(({ id }) => id));
      const syncedIds: string[] = [];
      let failed = false;

      for (const product of guestFavorites) {
        if (accountIds.has(product.id)) {
          syncedIds.push(product.id);
          continue;
        }
        try {
          await favoritesApi.add(product.id);
          syncedIds.push(product.id);
        } catch {
          failed = true;
        }
      }

      if (cancelled) return;
      if (syncedIds.length) removeMany(syncedIds);
      if (syncedIds.length) {
        await queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
      }
      if (failed) toast.error(t("syncError"));
    };

    void sync();
    return () => {
      cancelled = true;
    };
  }, [
    accountFavorites,
    currentUser,
    guestFavorites,
    isError,
    isHydrated,
    isLoading,
    queryClient,
    removeMany,
    t,
  ]);
};
