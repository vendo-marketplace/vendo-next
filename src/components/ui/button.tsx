import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/utils/utils";

const buttonVariants = {
  variants: {
    default: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600",
    secondary:
      "border border-border-base text-neutral-600 hover:text-brand-600 hover:border-brand-600",
    ghost: "text-neutral-500 hover:bg-neutral-100 focus:ring-neutral-700",
    icon: "bg-white hover:text-brand-600 text-neutral-600",
    none: "",
  },
  size: {
    xs: "py-1.5 px-3 text-xs",
    sm: "py-2 px-3 text-sm",
    default: "px-4 py-2.5 text-sm",
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
  variant = "default",
  size = "default",
  className,
}: Pick<ButtonProps, "variant" | "size" | "className"> = {}) {
  return cn(
    "cursor-pointer font-mazzard inline-flex items-center justify-center shrink-0 whitespace-nowrap font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    buttonVariants.variants[variant],
    buttonVariants.size[size],
    className,
  );
}

export function Button({
  asChild = false,
  variant = "default",
  size = "default",
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
