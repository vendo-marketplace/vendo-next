import { ProductCardType } from "@/types/product";
import ProductCard from "./prod-card/ProductCard";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface Props {
  cards: ProductCardType[];
  isLoading?: boolean;
}

const ProductCardsGrid = ({ cards, isLoading = false }: Props) => {
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="w-full grid grid-cols-3 gap-7">
      {cards.map((card, index) => (
        <ProductCard key={card.id} card={card} eager={index < 3} />
      ))}
    </div>
  );
};

export default ProductCardsGrid;
