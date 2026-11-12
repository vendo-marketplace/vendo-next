import { notFound } from "next/navigation";

import { getCategoryAttributes } from "../../server/get-category-attributes";
import { getBrandSlug, CategoryHeader } from "../category-header/CategoryHeader";
import { EMPTY_FILTERS, type CategoryFilters } from "../category-filters/lib/filter-state";
import {
  getMockBrandTiles,
  withMockFilters,
  type FilterAttribute,
} from "../category-filters/lib/mock-filter-attributes";
import CategoryProducts from "../category-products/CategoryProducts";
import { ListingsCountProvider } from "./ListingsCount";
import { getOptionCounts } from "../../server/get-option-counts";

// Real attributes with a known option list get live counts; mocks keep their sample ones.
const withOptionCounts = (categoryId: string, attributes: FilterAttribute[]) =>
  Promise.all(
    attributes.map(async (attribute) => {
      const options = attribute.allowedValues ?? [];
      if (attribute.isMock || attribute.type !== "ENUM" || !options.length) return attribute;

      const optionCounts = await getOptionCounts(categoryId, attribute.id, options);
      return optionCounts ? { ...attribute, optionCounts } : attribute;
    }),
  );

export async function CategoryPageView({
  parentSlug,
  categorySlug,
  brandSlug,
}: {
  parentSlug: string;
  categorySlug: string;
  brandSlug?: string;
}) {
  const result = await getCategoryAttributes(parentSlug, categorySlug);

  if (!result.success) {
    return (
      <section className="page-container py-8">
        <h1 className="text-display-xs font-semibold text-text-primary">Категорію не знайдено</h1>
      </section>
    );
  }

  const { category, trail, attributes } = result.data;
  const filterAttributes = await withOptionCounts(
    category.id,
    withMockFilters(category.slug, attributes),
  );
  const brandTiles = getMockBrandTiles(category.slug);
  const brandAttribute = filterAttributes.find(
    (attribute) => attribute.slug === brandTiles?.attributeSlug,
  );
  const brand = brandSlug
    ? brandTiles?.brands.find(({ name }) => getBrandSlug(name) === brandSlug)
    : undefined;

  if (brandSlug && !brand) notFound();

  const initialFilters: CategoryFilters =
    brand && brandAttribute
      ? {
          ...EMPTY_FILTERS,
          attributes: { [brandAttribute.id]: { values: [brand.name], min: "", max: "" } },
        }
      : EMPTY_FILTERS;

  return (
    <section className="page-container py-8">
      <ListingsCountProvider>
        <CategoryHeader
          category={category}
          trail={trail}
          brandTiles={brandTiles?.brands}
          currentBrand={brand?.name}
        />
        <CategoryProducts
          key={brand?.name ?? "all"}
          categoryId={category.id}
          attributes={filterAttributes}
          initialFilters={initialFilters}
        />
      </ListingsCountProvider>
    </section>
  );
}
