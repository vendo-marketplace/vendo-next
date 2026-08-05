import React from "react";
import FooterTopLogo from "./logo/FooterTopLogo";
import FooterTopLocations from "./locations/FooterTopLocations";
import FooterTopLanguages from "./languages/FooterTopLanguages";

const FooterTop = () => {
  return (
    <div className="w-full border-t border-b border-[#F3F4F6] py-8">
      <div className="mx-auto flex w-7xl justify-between">
        <FooterTopLogo />
        <FooterTopLocations />
        <FooterTopLanguages />
      </div>
    </div>
  );
};

export default FooterTop;
