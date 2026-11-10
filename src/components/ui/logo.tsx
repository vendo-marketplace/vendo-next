import Image from "next/image";
import logo from "@/assets/icons/logo-vendo.svg";

const logoVariants = {
  size: {
    xs: "h-8",
    sm: "h-10",
    md: "h-16",
    lg: "h-22",
  },
} as const;

export type LogoSize = keyof typeof logoVariants.size;

export type LogoProps = {
  size?: LogoSize;
};

export const Logo = ({ size = "md" }: LogoProps) => (
  <Image
    data-size={size}
    src={logo}
    alt="Vendo"
    className={`w-auto ${logoVariants.size[size]}`}
  />
);
