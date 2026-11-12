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

const without = <T>(list: T[], value: T) => list.filter((item) => item !== value);

const setAttribute = (
  filters: CategoryFilters,
  attributeId: string,
  update: (value: AttributeValue) => AttributeValue,
): CategoryFilters => ({
  ...filters,
  attributes: {
    ...filters.attributes,
    [attributeId]: update(filters.attributes[attributeId] ?? EMPTY_ATTRIBUTE_VALUE),
  },
});

// Multi-value filters get one chip per value, so a single city or brand can be removed.
const getAttributeChips = (
  attribute: CategoryAttribute,
  filters: CategoryFilters,
): ActiveFilterChip[] => {
  const value = filters.attributes[attribute.id] ?? EMPTY_ATTRIBUTE_VALUE;
  const clear = (current: CategoryFilters) =>
    setAttribute(current, attribute.id, () => EMPTY_ATTRIBUTE_VALUE);

  switch (attribute.type) {
    case "ENUM":
      return value.values.map((option) => ({
        key: `${attribute.id}:${option}`,
        label: `${attribute.title}: ${option}`,
        remove: (current) =>
          setAttribute(current, attribute.id, (previous) => ({
            ...previous,
            values: without(previous.values, option),
          })),
      }));
    case "BOOLEAN":
      return value.values.length
        ? [{ key: attribute.id, label: attribute.title, remove: clear }]
        : [];
    case "RANGE":
      return value.min || value.max
        ? [
            {
              key: attribute.id,
              label: `${attribute.title}: ${formatRange(value.min, value.max)}`,
              remove: clear,
            },
          ]
        : [];
    case "NUMBER":
      return value.min
        ? [{ key: attribute.id, label: `${attribute.title}: ${value.min}`, remove: clear }]
        : [];
    default:
      return [];
  }
};

export const getActiveFilterChips = (
  filters: CategoryFilters,
  attributes: CategoryAttribute[],
): ActiveFilterChip[] => [
  ...filters.cities.map((city) => ({
    key: `city:${city}`,
    label: `Місто: ${city}`,
    remove: (current: CategoryFilters) => ({ ...current, cities: without(current.cities, city) }),
  })),
  ...(filters.price.min || filters.price.max
    ? [
        {
          key: "price",
          label: `Ціна: ${formatRange(filters.price.min, filters.price.max)}`,
          remove: (current: CategoryFilters) => ({ ...current, price: EMPTY_PRICE_RANGE }),
        },
      ]
    : []),
  ...CONDITION_OPTIONS.filter((option) => filters.conditions.includes(option.value)).map(
    (option) => ({
      key: `condition:${option.value}`,
      label: `Стан: ${option.label}`,
      remove: (current: CategoryFilters) => ({
        ...current,
        conditions: without(current.conditions, option.value),
      }),
    }),
  ),
  ...attributes.flatMap((attribute) => getAttributeChips(attribute, filters)),
];
