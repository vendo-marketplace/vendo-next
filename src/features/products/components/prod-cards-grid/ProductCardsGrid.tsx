"use client";

import { Fragment, type ReactNode } from "react";

import type { ProductCardType } from "@/types/product";
import ProductCard from "./prod-card/ProductCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";

interface Props {
  cards: ProductCardType[];
  isLoading?: boolean;
  // Next to a filters sidebar there is room for three columns, not four.
  withSidebar?: boolean;
  // A feed of smaller cards: five across on wide screens.
  dense?: boolean;
  // Something placed among the cards (a promo tile), before the card at `index`.
  insert?: { index: number; node: ReactNode };
}

const ProductCardsGrid = ({
  cards,
  isLoading = false,
  withSidebar = false,
  dense = false,
  insert,
}: Props) => {
  const {
    favoriteIds,
    isLoading: areFavoritesLoading,
    isFavoritePending,
    toggleFavorite,
  } = useFavorites();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div
      className={
        withSidebar
          ? "grid w-full grid-cols-2 gap-3 md:grid-cols-3"
          : dense
            ? "grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 min-[117.5rem]:grid-cols-6"
            : "grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4"
      }
    >
      {cards.map((card, index) => (
        <Fragment key={card.id}>
          {insert &&
            index === Math.min(insert.index, cards.length - 1) &&
            insert.node}
          <ProductCard
            card={card}
            eager={index < 3}
            favorite={favoriteIds.has(card.id)}
            favoriteDisabled={areFavoritesLoading || isFavoritePending(card.id)}
            onToggleFavorite={() => toggleFavorite(card)}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default ProductCardsGrid;
