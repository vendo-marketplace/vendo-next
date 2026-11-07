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

export const getCategoryIcon = (index: number) =>
  categoryIcons[index % categoryIcons.length];
