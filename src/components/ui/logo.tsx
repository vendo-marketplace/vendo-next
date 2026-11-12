import Image from "next/image";
import logo from "@/assets/icons/logo-vendo.svg";
import { cn } from "@/utils/utils";

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
  className?: string;
};

export const Logo = ({ size = "md", className }: LogoProps) => (
  <Image
    data-size={size}
    src={logo}
    alt="Vendo"
    className={cn("w-auto", logoVariants.size[size], className)}
  />
);
