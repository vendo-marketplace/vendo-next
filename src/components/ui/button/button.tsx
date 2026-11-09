import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/utils/utils";

const buttonVariants = {
  variants: {
    brand:
      "bg-surface-brand text-text-invert shadow-xs hover:bg-surface-brand-hover focus-visible:bg-surface-brand-hover focus-visible:shadow-focus-brand",
    secondary:
      "bg-surface-brand-subtle border border-surface-brand-subtle text-text-brand shadow-sm hover:border-stroke-brand focus-visible:border-stroke-brand",
    outline:
      "bg-surface-primary border border-stroke-primary-subtle text-text-primary hover:bg-surface-secondary focus-visible:border-stroke-brand focus-visible:text-text-brand focus-visible:shadow-focus-secondary",
    success:
      "bg-surface-success text-text-invert shadow-xs hover:bg-surface-success-hover focus-visible:bg-surface-success-hover focus-visible:border focus-visible:border-stroke-success-subtle",
    "success-outline":
      "border border-stroke-success text-text-success shadow-xs hover:bg-surface-success-hover hover:border-surface-success-hover hover:text-text-invert focus-visible:bg-surface-success-hover focus-visible:text-text-invert focus-visible:border-stroke-success-subtle",
    error:
      "bg-surface-error text-text-invert shadow-xs hover:bg-surface-error-hover focus-visible:bg-surface-error-hover focus-visible:border focus-visible:border-stroke-error-subtle",
    "error-outline":
      "border border-stroke-error text-text-error shadow-xs hover:bg-surface-error-hover hover:border-surface-error-hover hover:text-text-invert focus-visible:bg-surface-error-hover focus-visible:text-text-invert focus-visible:border-stroke-error-subtle",
    warning:
      "bg-surface-warning text-text-invert shadow-xs hover:bg-surface-warning-hover focus-visible:bg-surface-warning-hover focus-visible:border focus-visible:border-stroke-warning-subtle",
    "warning-outline":
      "border border-stroke-warning text-text-warning shadow-xs hover:bg-surface-warning-hover hover:border-surface-warning-hover hover:text-text-invert focus-visible:bg-surface-warning-hover focus-visible:text-text-invert focus-visible:border-stroke-warning-subtle",
    text: "px-2 shadow-none disabled:bg-transparent disabled:shadow-none text-text-secondary hover:text-text-brand focus-visible:text-text-brand",
    "text-secondary":
      "px-2 shadow-none disabled:bg-transparent disabled:shadow-none text-text-secondary hover:text-text-primary focus-visible:text-text-primary",
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
    "cursor-pointer w-fit font-medium outline-0 inline-flex rounded-lg items-center justify-center shrink-0 whitespace-nowrap gap-2 transition-colors disabled:bg-surface-tertiary disabled:border-stroke-secondary disabled:text-text-tertiary disabled:shadow-xs disabled:cursor-not-allowed",
    buttonVariants.size[size],
    buttonVariants.variants[variant],
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
