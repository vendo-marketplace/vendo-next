import { CategoryPageView } from "@/features/categories/components/category-page/CategoryPageView";

interface CategoryBrandPageProps {
  params: Promise<{
    parentSlug: string;
    categorySlug: string;
    brandSlug: string;
  }>;
}

export default async function CategoryBrandPage({ params }: CategoryBrandPageProps) {
  const { parentSlug, categorySlug, brandSlug } = await params;
  return (
    <CategoryPageView
      parentSlug={parentSlug}
      categorySlug={categorySlug}
      brandSlug={brandSlug}
    />
  );
}
