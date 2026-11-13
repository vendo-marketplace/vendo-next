import { HorizontalScroller } from "@/components/ui/horizontal-scroller";
import { getCategoryOptions } from "@/features/categories/server/get-category-options";

import { CategoryTile } from "./CategoryTile";

// Below desktop, where the bento shows only the promo, all categories follow as one row of the
// same colourful tiles that scrolls sideways.
export default async function HomeCategories() {
  const result = await getCategoryOptions();
  if (!result.success || result.data.length === 0) return null;

  return (
    <section className="page-container pt-4 lg:hidden">
      <h2 className="sr-only">Категорії</h2>
      <HorizontalScroller label="Категорії" className="gap-3">
        {result.data.map((category) => (
          <li key={category.id} className="shrink-0 snap-start">
            <CategoryTile category={category} className="size-36 sm:size-40" />
          </li>
        ))}
      </HorizontalScroller>
    </section>
  );
}
