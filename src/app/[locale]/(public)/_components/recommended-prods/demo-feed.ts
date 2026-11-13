import photoAuto from "@/assets/category-photos/auto.png";
import photoClothes from "@/assets/category-photos/clothes.png";
import photoElectronics from "@/assets/category-photos/electronics.png";
import photoHomeGarden from "@/assets/category-photos/home-garden.png";
import photoRealEstate from "@/assets/category-photos/real-estate.png";
import { getSampleSmartphones } from "@/features/products/components/prod-cards-grid/prod-card/lib/sample-smartphones";
import type { ProductCardType } from "@/types/product";

// A local-only demo feed for design reviews, while the backend holds mostly test listings.
// It shows only when NEXT_PUBLIC_DEMO_FEED=1 is set (in .env.local, which git ignores), so it
// never reaches a real build. The ids share the sample prefix, so the cards are not links.
export const isDemoFeedOn = process.env.NEXT_PUBLIC_DEMO_FEED === "1";

const HOUR_IN_MS = 60 * 60 * 1000;

const OTHER_LISTINGS = [
  {
    title: "Ford Focus 2019, 1.5 дизель, 98 тис. км",
    price: 389000,
    city: "Київ",
    photo: photoAuto,
    isNew: false,
  },
  {
    title: "Кросівки та сумка, комплект, р. 38",
    price: 2400,
    city: "Львів",
    photo: photoClothes,
    isNew: true,
  },
  {
    title: "Будинок 120 м², 6 соток, Ірпінь",
    price: 3950000,
    city: "Ірпінь",
    photo: photoRealEstate,
    isNew: false,
  },
  {
    title: "Крісло Scandi, бежеве букле",
    price: 6800,
    city: "Одеса",
    photo: photoHomeGarden,
    isNew: true,
  },
  {
    title: "Навушники Apple AirPods Max, Silver",
    price: 14500,
    city: "Дніпро",
    photo: photoElectronics,
    isNew: false,
  },
];

export const getDemoFeed = (now = Date.now()): ProductCardType[] => {
  const phones = getSampleSmartphones(now).map(({ card }) => card);
  const others: ProductCardType[] = OTHER_LISTINGS.map((item, index) => ({
    id: `sample-phone-demo-${index + 1}`,
    title: item.title,
    description: "",
    quantity: 1,
    isNew: item.isNew,
    price: item.price,
    ownerId: "",
    categoryId: "",
    address: { city: item.city },
    attributes: [],
    images: [item.photo.src],
    active: true,
    createdAt: new Date(now - (index * 5 + 1) * HOUR_IN_MS).toISOString(),
  }));
  // Mix the other categories in among the phones, so the feed reads like a real marketplace.
  return phones.flatMap((phone, index) =>
    index % 4 === 1 && others[index >> 2]
      ? [phone, others[index >> 2]]
      : [phone],
  );
};
