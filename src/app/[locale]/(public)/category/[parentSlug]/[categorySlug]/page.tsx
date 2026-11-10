import { CategoryHeader } from "@/features/categories/components/category-header/CategoryHeader";
import CategoryProducts from "@/features/categories/components/category-products/CategoryProducts";
import { getCategoryAttributes } from "@/features/categories/server/get-category-attributes";

interface CategoryPageProps {
  params: Promise<{
    parentSlug: string;
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { parentSlug, categorySlug } = await params;
  const result = await getCategoryAttributes(parentSlug, categorySlug);

  if (!result.success) {
    return (
      <section className="page-container py-8">
        <h1 className="text-display-xs font-semibold text-text-primary">
          Категорію не знайдено
        </h1>
      </section>
    );
  }

  const { category, trail, attributes } = result.data;
  const visibleAttributes = attributes.filter(
    (attribute) => attribute.type !== "STRING",
  );

  return (
    <section className="page-container py-8">
      <CategoryHeader category={category} trail={trail} />
      <CategoryProducts categoryId={category.id} attributes={visibleAttributes} />
    </section>
  );
}
