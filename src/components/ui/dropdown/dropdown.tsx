"use client";

import { DropdownMenu } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/utils/utils";

export function Dropdown(props: ComponentProps<typeof DropdownMenu.Root>) {
  return <DropdownMenu.Root {...props} />;
}

export function DropdownTrigger(
  props: ComponentProps<typeof DropdownMenu.Trigger>,
) {
  return <DropdownMenu.Trigger {...props} />;
}

export function DropdownContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-40 overflow-hidden rounded-lg border border-stroke-secondary bg-surface-primary p-1 text-text-secondary shadow-lg outline-none",
          className,
        )}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export function DropdownItem({
  className,
  ...props
}: ComponentProps<typeof DropdownMenu.Item>) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-surface-tertiary data-highlighted:text-text-primary",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownMenu.Label>) {
  return (
    <DropdownMenu.Label
      className={cn(
        "px-3 py-2 text-xs font-semibold text-text-tertiary",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenu.Separator>) {
  return (
    <DropdownMenu.Separator
      className={cn("my-1 h-px bg-stroke-secondary", className)}
      {...props}
    />
  );
}
