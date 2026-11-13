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

  // Tablets: a 32px heart; its outline starts 4px inside the box, so the button moves 4px right
  // and the drawn heart lines up with the page's right edge.
  return (
    <Button
      asChild
      variant="outline"
      className="relative size-7 border-0 p-0 text-text-primary hover:bg-transparent hover:text-text-brand after:absolute after:-inset-x-0.5 after:-inset-y-2 after:content-[''] md:-mr-1 md:size-8 md:after:-inset-1 lg:mr-0 lg:size-10 lg:after:hidden"
    >
      <Link
        href="/favorites"
        aria-label={
          isLoading ? t("title") : t("headerLabel", { count: favoritesCount })
        }
      >
        <NavHeartIcon size={28} className="md:size-8 lg:size-6" />
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
