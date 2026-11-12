import { Suspense } from "react";

import { Button } from "@/components/ui/button/button";
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
// - tablets: a 64px row with the logo, a 40px search field and the heart; like on phones, the
//   catalog, "+", chats and the account live in the bottom menu;
// - desktop: "Каталог", search field, icons or "Вхід / Реєстрація", "Додати оголошення".
const Header = () => {
  return (
    // The bottom line is an inset shadow, not a border, so the row keeps its full even height and
    // icons centre on whole pixels instead of blurring on a half pixel.
    <header className="sticky top-0 left-0 z-50 h-14 w-full bg-surface-primary shadow-[inset_0_-1px_0_var(--color-stroke-secondary)] md:h-16 lg:h-19">
      <div className="page-container relative flex h-full items-center gap-3 xl:gap-4">
        <Logo className="shrink-0 md:mr-4 lg:mr-0" />

        <CategoryDropdown />

        <div className="hidden min-w-0 flex-1 md:block md:max-w-120 lg:max-w-130">
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
          <Button asChild className="ml-2 hidden h-10 px-4 lg:inline-flex">
            <Link href="/create">Додати оголошення</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
