"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import ProductCardsGrid from "@/features/products/components/prod-cards-grid/ProductCardsGrid";
import { useTranslations } from "next-intl";
import { Heart, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/navigation";

const FavoritesPage = () => {
  const t = useTranslations("Favorites");
  const { favorites, isLoading, favoritesError, refetchFavorites } = useFavorites();

  return (
    <section className="mx-auto w-full max-w-330 flex-1 py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t("title")}</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : favoritesError ? (
        <div className="border-stroke-primary-subtle flex min-h-72 flex-col items-center justify-center rounded-2xl border bg-surface-secondary px-6 py-12 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-primary text-text-secondary">
            <RefreshCw className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold">{t("loadErrorTitle")}</h2>
          <p className="mt-2 max-w-md text-text-secondary">{t("loadError")}</p>
          <button
            type="button"
            onClick={() => void refetchFavorites()}
            className="bg-surface-brand text-text-invert mt-5 rounded-lg px-5 py-2.5 font-medium transition-opacity hover:opacity-90"
          >
            {t("retry")}
          </button>
        </div>
      ) : favorites.length > 0 ? (
        <ProductCardsGrid cards={favorites} />
      ) : (
        <div className="border-stroke-primary-subtle flex min-h-80 flex-col items-center justify-center rounded-2xl border bg-surface-secondary px-6 py-14 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-surface-primary text-text-brand">
            <Heart className="size-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold">{t("emptyTitle")}</h2>
          <p className="mt-2 max-w-md text-text-secondary">{t("empty")}</p>
          <Link
            href="/search"
            className="bg-surface-brand text-text-invert mt-6 rounded-lg px-5 py-2.5 font-medium transition-opacity hover:opacity-90"
          >
            {t("browseProducts")}
          </Link>
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
