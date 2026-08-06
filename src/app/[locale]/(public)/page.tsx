import RecommendedProducts from "@/app/[locale]/(public)/_components/recommended-prods/RecommendedProducts";
import HomeHero from "./_components/hero/HomeHero";

export default function Home() {
  return (
    <>
      <HomeHero />
      <RecommendedProducts />
    </>
  );
}
