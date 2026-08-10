import { Suspense } from "react";

import { Button } from "@/components/ui/button/button";
import {
  ChatBubbleIcon,
  CircleUserIcon,
  HeartIcon,
} from "@/components/ui/icons";
import CategoryDropdown from "@/features/categories/components/category-dropdown/CategoryDropdown";
import Logo from "./logo/Logo";
import SearchBar from "./search-bar/SearchBar";
import { Link } from "@/i18n/navigation";

const Header = () => {
  return (
    <header className="font-mazzard sticky top-0 left-0 z-10 flex h-20 w-full items-center justify-center border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto w-full max-w-330 flex h-full justify-between gap-50 items-center">
        <div className="flex items-center gap-7.5 w-full flex-1">
          <Logo />
          <div className="flex items-center gap-3 flex-1">
            <CategoryDropdown />
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="size-8 p-0 border-0">
              <HeartIcon className="size-6 " />
            </Button>
            <Button variant="secondary" className="size-8 p-0 border-0">
              <ChatBubbleIcon className="size-6" />
            </Button>
            <Button
              asChild
              variant="secondary"
              className="size-8 border-0 p-0"
            >
              <Link href={"/sign-in"}>
                <CircleUserIcon className="size-6" />
              </Link>
            </Button>
          </div>
          <Button>Додати оголошення</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
