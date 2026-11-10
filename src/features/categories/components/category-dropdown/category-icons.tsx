import type { LucideProps } from "lucide-react";
import {
  Baby,
  BookOpen,
  Building2,
  CarFront,
  Dumbbell,
  Grid2X2,
  House,
  Laptop,
  PawPrint,
  Refrigerator,
  Shirt,
  ShoppingBasket,
  Sparkles,
  Tv,
  Wrench,
} from "lucide-react";

const categoryIcons = [
  Grid2X2,
  Refrigerator,
  House,
  Shirt,
  Wrench,
  Dumbbell,
  CarFront,
  Baby,
  Sparkles,
  Building2,
  PawPrint,
  ShoppingBasket,
  BookOpen,
  Tv,
  Laptop,
];

// Picks the icon by the category's position so root categories keep a stable icon.
export function CategoryIcon({ index, ...props }: LucideProps & { index: number }) {
  const Icon = categoryIcons[index % categoryIcons.length];
  return <Icon {...props} />;
}
