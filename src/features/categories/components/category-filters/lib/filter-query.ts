import type { AttributeValueFilter, SearchProductsQuery } from "@/types/product";

import {
  EMPTY_ATTRIBUTE_VALUE,
  type AttributeValue,
  type CategoryFilters,
  type Condition,
} from "./filter-state";
import type { FilterAttribute } from "./mock-filter-attributes";

const toConditionQuery = (conditions: Condition[]) => {
  // TODO(api): "like-new" has no backend field yet; only isNew true/false exists.
  const wantsNew = conditions.includes("new");
  const wantsUsed = conditions.includes("used");
  return wantsNew === wantsUsed ? {} : { isNew: wantsNew };
};

const toAttributeFilter = (
  attribute: FilterAttribute,
  value: AttributeValue,
): AttributeValueFilter | undefined => {
  switch (attribute.type) {
    case "ENUM":
    case "BOOLEAN":
      return value.values.length ? { id: attribute.id, values: value.values } : undefined;
    case "RANGE":
      return value.min || value.max
        ? { id: attribute.id, values: [value.min, value.max] }
        : undefined;
    case "NUMBER":
      return value.min ? { id: attribute.id, values: [value.min] } : undefined;
    default:
      return undefined;
  }
};

export const toSearchFilters = (
  filters: CategoryFilters,
  attributes: FilterAttribute[],
): Partial<SearchProductsQuery> => {
  const minPrice = filters.price.min ? Number(filters.price.min) : undefined;
  const maxPrice = filters.price.max ? Number(filters.price.max) : undefined;
  // Mock sections have no backend attribute behind them, so they stay out of the query.
  const attributeFilters = attributes.filter((attribute) => !attribute.isMock).flatMap(
    (attribute) =>
      toAttributeFilter(attribute, filters.attributes[attribute.id] ?? EMPTY_ATTRIBUTE_VALUE) ??
      [],
  );
  // TODO(api): the backend filters by a single city; send all once it accepts a list.
  const [city] = filters.cities;

  return {
    ...toConditionQuery(filters.conditions),
    ...(city ? { addressFilter: { city } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { priceRangeFilter: { minPrice, maxPrice } }
      : {}),
    ...(attributeFilters.length ? { attributeFilter: { attributes: attributeFilters } } : {}),
  };
};
