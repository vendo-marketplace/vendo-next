import type { StaticImageData } from "next/image";

import apple from "@/assets/brands/apple.jpg";
import google from "@/assets/brands/google.jpg";
import motorola from "@/assets/brands/motorola.jpg";
import nokia from "@/assets/brands/nokia.jpg";
import oneplus from "@/assets/brands/oneplus.jpg";
import poco from "@/assets/brands/poco.jpg";
import samsung from "@/assets/brands/samsung.jpg";
import xiaomi from "@/assets/brands/xiaomi.jpg";

import type { CategoryAttribute } from "../../../types/category";
import type { FilterHintContent } from "../FilterHint";

// A category attribute as the filters panel sees it. Mocks fill in mockup sections
// the backend does not expose yet; they render and show as chips but never reach the API.
export type FilterAttribute = CategoryAttribute & {
  isMock?: boolean;
  display?: "chips" | "checkboxes";
  description?: string;
  hint?: FilterHintContent;
  searchPlaceholder?: string;
  // Listings per option, shown next to checkbox labels.
  optionCounts?: Record<string, number>;
};

const mock = (attribute: Omit<FilterAttribute, "isMock" | "required">): FilterAttribute => ({
  ...attribute,
  required: false,
  isMock: true,
});

// TODO(api): drop each mock once the backend adds the matching attribute to the category.
const PHONE_FILTERS: FilterAttribute[] = [
  mock({
    id: "mock-brand",
    slug: "brand",
    title: "Бренд",
    type: "ENUM",
    searchPlaceholder: "Пошук бренду",
    allowedValues: [
      "Apple",
      "Samsung",
      "Xiaomi",
      "Google",
      "Motorola",
      "OnePlus",
      "Nokia",
      "Realme",
      "Poco",
      "Huawei",
      "Oppo",
      "Sony",
    ],
  }),
  mock({
    id: "mock-storage",
    slug: "storage",
    title: "Вбудована пам'ять",
    type: "ENUM",
    allowedValues: ["64 ГБ", "128 ГБ", "256 ГБ", "512 ГБ", "1 ТБ"],
  }),
  mock({
    id: "mock-ram",
    slug: "ram",
    title: "Оперативна пам'ять",
    type: "ENUM",
    allowedValues: ["4 ГБ", "6 ГБ", "8 ГБ", "12 ГБ", "16 ГБ"],
  }),
  mock({
    id: "mock-battery",
    slug: "battery-health",
    title: "Стан батареї",
    type: "ENUM",
    allowedValues: ["Будь-який", "Від 80%", "Від 85%", "Від 90%"],
  }),
  mock({
    id: "mock-condition-grade",
    slug: "condition-grade",
    title: "Категорія стану",
    type: "ENUM",
    allowedValues: ["Ідеальний", "Дуже добрий", "Добрий", "Задовільний", "Пошкоджений"],
    optionCounts: {
      Ідеальний: 2140,
      "Дуже добрий": 3860,
      Добрий: 3210,
      Задовільний: 1470,
      Пошкоджений: 590,
    },
    hint: {
      title: "Як ми оцінюємо стан",
      items: [
        { term: "Ідеальний", description: "без слідів використання, як новий." },
        {
          term: "Дуже добрий",
          description: "ледь помітні мікроподряпини, видно лише під кутом. Екран без подряпин.",
        },
        {
          term: "Добрий",
          description:
            "помітні подряпини або потертості на корпусі, на екрані можуть бути дрібні подряпини.",
        },
        {
          term: "Задовільний",
          description: "глибокі подряпини, сколи або тріщина на склі камери. Усе працює.",
        },
        { term: "Пошкоджений", description: "тріщина екрана або щось не працює. Деталі в описі." },
      ],
    },
  }),
  mock({
    id: "mock-repair-history",
    slug: "repair-history",
    title: "Історія ремонту",
    type: "ENUM",
    allowedValues: ["Не ремонтувався", "Замінено батарею", "Замінено екран", "Інший ремонт"],
    optionCounts: {
      "Не ремонтувався": 7920,
      "Замінено батарею": 1310,
      "Замінено екран": 880,
      "Інший ремонт": 420,
    },
  }),
  mock({
    id: "mock-kit",
    slug: "kit",
    title: "Комплект",
    type: "ENUM",
    display: "checkboxes",
    allowedValues: ["Коробка", "Зарядка", "Кабель", "Чохол", "Чек"],
  }),
  mock({
    id: "mock-color",
    slug: "color",
    title: "Колір",
    type: "ENUM",
    allowedValues: ["Чорний", "Білий", "Синій", "Зелений", "Сірий", "Золотий", "Фіолетовий", "Рожевий", "Червоний"],
    optionCounts: { Чорний: 3840, Білий: 2110, Синій: 1420, Зелений: 690, Сірий: 1760 },
  }),
  mock({
    id: "mock-warranty",
    slug: "warranty",
    title: "Гарантія",
    type: "BOOLEAN",
    description: "Офіційна гарантія виробника або магазину",
  }),
];

const MOCK_FILTERS_BY_CATEGORY: Record<string, FilterAttribute[]> = {
  smartphones: PHONE_FILTERS,
};

const sameTitle = (left: CategoryAttribute, right: CategoryAttribute) =>
  left.title.toLowerCase() === right.title.toLowerCase();

// Builds the filter list from all category attributes (STRING ones included):
// - a filterable real attribute replaces the mock with the same title;
// - a real free-text (STRING) attribute has no option list, so the mock lends it one and
//   the filter goes to the API under the real id (e.g. "Бренд": exact values like "Apple");
// - remaining mocks stay visual only.
export const withMockFilters = (
  categorySlug: string,
  attributes: CategoryAttribute[],
): FilterAttribute[] => {
  const filterable = attributes.filter((attribute) => attribute.type !== "STRING");
  const freeText = attributes.filter((attribute) => attribute.type === "STRING");

  const mocks = (MOCK_FILTERS_BY_CATEGORY[categorySlug] ?? []).flatMap((mockAttribute) => {
    if (filterable.some((real) => sameTitle(real, mockAttribute))) return [];
    const freeTextMatch = freeText.find((real) => sameTitle(real, mockAttribute));
    return freeTextMatch ? [{ ...mockAttribute, id: freeTextMatch.id, isMock: false }] : [mockAttribute];
  });

  return [...filterable, ...mocks];
};

export type BrandTile = { name: string; image: StaticImageData };

export type BrandTiles = { attributeSlug: string; brands: BrandTile[] };

// TODO(api): brand tiles should come from the backend with the brand attribute.
const MOCK_BRAND_TILES_BY_CATEGORY: Record<string, BrandTiles> = {
  smartphones: {
    attributeSlug: "brand",
    brands: [
      { name: "Apple", image: apple },
      { name: "Samsung", image: samsung },
      { name: "Xiaomi", image: xiaomi },
      { name: "Google", image: google },
      { name: "Motorola", image: motorola },
      { name: "OnePlus", image: oneplus },
      { name: "Nokia", image: nokia },
      { name: "Poco", image: poco },
    ],
  },
};

export const getMockBrandTiles = (categorySlug: string): BrandTiles | undefined =>
  MOCK_BRAND_TILES_BY_CATEGORY[categorySlug];
