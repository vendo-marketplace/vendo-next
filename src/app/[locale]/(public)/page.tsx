import RecommendedProducts from "@/app/[locale]/(public)/_components/recommended-prods/RecommendedProducts";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Suspense } from "react";

import HomeHero from "./_components/hero/HomeHero";

export default function Home() {
  return (
    <>
      <HomeHero />
      <Suspense fallback={<LoadingSpinner />}>
        <RecommendedProducts />
      </Suspense>
    </>
  );
}
