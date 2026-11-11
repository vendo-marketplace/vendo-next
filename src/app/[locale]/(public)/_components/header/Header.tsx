import { Suspense } from "react";

import { Button } from "@/components/ui/button/button";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import CategoryDropdown from "@/features/categories/components/category-dropdown/CategoryDropdown";
import { Link } from "@/i18n/navigation";

import HeaderAuth from "./auth/HeaderAuth";
import HeaderFavoritesLink from "./favorites/HeaderFavoritesLink";
import Logo from "./logo/Logo";
import HeaderMobileSearch from "./search-bar/HeaderMobileSearch";
import SearchBar from "./search-bar/SearchBar";

// Figma 5083-17521 / 5085-18281:
// - phones (5083-17681, taller by request): a 56px row with the logo and two 24px icons 4px apart; the rest is in
//   the bottom menu;
// - tablets: catalog icon, search field, icons and "+ Додати";
// - desktop: "Каталог", search field, icons or "Вхід / Реєстрація", "Додати оголошення".
const Header = () => {
  return (
    <header className="sticky top-0 left-0 z-50 h-14 w-full border-b border-stroke-secondary bg-surface-primary md:h-19">
      <div className="page-container relative flex h-full items-center gap-3 xl:gap-4">
        <Logo className="shrink-0" />

        <CategoryDropdown />

        <div className="hidden min-w-0 flex-1 md:block lg:max-w-130">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:gap-2">
          <Suspense fallback={null}>
            <HeaderMobileSearch />
          </Suspense>
          <HeaderFavoritesLink />
          <HeaderAuth />
          <Button asChild className="ml-1 hidden h-10 gap-1.5 px-3 md:inline-flex lg:ml-2 lg:px-4">
            <Link href="/create">
              <PlusIcon size={20} className="lg:hidden" />
              <span className="lg:hidden">Додати</span>
              <span className="hidden lg:inline">Додати оголошення</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
