import { getCategoryAttributes } from "@/features/categories/server/get-category-attributes";
import CategoryProducts from "@/features/categories/components/category-products/CategoryProducts";

interface CategoryPageProps {
  params: Promise<{
    parentSlug: string;
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { parentSlug, categorySlug } = await params;
  const result = await getCategoryAttributes(parentSlug, categorySlug);
  const category = result.success ? result.data.category : undefined;
  const attributes = result.success ? result.data.attributes : [];
  const visibleAttributes = attributes.filter(
    (attribute) => attribute.type !== "STRING",
  );

  return (
    <section className="mx-auto w-full max-w-330 px-4 py-8">
      <p className="text-sm text-text-tertiary">
        {category?.title ?? parentSlug}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-text-primary">
        {category?.title ?? categorySlug}
      </h1>
      {category && (
        <CategoryProducts
          categoryId={category.id}
          attributes={visibleAttributes}
        />
      )}
    </section>
  );
}
