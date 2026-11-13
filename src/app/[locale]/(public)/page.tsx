import RecommendedProducts from "@/app/[locale]/(public)/_components/recommended-prods/RecommendedProducts";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Suspense } from "react";

import HomeCategories from "./_components/home-categories/HomeCategories";
import HomeBento from "./_components/home-bento/HomeBento";

// A soft, slightly warm grey instead of the plain grey, carried out to the window edges.
const HOME_BACKGROUND = "#f6f6f7";

export default function Home() {
  return (
    <div
      className="flex flex-col pb-8"
      style={{
        backgroundColor: HOME_BACKGROUND,
        boxShadow: `0 0 0 100vmax ${HOME_BACKGROUND}`,
        clipPath: "inset(0 -100vmax)",
      }}
    >
      <Suspense fallback={null}>
        <HomeBento />
      </Suspense>
      <Suspense fallback={null}>
        <HomeCategories />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <RecommendedProducts />
      </Suspense>
    </div>
  );
}
