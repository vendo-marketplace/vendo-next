import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/utils/utils";

const buttonVariants = {
  variants: {
    brand:
      "bg-brand-600 text-neutral-50 hover:bg-brand-700 focus-visible:bg-brand-700 focus-visible:shadow-[0_0_0_2px_#BEDBFF]",
    secondary:
      "bg-[#FCFCFC] border border-border-base text-neutral-600 hover:bg-brand-50 focus-visible:bg-brand-50 hover:border-brand-400 focus-visible:border-brand-400 focus-visible:shadow-[0_0_0_2px_#EDF6FF] hover:text-brand-400 focus-visible:text-brand-400",
    none: "",
  },
  size: {
    xs: "py-1.5 px-3 text-xs",
    sm: "py-2 px-3 text-sm",
    base: "px-4 py-2.5 text-sm",
    lg: "py-3 px-5 text-md",
    xl: "py-3.5 px-6 text-md",
    none: "",
  },
} as const;

export type ButtonVariant = keyof typeof buttonVariants.variants;
export type ButtonSize = keyof typeof buttonVariants.size;

export type ButtonProps = ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function getButtonClassName({
  variant = "brand",
  size = "base",
  className,
}: Pick<ButtonProps, "variant" | "size" | "className"> = {}) {
  return cn(
    "cursor-pointer w-fit font-mazzard font-medium outline-0 shadow-[0px_1px_0.5px_0.05px_#1D293D05] inline-flex rounded-lg items-center justify-center shrink-0 whitespace-nowrap gap-2 disabled:bg-neutral-100 disabled:border-neutral-100 disabled:cursor-not-allowed",
    buttonVariants.variants[variant],
    buttonVariants.size[size],
    className,
  );
}

export function Button({
  asChild = false,
  variant = "brand",
  size = "base",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={getButtonClassName({ variant, size, className })}
      {...(!asChild && { type })}
      {...props}
    />
  );
}
