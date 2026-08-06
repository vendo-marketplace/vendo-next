import { Suspense } from "react";

import CategoryDropdown from "@/features/categories/components/category-dropdown/CategoryDropdown";
import Logo from "./logo/Logo";
import SearchBar from "./search-bar/SearchBar";

const Header = () => {
  return (
    <header className="font-mazzard sticky top-0 left-0 z-10 flex h-20 w-full items-center justify-center border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto w-full max-w-330 flex h-full justify-between items-center">
        <div className="flex items-center gap-7.5 w-full">
          <Logo />
          <div className="flex items-center gap-3 flex-1">
            <CategoryDropdown />
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
