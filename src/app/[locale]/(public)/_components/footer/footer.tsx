"use client";

import FooterBottom from "./bottom/FooterBottom";
import FooterNavigation from "./nav/FooterNavigation";
import FooterTop from "./top/FooterTop";

const Footer = () => {
  return (
    <footer className="bg-[#FCFCFC]">
      <FooterTop />
      <FooterNavigation />
      <FooterBottom />
    </footer>
  );
};

export default Footer;
