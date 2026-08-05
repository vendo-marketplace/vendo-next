import { ProductCardType } from "@/types/product";
import ProductCard from "./prod-card/ProductCard";

interface Props {
  cards: ProductCardType[];
}

const ProductCardsGrid = ({ cards }: Props) => {
  return (
    <div className="w-full grid grid-cols-3 gap-7">
      {cards.map((card) => (
        <ProductCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default ProductCardsGrid;
