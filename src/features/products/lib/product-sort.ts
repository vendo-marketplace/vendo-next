import type { SearchProductsQuery } from "@/types/product";

type ProductSortDefinition = {
  value: string;
  label: string;
  query: SearchProductsQuery["sort"];
};

const PRODUCT_SORT_DEFINITIONS = [
  {
    value: "PRICE_ASC",
    label: "Спочатку дешевші",
    query: { sortBy: "PRICE", direction: "ASC" },
  },
  {
    value: "PRICE_DESC",
    label: "Спочатку дорожчі",
    query: { sortBy: "PRICE", direction: "DESC" },
  },
  {
    value: "CREATED_AT_DESC",
    label: "Найновіші",
    query: { sortBy: "CREATED_AT", direction: "DESC" },
  },
] as const satisfies readonly ProductSortDefinition[];

export type ProductSortOption =
  (typeof PRODUCT_SORT_DEFINITIONS)[number]["value"];

export const PRODUCT_SORT_OPTIONS = PRODUCT_SORT_DEFINITIONS.map(
  ({ value, label }) => ({ value, label }),
);

export const DEFAULT_PRODUCT_SORT =
  "CREATED_AT_DESC" satisfies ProductSortOption;

export const getProductSortQuery = (
  value: ProductSortOption,
): SearchProductsQuery["sort"] =>
  PRODUCT_SORT_DEFINITIONS.find((definition) => definition.value === value)!
    .query;

export const parseProductSortQuery = (
  sortBy: string | null,
  direction: string | null,
): ProductSortOption => {
  const defaultQuery = getProductSortQuery(DEFAULT_PRODUCT_SORT);
  const nextSortBy = PRODUCT_SORT_DEFINITIONS.some(
    ({ query }) => query.sortBy === sortBy,
  )
    ? sortBy
    : defaultQuery.sortBy;
  const nextDirection = PRODUCT_SORT_DEFINITIONS.some(
    ({ query }) => query.direction === direction,
  )
    ? direction
    : defaultQuery.direction;

  return (
    PRODUCT_SORT_DEFINITIONS.find(
      ({ query }) =>
        query.sortBy === nextSortBy && query.direction === nextDirection,
    )?.value ?? DEFAULT_PRODUCT_SORT
  );
};
