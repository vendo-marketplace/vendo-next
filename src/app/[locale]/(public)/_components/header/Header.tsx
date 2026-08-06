import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import Logo from "./logo/Logo";
import SearchBar from "./search-bar/SearchBar";

const Header = () => {
  return (
    <header className="font-mazzard sticky top-0 left-0 z-10 flex h-20 w-full items-center justify-center border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto w-full max-w-330 flex h-full justify-between items-center">
        <div className="flex items-center bg-red-400">
          <Logo />
          <Button>Catalog</Button>
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;
