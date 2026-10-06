import { Suspense } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button/button";
import { ChatBubbleIcon } from "@/components/ui/icons";
import CategoryDropdown from "@/features/categories/components/category-dropdown/CategoryDropdown";
import HeaderAuth from "./auth/HeaderAuth";
import HeaderFavoritesLink from "./favorites/HeaderFavoritesLink";
import Logo from "./logo/Logo";
import SearchBar from "./search-bar/SearchBar";

const Header = () => {
  return (
    <header className="font-mazzard sticky top-0 left-0 z-10 flex h-28 w-full items-center justify-center border-b border-stroke-primary-subtle bg-surface-primary lg:h-20">
      <div className="mx-auto grid h-full w-full max-w-330 grid-cols-[auto_minmax(0,1fr)] grid-rows-[48px_64px] items-center gap-x-3 px-4 sm:px-6 lg:flex lg:gap-5 lg:px-0">
        <div className="col-start-1 row-start-1 lg:shrink-0">
          <Logo className="h-7 sm:h-8 lg:h-9" />
        </div>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-1 sm:gap-2 lg:order-last lg:ml-auto">
          <HeaderFavoritesLink />
          <Button
            variant="secondary"
            aria-label="Повідомлення"
            className="hidden size-8 border-0 p-0 sm:inline-flex"
          >
            <ChatBubbleIcon className="size-6" />
          </Button>
          <HeaderAuth />
          <Button
            aria-label="Додати оголошення"
            className="size-9 p-0 sm:h-10 sm:w-auto sm:px-3 lg:px-4"
          >
            <Plus aria-hidden="true" className="size-5 sm:hidden" />
            <span className="hidden sm:inline">Додати оголошення</span>
          </Button>
        </div>

        <div className="col-start-1 row-start-2">
          <CategoryDropdown />
        </div>

        <div className="col-start-2 row-start-2 min-w-0 lg:flex-1">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;
