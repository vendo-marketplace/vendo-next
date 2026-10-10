"use client";

import type { ProductCardType } from "@/types/product";
import ProductCard from "./prod-card/ProductCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";

interface Props {
  cards: ProductCardType[];
  isLoading?: boolean;
}

const ProductCardsGrid = ({ cards, isLoading = false }: Props) => {
  const {
    favoriteIds,
    isLoading: areFavoritesLoading,
    isFavoritePending,
    toggleFavorite,
  } = useFavorites();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
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
