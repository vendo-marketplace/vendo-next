"use client";

import type { ProductCardType } from "@/types/product";
import ProductCard from "./prod-card/ProductCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";

interface Props {
  cards: ProductCardType[];
  isLoading?: boolean;
  // Next to a filters sidebar there is room for three columns, not four.
  withSidebar?: boolean;
}

const ProductCardsGrid = ({ cards, isLoading = false, withSidebar = false }: Props) => {
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
          : "grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4"
      }
    >
      {cards.map((card, index) => (
        <ProductCard
          key={card.id}
          card={card}
          eager={index < 3}
          favorite={favoriteIds.has(card.id)}
          favoriteDisabled={areFavoritesLoading || isFavoritePending(card.id)}
          onToggleFavorite={() => toggleFavorite(card)}
        />
      ))}
    </div>
  );
};

export default ProductCardsGrid;
