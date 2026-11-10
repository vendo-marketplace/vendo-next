export type AttributeValue = {
  values: string[];
  min: string;
  max: string;
};

export type Condition = "new" | "like-new" | "used";

export type PriceRange = { min: string; max: string };

export type CategoryFilters = {
  cities: string[];
  price: PriceRange;
  conditions: Condition[];
  attributes: Record<string, AttributeValue>;
};

export const EMPTY_ATTRIBUTE_VALUE: AttributeValue = { values: [], min: "", max: "" };

export const EMPTY_PRICE_RANGE: PriceRange = { min: "", max: "" };

export const EMPTY_FILTERS: CategoryFilters = {
  cities: [],
  price: EMPTY_PRICE_RANGE,
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

export const toggleValue = <T>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

export const keepDigits = (value: string) => value.replace(/\D/g, "");
