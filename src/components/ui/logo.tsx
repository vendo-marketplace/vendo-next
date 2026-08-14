import Image from "next/image";
import logo from "@/assets/icons/logo.svg";

const logoVariants = {
  size: {
    xs: {
      icon: 24,
      wrapper: "gap-2",
      label: "text-[18px] leading-7",
    },
    sm: {
      icon: 30,
      wrapper: "gap-3",
      label: "text-[24px] leading-6",
    },
    md: {
      icon: 48,
      wrapper: "gap-4",
      label: "text-[36px] leading-9",
    },
    lg: {
      icon: 64,
      wrapper: "gap-4",
      label: "text-[60px] leading-10",
    },
  },
} as const;

export type LogoSize = keyof typeof logoVariants.size;

export type LogoProps = {
  size?: LogoSize;
};

export const Logo = ({ size = "md" }: LogoProps) => {
  const variant = logoVariants.size[size];

  return (
    <div data-size={size} className={`flex items-center ${variant.wrapper}`}>
      <Image
        src={logo}
        alt="Vendo logo"
        width={variant.icon}
        className="h-auto"
      />

      <span className={`text-brand-800 font-medium uppercase ${variant.label}`}>
        Vendo
      </span>
    </div>
  );
};
