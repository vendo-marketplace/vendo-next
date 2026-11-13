import type { StaticImageData } from "next/image";

import auto from "@/assets/category-photos/auto.png";
import clothes from "@/assets/category-photos/clothes.png";
import electronics from "@/assets/category-photos/electronics.png";
import homeGarden from "@/assets/category-photos/home-garden.png";
import realEstate from "@/assets/category-photos/real-estate.png";

// Product-style photos for the popular categories: each a compact pair (a main item and a small
// companion on one shared shadow), in the same studio look as listing photos.
// TODO(api): swap for a few real listing photos per category once search can filter by a
// top-level category (today it only matches the deepest subcategory).
const PHOTOS: { match: string; images: StaticImageData[] }[] = [
  { match: "електрон", images: [electronics] },
  { match: "нерухом", images: [realEstate] },
  { match: "авто", images: [auto] },
  { match: "одяг", images: [clothes] },
  { match: "дім", images: [homeGarden] },
];

export function getCategoryPhotos(title: string): StaticImageData[] {
  const lowerTitle = title.toLocaleLowerCase("uk");
  return PHOTOS.find(({ match }) => lowerTitle.includes(match))?.images ?? [];
}
