"use client";

import { Dialog } from "radix-ui";
import { useState, type ReactNode } from "react";

import { AngleDownIcon } from "@/assets/icons";
import { CrossIcon } from "@/assets/icons/CrossIcon";
import { SheetHandle, useSheetDrag } from "@/components/ui/bottom-sheet/bottom-sheet";
import { selectTriggerClassName } from "@/components/ui/select/select";
import type { SelectOption } from "@/types/types";
import { cn } from "@/utils/utils";

// Phones: sorting opens as a sheet from the bottom, like the filters, with large rows under the
// thumb. Picking an option applies it and closes the sheet.
export function ProductSortSheet<T extends string>({
  options,
  value,
  onChange,
  icon,
  className,
}: {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  icon?: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const drag = useSheetDrag(() => setOpen(false));
  const selected = options.find((option) => option.value === value);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(selectTriggerClassName, className)}
        data-state={open ? "open" : "closed"}
      >
        {icon && (
          <span aria-hidden="true" className="flex shrink-0 text-text-secondary">
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-left">
          <span className="sr-only">Сортування: </span>
          {selected?.shortLabel ?? selected?.label}
        </span>
        <AngleDownIcon aria-hidden="true" className="ml-1.5 size-4 shrink-0" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          style={drag.style}
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-lg bg-surface-primary pb-[max(1rem,env(safe-area-inset-bottom))] shadow-xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom motion-reduce:animate-none"
        >
          <SheetHandle {...drag.handlers} />
          <div
            {...drag.handlers}
            className="relative flex shrink-0 touch-none items-center justify-center border-b border-stroke-secondary px-14 pt-1 pb-2"
          >
            <Dialog.Title className="font-heading text-xl leading-11 font-semibold text-text-primary">
              Сортування
            </Dialog.Title>
            <Dialog.Close
              aria-label="Закрити сортування"
              className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:shadow-focus-brand focus-visible:outline-none"
            >
              <CrossIcon size={20} />
            </Dialog.Close>
          </div>

          <div role="radiogroup" aria-label="Сортування" className="flex flex-col py-2">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex min-h-14 items-center justify-between gap-4 px-4 text-left text-md text-text-primary transition-colors focus-visible:bg-surface-secondary focus-visible:outline-none",
                    isSelected ? "bg-surface-brand-subtle" : "hover:bg-surface-secondary",
                  )}
                >
                  {option.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-surface-primary",
                      isSelected ? "border-stroke-brand" : "border-stroke-primary-subtle",
                    )}
                  >
                    {isSelected && <span className="size-2.5 rounded-full bg-surface-brand" />}
                  </span>
                </button>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
