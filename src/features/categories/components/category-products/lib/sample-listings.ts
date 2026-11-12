import {
  getSampleSmartphones,
  SMARTPHONES_CATEGORY_ID,
  type SampleSmartphone,
} from "@/features/products/components/prod-cards-grid/prod-card/lib/sample-smartphones";
import type { ProductSortOption } from "@/features/products/lib/product-sort";
import type { ProductCardType } from "@/types/product";

import type { AttributeValue, CategoryFilters } from "../../category-filters/lib/filter-state";
import type { FilterAttribute } from "../../category-filters/lib/mock-filter-attributes";

// What a sample phone knows about itself, by filter slug.
const SAMPLE_VALUES_BY_SLUG: Record<string, (phone: SampleSmartphone) => string> = {
  brand: (phone) => phone.brand,
  storage: (phone) => phone.storage,
};

const hasValue = (value: AttributeValue | undefined) =>
  Boolean(value && (value.values.length || value.min || value.max));

const matchesAttributes = (
  phone: SampleSmartphone,
  filters: CategoryFilters,
  attributes: FilterAttribute[],
) =>
  attributes.every((attribute) => {
    const selected = filters.attributes[attribute.id];
    if (!hasValue(selected)) return true;
    const getValue = SAMPLE_VALUES_BY_SLUG[attribute.slug];
    // A filter the sample has no data for (colour, repair history…) leaves it out.
    return getValue ? Boolean(selected?.values.includes(getValue(phone))) : false;
  });

const matchesFilters = (
  phone: SampleSmartphone,
  filters: CategoryFilters,
  attributes: FilterAttribute[],
) => {
  const { price, address } = phone.card;
  const minPrice = filters.price.min ? Number(filters.price.min) : 0;
  const maxPrice = filters.price.max ? Number(filters.price.max) : Infinity;

  return (
    price >= minPrice &&
    price <= maxPrice &&
    (!filters.cities.length || filters.cities.includes(address.city)) &&
    (!filters.conditions.length || filters.conditions.includes(phone.condition)) &&
    matchesAttributes(phone, filters, attributes)
  );
};

const COMPARE_BY_SORT: Record<ProductSortOption, (a: ProductCardType, b: ProductCardType) => number> =
  {
    RELEVANCE: () => 0,
    PRICE_ASC: (a, b) => a.price - b.price,
    PRICE_DESC: (a, b) => b.price - a.price,
    CREATED_AT_DESC: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  };

export const sortListings = (cards: ProductCardType[], sort: ProductSortOption) =>
  [...cards].sort(COMPARE_BY_SORT[sort]);

// TODO(api): sample phones from the Figma page fill the smartphones listing while the backend
// has only a few. They follow the filters they have data for and are never sent to the API.
export const getSampleListings = (
  categoryId: string,
  filters: CategoryFilters,
  attributes: FilterAttribute[],
): ProductCardType[] => {
  if (categoryId !== SMARTPHONES_CATEGORY_ID) return [];
  return getSampleSmartphones()
    .filter((phone) => matchesFilters(phone, filters, attributes))
    .map((phone) => phone.card);
};
