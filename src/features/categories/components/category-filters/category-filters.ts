import type { AttributeValueFilter, SearchProductsQuery } from "@/types/product";

import type { CategoryAttribute } from "../../types/category";

export type AttributeValue = {
  values: string[];
  min: string;
  max: string;
};

export type Condition = "new" | "like-new" | "used";

export type CategoryFilters = {
  cities: string[];
  price: { min: string; max: string };
  conditions: Condition[];
  attributes: Record<string, AttributeValue>;
};

export const EMPTY_ATTRIBUTE_VALUE: AttributeValue = { values: [], min: "", max: "" };

export const EMPTY_FILTERS: CategoryFilters = {
  cities: [],
  price: { min: "", max: "" },
  conditions: [],
  attributes: {},
};

export const POPULAR_CITIES = ["Київ", "Львів", "Одеса", "Дніпро", "Харків"];

// TODO(api): take the bounds from the category's real price range.
export const PRICE_SLIDER_MAX = 100_000;
export const PRICE_SLIDER_STEP = 500;

export const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: "new", label: "Новий" },
  { value: "like-new", label: "Як новий" },
  { value: "used", label: "Вживаний" },
];

const COLOR_SWATCHES: Record<string, string> = {
  чорний: "#292929",
  білий: "#ffffff",
  синій: "#105fff",
  блакитний: "#50a6ff",
  зелений: "#008236",
  сірий: "#989898",
  червоний: "#ef0d12",
  жовтий: "#ffb132",
  помаранчевий: "#ff980a",
  фіолетовий: "#862eef",
  рожевий: "#ff9a9c",
  золотий: "#d4af37",
  срібний: "#c0c0c0",
};

export const getColorSwatch = (value: string) =>
  COLOR_SWATCHES[value.trim().toLowerCase()];

export const isColorAttribute = (attribute: CategoryAttribute) =>
  /colou?r|колір/i.test(`${attribute.slug} ${attribute.title}`);

const CHIP_MAX_OPTIONS = 6;
const CHIP_MAX_LABEL_LENGTH = 10;

// Short value sets (memory, battery) read better as chips, long ones as a checkbox list.
export const shouldRenderAsChips = (options: string[]) =>
  options.length <= CHIP_MAX_OPTIONS &&
  options.every((option) => option.length <= CHIP_MAX_LABEL_LENGTH);

export const formatPrice = (value: string) =>
  value === "" ? "" : Number(value).toLocaleString("uk-UA");

const toConditionQuery = (conditions: Condition[]) => {
  // TODO(api): "like-new" has no backend field yet; only isNew true/false exists.
  const wantsNew = conditions.includes("new");
  const wantsUsed = conditions.includes("used");
  if (wantsNew === wantsUsed) return {};
  return { isNew: wantsNew };
};

const toAttributeFilters = (
  attributes: CategoryAttribute[],
  values: Record<string, AttributeValue>,
): AttributeValueFilter[] =>
  attributes.flatMap((attribute) => {
    const value = values[attribute.id] ?? EMPTY_ATTRIBUTE_VALUE;
    if (attribute.type === "ENUM" || attribute.type === "BOOLEAN") {
      return value.values.length ? [{ id: attribute.id, values: value.values }] : [];
    }
    if (attribute.type === "RANGE") {
      return value.min || value.max
        ? [{ id: attribute.id, values: [value.min, value.max] }]
        : [];
    }
    if (attribute.type === "NUMBER" && value.min !== "") {
      return [{ id: attribute.id, values: [value.min] }];
    }
    return [];
  });

export const toSearchFilters = (
  filters: CategoryFilters,
  attributes: CategoryAttribute[],
): Partial<SearchProductsQuery> => {
  const minPrice = filters.price.min ? Number(filters.price.min) : undefined;
  const maxPrice = filters.price.max ? Number(filters.price.max) : undefined;
  const attributeFilters = toAttributeFilters(attributes, filters.attributes);
  // TODO(api): the backend filters by a single city; send all once it accepts a list.
  const [city] = filters.cities;

  return {
    ...toConditionQuery(filters.conditions),
    ...(city ? { addressFilter: { city } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { priceRangeFilter: { minPrice, maxPrice } }
      : {}),
    ...(attributeFilters.length
      ? { attributeFilter: { attributes: attributeFilters } }
      : {}),
  };
};

export type ActiveFilterChip = {
  key: string;
  label: string;
  remove: (filters: CategoryFilters) => CategoryFilters;
};

const formatRange = (min: string, max: string) =>
  [min && `від ${formatPrice(min)}`, max && `до ${formatPrice(max)}`]
    .filter(Boolean)
    .join(" ");

export const getActiveFilterChips = (
  filters: CategoryFilters,
  attributes: CategoryAttribute[],
): ActiveFilterChip[] => {
  const chips: ActiveFilterChip[] = [];

  if (filters.cities.length) {
    chips.push({
      key: "cities",
      label: `Місто: ${filters.cities.join(", ")}`,
      remove: (current) => ({ ...current, cities: [] }),
    });
  }

  if (filters.price.min || filters.price.max) {
    chips.push({
      key: "price",
      label: `Ціна: ${formatRange(filters.price.min, filters.price.max)}`,
      remove: (current) => ({ ...current, price: { min: "", max: "" } }),
    });
  }

  if (filters.conditions.length) {
    const labels = CONDITION_OPTIONS.filter((option) =>
      filters.conditions.includes(option.value),
    ).map((option) => option.label);
    chips.push({
      key: "conditions",
      label: `Стан: ${labels.join(", ")}`,
      remove: (current) => ({ ...current, conditions: [] }),
    });
  }

  for (const attribute of attributes) {
    const value = filters.attributes[attribute.id];
    if (!value) continue;

    const removeAttribute = (current: CategoryFilters) => ({
      ...current,
      attributes: { ...current.attributes, [attribute.id]: EMPTY_ATTRIBUTE_VALUE },
    });

    if (attribute.type === "BOOLEAN" && value.values.length) {
      chips.push({ key: attribute.id, label: attribute.title, remove: removeAttribute });
    } else if (attribute.type === "ENUM" && value.values.length) {
      chips.push({
        key: attribute.id,
        label: `${attribute.title}: ${value.values.join(", ")}`,
        remove: removeAttribute,
      });
    } else if ((attribute.type === "RANGE" || attribute.type === "NUMBER") && (value.min || value.max)) {
      chips.push({
        key: attribute.id,
        label: `${attribute.title}: ${attribute.type === "NUMBER" ? value.min : formatRange(value.min, value.max)}`,
        remove: removeAttribute,
      });
    }
  }

  return chips;
};

const pluralRules = new Intl.PluralRules("uk-UA");
const LISTING_FORMS: Record<string, string> = {
  one: "оголошення",
  few: "оголошення",
  many: "оголошень",
  other: "оголошення",
};

export const formatListingsFound = (count: number) =>
  `Знайдено ${count.toLocaleString("uk-UA")} ${LISTING_FORMS[pluralRules.select(count)]}`;
