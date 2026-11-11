"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";
import { NavHeartIcon } from "@/assets/icons/NavIcons";
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
      variant="outline"
      className="relative size-6 border-0 p-0 text-text-secondary hover:bg-transparent hover:text-text-brand after:absolute after:-inset-x-0.5 after:-inset-y-2 after:content-[''] md:size-10 md:after:hidden"
    >
      <Link
        href="/favorites"
        aria-label={
          isLoading ? t("title") : t("headerLabel", { count: favoritesCount })
        }
      >
        <NavHeartIcon size={24} />
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
