import type { CategoryOption } from "@/features/categories/types/category";

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(price);

export const toLocalDate = (value: string) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

export const getCategoryTrails = (categories: CategoryOption[]) => {
  const trails = new Map<string, string[]>();
  const visit = (items: CategoryOption[], parents: string[]) => {
    for (const category of items) {
      const path = [...parents, category.title];
      trails.set(category.id, path);
      visit(category.children, path);
    }
  };
  visit(categories, []);
  return trails;
};
