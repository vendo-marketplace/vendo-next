import logo from "@/assets/icons/logo.svg";
import Image from "next/image";

const FooterTopLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <Image src={logo} alt="Logo" width={30} height={30} />

      <span className="text-brand-800 text-[24px] leading-6 font-medium uppercase">
        Vendo
      </span>
    </div>
  );
};

export default FooterTopLogo;
