"use client";

import type { ProductCardType } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesStore = {
  favorites: ProductCardType[];
  toggle: (product: ProductCardType) => void;
  removeMany: (productIds: string[]) => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],
      toggle: (product) =>
        set((state) => ({
          favorites: state.favorites.some(({ id }) => id === product.id)
            ? state.favorites.filter(({ id }) => id !== product.id)
            : [product, ...state.favorites],
        })),
      removeMany: (productIds) =>
        set((state) => ({
          favorites: state.favorites.filter(({ id }) => !productIds.includes(id)),
        })),
    }),
    { name: "vendo:guest-favorites" },
  ),
);
