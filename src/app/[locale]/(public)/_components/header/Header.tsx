import { Suspense } from "react";

import { Button } from "@/components/ui/button/button";
import { ChatIcon } from "@/assets/icons/ChatIcon";
import { PlusIcon } from "@/assets/icons/PlusIcon";
import CategoryDropdown from "@/features/categories/components/category-dropdown/CategoryDropdown";
import HeaderAuth from "./auth/HeaderAuth";
import HeaderFavoritesLink from "./favorites/HeaderFavoritesLink";
import Logo from "./logo/Logo";
import SearchBar from "./search-bar/SearchBar";
import { Link } from "@/i18n/navigation";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 z-50 flex h-28 w-full items-center justify-center border-b border-stroke-secondary bg-surface-primary lg:h-19">
      <div className="page-container grid h-full grid-cols-[auto_minmax(0,1fr)] grid-rows-[48px_64px] items-center gap-x-3 lg:flex lg:gap-3 xl:gap-4">
        <div className="col-start-1 row-start-1 lg:shrink-0">
          <Logo />
        </div>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-1 sm:gap-2 lg:order-last lg:ml-auto">
          <HeaderFavoritesLink />
          <Button
            asChild
            variant="outline"
            aria-label="Повідомлення"
            className="hidden size-8 border-0 p-0 sm:inline-flex"
          >
            <Link href="/chats">
              <ChatIcon size={24} />
            </Link>
          </Button>
          <HeaderAuth />
          <Button
            asChild
            aria-label="Додати оголошення"
            className="size-9 p-0 sm:h-10 sm:w-auto sm:px-3 lg:px-4"
          >
            <Link href="/create">
              <PlusIcon size={20} className="sm:hidden" />
              <span className="hidden sm:inline">Додати оголошення</span>
            </Link>
          </Button>
        </div>

        <div className="col-start-1 row-start-2">
          <CategoryDropdown />
        </div>

        <div className="col-start-2 row-start-2 min-w-0 lg:max-w-[520px] lg:flex-1">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;
