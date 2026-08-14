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
          "z-50 min-w-40 overflow-hidden rounded-lg border border-neutral-200 bg-white p-1 text-neutral-700 shadow-lg outline-none",
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
        "flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-neutral-100 data-highlighted:text-neutral-950",
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
        "px-3 py-2 text-xs font-semibold text-neutral-500",
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
      className={cn("my-1 h-px bg-neutral-200", className)}
      {...props}
    />
  );
}
