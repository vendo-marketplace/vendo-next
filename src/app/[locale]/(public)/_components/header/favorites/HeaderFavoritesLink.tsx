"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";
import { HeartIcon } from "@/components/ui/icons";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { useSyncGuestFavorites } from "@/features/favorites/hooks/use-sync-guest-favorites";
import { Link } from "@/i18n/navigation";

const HeaderFavoritesLink = () => {
  const t = useTranslations("Favorites");
  useSyncGuestFavorites();
  const { favoriteIds, isLoading } = useFavorites();
  const favoritesCount = favoriteIds.size;

  return (
    <Button
      asChild
      variant="secondary"
      className="relative size-8 border-0 p-0 "
    >
      <Link
        href="/favorites"
        aria-label={
          isLoading ? t("title") : t("headerLabel", { count: favoritesCount })
        }
      >
        <HeartIcon className="size-6" aria-hidden="true" />
        {!isLoading && favoritesCount > 0 && (
          <span className="bg-surface-brand absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold text-text-invert">
            {favoritesCount > 99 ? "99+" : favoritesCount}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default HeaderFavoritesLink;
