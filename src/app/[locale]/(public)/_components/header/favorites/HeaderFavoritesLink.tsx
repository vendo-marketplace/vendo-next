"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";
import { HeartIcon } from "@/components/ui/icons";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { Link } from "@/i18n/navigation";

const HeaderFavoritesLink = () => {
  const t = useTranslations("Favorites");
  const { favoriteIds, isLoading } = useFavorites();
  const favoritesCount = favoriteIds.size;

  return (
    <Button
      asChild
      variant="secondary"
      className="relative size-8 border-0 p-0 "
    >
      <Link href="/favorites" aria-label={t("title")}>
        <HeartIcon className="size-6" aria-hidden="true" />
        {!isLoading && favoritesCount > 0 && (
          <span className="bg-brand-600 absolute rounded-full size-3 top-[1.5px] right-px text-[8px] text-center leading-3 font-medium text-[#FCFCFC]">
            {favoritesCount}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default HeaderFavoritesLink;
