import { CategoryPageView } from "@/features/categories/components/category-page/CategoryPageView";

interface CategoryPageProps {
  params: Promise<{
    parentSlug: string;
    categorySlug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { parentSlug, categorySlug } = await params;
  return <CategoryPageView parentSlug={parentSlug} categorySlug={categorySlug} />;
}
