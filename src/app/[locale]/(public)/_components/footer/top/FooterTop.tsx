import React from "react";

import FooterTopLocations from "./locations/FooterTopLocations";
import FooterTopLanguages from "./languages/FooterTopLanguages";
import { Logo } from "@/components/ui/logo";

const FooterTop = () => {
  return (
    <div className="w-full border-t border-b border-stroke-primary-subtle py-8">
      <div className="mx-auto flex w-full max-w-330 flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-0">
        <Logo size="sm" />
        <FooterTopLocations />
        <FooterTopLanguages />
      </div>
    </div>
  );
};

export default FooterTop;
