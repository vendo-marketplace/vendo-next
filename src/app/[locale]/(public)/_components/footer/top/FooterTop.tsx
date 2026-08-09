import React from "react";

import FooterTopLocations from "./locations/FooterTopLocations";
import FooterTopLanguages from "./languages/FooterTopLanguages";
import { Logo } from "@/components/ui/logo";

const FooterTop = () => {
  return (
    <div className="w-full border-t border-b border-[#F3F4F6] py-8">
      <div className="mx-auto flex w-7xl justify-between">
        <Logo size="sm" />
        <FooterTopLocations />
        <FooterTopLanguages />
      </div>
    </div>
  );
};

export default FooterTop;
