import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils/utils";

const badgeVariants = {
  size: {
    sm: "gap-1 px-1.5 py-0.5",
    lg: "gap-1.5 px-2 py-1",
  },
  iconSize: {
    sm: "size-3",
    lg: "size-3.5",
  },
  theme: {
    gray: "border-border-base bg-[#F3F4F6] text-neutral-950",
    white: "border-border-base bg-neutral-50 text-neutral-950",
    brand: "border-brand-200 bg-brand-50 text-brand-600",
    danger: "border-red-200 bg-red-50 text-red-700",
    warning: "border-orange-200 bg-orange-50 text-orange-700",
    success: "border-[#B9F8CF] bg-[#F0FDF4] text-[#008236]",
  },
} as const;

export type BadgeSize = keyof typeof badgeVariants.size;
export type BadgeTheme = keyof typeof badgeVariants.theme;

export type BadgeProps = ComponentProps<"span"> & {
  leading?: ReactNode;
  size?: BadgeSize;
  theme?: BadgeTheme;
};

export function getBadgeClassName({
  size = "sm",
  theme = "gray",
  className,
}: Pick<BadgeProps, "size" | "theme" | "className"> = {}) {
  return cn(
    "inline-flex w-fit items-center whitespace-nowrap rounded-[6px] border text-[12px] font-medium leading-4.5",
    badgeVariants.size[size],
    badgeVariants.theme[theme],
    className,
  );
}

export function Badge({
  children,
  leading,
  size = "sm",
  theme = "gray",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-size={size}
      data-theme={theme}
      className={getBadgeClassName({ size, theme, className })}
      {...props}
    >
      {leading && (
        <span
          aria-hidden="true"
          data-slot="badge-leading"
          className={cn(
            "flex shrink-0 items-center justify-center [&>svg]:size-full",
            badgeVariants.iconSize[size],
          )}
        >
          {leading}
        </span>
      )}
      {children}
    </span>
  );
}
