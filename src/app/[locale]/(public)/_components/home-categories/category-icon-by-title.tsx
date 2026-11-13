import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Baby,
  Building2,
  CarFront,
  Dumbbell,
  Guitar,
  LayoutGrid,
  PawPrint,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  WashingMachine,
  Wrench,
} from "lucide-react";

// Line icons for the top-level categories, in the same stroke style as the rest of the UI.
// Matched by a word in the title, so the order of the API response doesn't matter.
const ICONS: { match: string; Icon: LucideIcon }[] = [
  { match: "електрон", Icon: Smartphone },
  { match: "побут", Icon: WashingMachine },
  { match: "дім", Icon: Sofa },
  { match: "одяг", Icon: Shirt },
  { match: "інструмент", Icon: Wrench },
  { match: "спорт", Icon: Dumbbell },
  { match: "авто", Icon: CarFront },
  { match: "дитяч", Icon: Baby },
  { match: "краса", Icon: Sparkles },
  { match: "нерухом", Icon: Building2 },
  { match: "зоо", Icon: PawPrint },
  { match: "продукт", Icon: ShoppingBasket },
  { match: "хобі", Icon: Guitar },
];

export function CategoryIconByTitle({
  title,
  ...props
}: LucideProps & { title: string }) {
  const lowerTitle = title.toLocaleLowerCase("uk");
  const Icon =
    ICONS.find(({ match }) => lowerTitle.includes(match))?.Icon ?? LayoutGrid;
  return <Icon aria-hidden="true" {...props} />;
}
