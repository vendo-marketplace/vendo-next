"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import { useTranslations } from "next-intl";

const FavoritesPage = () => {
  const t = useTranslations("Favorites");
  const { favorites, isLoading } = useFavorites();
  console.log("favorites: ", favorites);

  return (
    <section className="mx-auto w-full max-w-330 flex-1 py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      {/* {isLoading ? (
        <LoadingSpinner />
      ) : isAuthenticated ? (
        <p className="text-neutral-600">{t("signedInComingSoon")}</p>
      ) : favorites.length ? (
        <ProductCardsGrid cards={favorites} />
      ) : (
        <p className="text-neutral-600">{t("empty")}</p>
      )} */}
    </section>
  );
};

export default FavoritesPage;
