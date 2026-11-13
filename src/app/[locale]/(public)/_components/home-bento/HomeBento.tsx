import { getCategoryOptions } from "@/features/categories/server/get-category-options";

import { CategoryTile } from "../home-categories/CategoryTile";
import { AllCategoriesTile } from "./AllCategoriesTile";
import { BuyerBanner, SellerBanner } from "./PromoBanners";

// The categories people open most, in this order; the rest are one tap away in the catalog.
// TODO(api): swap for real popularity once the backend tracks it.
const TOP_CATEGORY_WORDS = ["електрон", "нерухом", "авто", "одяг", "дім"];

// The top of the homepage: a wide blue banner for sellers next to a narrower light one for buyers, then
// a row of popular categories with "Усі категорії" at the end. Below desktop the buyer banner and
// the category row are hidden here; the categories follow as a scrolling row of tiles.
export default async function HomeBento() {
  const result = await getCategoryOptions();
  const categories = result.success ? result.data : [];
  const topCategories = TOP_CATEGORY_WORDS.map((word) =>
    categories.find((category) =>
      category.title.toLocaleLowerCase("uk").includes(word),
    ),
  ).filter((category) => category !== undefined);

  return (
    <section className="page-container flex flex-col gap-3 pt-6 lg:gap-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
        <SellerBanner className="min-h-48 sm:min-h-56 lg:col-span-2 lg:min-h-84" />
        <BuyerBanner className="hidden lg:block" />
      </div>
      {topCategories.length > 0 && (
        <nav aria-label="Популярні категорії" className="hidden lg:block">
          <ul className="grid grid-cols-6 gap-4">
            {topCategories.map((category) => (
              <li key={category.id} className="flex">
                <CategoryTile category={category} className="h-44 flex-1" />
              </li>
            ))}
            <li className="flex">
              <AllCategoriesTile
                moreCount={categories.length - topCategories.length}
                className="h-44 flex-1"
              />
            </li>
          </ul>
        </nav>
      )}
    </section>
  );
}
