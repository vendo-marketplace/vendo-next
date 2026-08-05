import type { ComponentProps } from "react";
import { Slot } from "radix-ui";

import { cn } from "@/utils/utils";

const buttonVariants = {
  variants: {
    default: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-600",
    secondary:
      "border border-neutral-300 text-neutral-600 focus:ring-neutral-600",
    ghost: "text-neutral-500 hover:bg-neutral-100 focus:ring-neutral-700",
  },
  size: {
    default: "h-12 px-4 py-1 text-sm",
    small: "h-10 px-4 py-3 text-xs",
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
    "cursor-pointer font-mazzard inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
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
