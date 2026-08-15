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
  const { favoriteIds, isHydrated, toggleFavorite } = useFavorites();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full grid grid-cols-3 gap-7">
      {cards.map((card, index) => (
        <ProductCard
          key={card.id}
          card={card}
          eager={index < 3}
          favorite={favoriteIds.has(card.id)}
          favoriteDisabled={!isHydrated}
          onToggleFavorite={() => toggleFavorite(card)}
        />
      ))}
    </div>
  );
};

export default ProductCardsGrid;
