import React from "react";

import FooterTopLocations from "./locations/FooterTopLocations";
import { Logo } from "@/components/ui/logo";

const FooterTop = () => {
  return (
    <div className="w-full border-y border-stroke-secondary py-5 md:py-8">
      {/* Logo on the left, cities centred; the right column keeps them centred and is where
          the language switch from the mockup will go. */}
      <div className="page-container flex flex-wrap items-center justify-between gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <Logo size="sm" className="h-7 md:h-10" />
        <FooterTopLocations />
        <div aria-hidden="true" className="hidden sm:block" />
      </div>
    </div>
  );
};

export default FooterTop;
