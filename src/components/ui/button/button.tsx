import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/utils/utils";

const buttonVariants = {
  variants: {
    brand:
      "bg-surface-brand text-text-invert hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:shadow-[0_0_0_2px_var(--color-stroke-brand-subtle)]",
    secondary:
      "bg-surface-secondary border border-stroke-primary-subtle text-text-secondary hover:bg-surface-brand-subtle focus-visible:bg-surface-brand-subtle hover:border-stroke-brand-light focus-visible:border-stroke-brand-light focus-visible:shadow-[0_0_0_2px_var(--color-surface-brand-subtle)] hover:text-text-brand-light focus-visible:text-text-brand-light",
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
    "cursor-pointer w-fit font-mazzard font-medium outline-0 shadow-[0px_1px_0.5px_0.05px_#1D293D05] inline-flex rounded-lg items-center justify-center shrink-0 whitespace-nowrap gap-2 disabled:bg-surface-tertiary disabled:border-stroke-secondary disabled:cursor-not-allowed",
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
