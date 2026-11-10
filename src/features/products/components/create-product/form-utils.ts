import type { CategoryOption } from "@/features/categories/types/category";
import { UKRAINIAN_CITIES } from "@/features/products/constants/ukrainian-cities";

export type ProductDraft = {
  title: string;
  description: string;
  price: string;
  quantity: string;
  condition: "new" | "used";
  city: string;
};

export const INITIAL_PRODUCT_DRAFT: ProductDraft = {
  title: "",
  description: "",
  price: "",
  quantity: "1",
  condition: "used",
  city: "",
};

export const MAX_PRODUCT_IMAGES = 8;
export const MAX_PRODUCT_IMAGE_SIZE = 10 * 1024 * 1024;

export function normalizeCityName(city: string): string {
  return city.trim().replace(/\s+/g, " ").toLocaleLowerCase("uk");
}

// Official cities matching the query; names that start with it come first.
export function searchUkrainianCities(query: string, limit: number): string[] {
  const normalizedQuery = normalizeCityName(query);
  if (!normalizedQuery) return UKRAINIAN_CITIES.slice(0, limit);

  const startsWithQuery = (city: string) => normalizeCityName(city).startsWith(normalizedQuery);

  return UKRAINIAN_CITIES.filter((city) => normalizeCityName(city).includes(normalizedQuery))
    .sort(
      (left, right) =>
        Number(startsWithQuery(right)) - Number(startsWithQuery(left)) ||
        left.localeCompare(right, "uk"),
    )
    .slice(0, limit);
}

export function findOfficialCity(value: string): string | undefined {
  const normalizedValue = normalizeCityName(value);
  return UKRAINIAN_CITIES.find((city) => normalizeCityName(city) === normalizedValue);
}

export function formatProductPrice(value: string): string {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0
    ? new Intl.NumberFormat("uk-UA").format(amount)
    : "0";
}

export function getCategoryTrail(
  categories: CategoryOption[],
  ids: string[],
): CategoryOption[] {
  let level = categories;
  const trail: CategoryOption[] = [];

  for (const id of ids) {
    const selected = level.find((category) => category.id === id);
    if (!selected) break;

    trail.push(selected);
    level = selected.children;
  }

  return trail;
}
