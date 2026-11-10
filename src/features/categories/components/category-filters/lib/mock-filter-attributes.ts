import type { CategoryAttribute } from "../../../types/category";

// A category attribute as the filters panel sees it. Mocks fill in mockup sections
// the backend does not expose yet; they render and show as chips but never reach the API.
export type FilterAttribute = CategoryAttribute & {
  isMock?: boolean;
  display?: "chips" | "checkboxes";
  description?: string;
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
  }),
  mock({
    id: "mock-repair-history",
    slug: "repair-history",
    title: "Історія ремонту",
    type: "ENUM",
    allowedValues: ["Не ремонтувався", "Замінено батарею", "Замінено екран", "Інший ремонт"],
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

// Real attributes win: a mock is skipped when the category already has one with that title.
export const withMockFilters = (
  categorySlug: string,
  attributes: CategoryAttribute[],
): FilterAttribute[] => {
  const realTitles = new Set(attributes.map((attribute) => attribute.title.toLowerCase()));
  const mocks = (MOCK_FILTERS_BY_CATEGORY[categorySlug] ?? []).filter(
    (attribute) => !realTitles.has(attribute.title.toLowerCase()),
  );
  return [...attributes, ...mocks];
};
