import type { CategoryAttribute } from "../../../types/category";
import { formatRange } from "./filter-display";
import {
  CONDITION_OPTIONS,
  EMPTY_ATTRIBUTE_VALUE,
  EMPTY_PRICE_RANGE,
  type AttributeValue,
  type CategoryFilters,
} from "./filter-state";

export type ActiveFilterChip = {
  key: string;
  label: string;
  remove: (filters: CategoryFilters) => CategoryFilters;
};

const getAttributeValueLabel = (
  attribute: CategoryAttribute,
  value: AttributeValue,
): string | undefined => {
  switch (attribute.type) {
    case "BOOLEAN":
      return value.values.length ? attribute.title : undefined;
    case "ENUM":
      return value.values.length ? `${attribute.title}: ${value.values.join(", ")}` : undefined;
    case "RANGE":
      return value.min || value.max
        ? `${attribute.title}: ${formatRange(value.min, value.max)}`
        : undefined;
    case "NUMBER":
      return value.min ? `${attribute.title}: ${value.min}` : undefined;
    default:
      return undefined;
  }
};

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
      remove: (current) => ({ ...current, price: EMPTY_PRICE_RANGE }),
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
    const label = getAttributeValueLabel(
      attribute,
      filters.attributes[attribute.id] ?? EMPTY_ATTRIBUTE_VALUE,
    );
    if (!label) continue;

    chips.push({
      key: attribute.id,
      label,
      remove: (current) => ({
        ...current,
        attributes: { ...current.attributes, [attribute.id]: EMPTY_ATTRIBUTE_VALUE },
      }),
    });
  }

  return chips;
};
