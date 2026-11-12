"use client";

import { AngleDownIcon, TickIcon } from "@/assets/icons";
import type { SelectOption } from "@/types/types";
import { cn } from "@/utils/utils";
import { Select as RadixSelect } from "radix-ui";

// Shared with triggers that open something else, such as the phone sorting sheet.
export const selectTriggerClassName =
  "group flex h-10 w-fit items-center gap-1.5 rounded-lg border border-stroke-primary-subtle bg-surface-primary px-3 text-sm font-medium text-text-primary shadow-xs transition-colors outline-none hover:not-focus:border-stroke-brand data-[state=open]:border-stroke-primary disabled:cursor-not-allowed disabled:bg-surface-tertiary";

type Props<T extends string> = {
  options: readonly SelectOption<T>[];
  value?: T;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: T) => void;
  className?: string;
  icon?: React.ReactNode;
};

const Select = <T extends string>({
  options,
  value,
  placeholder = "Select an option",
  disabled,
  className,
  icon,
  onChange,
}: Props<T>) => {
  const selected = options.find((option) => option.value === value);

  const handleValueChange = (nextValue: string) => {
    const option = options.find((option) => option.value === nextValue);

    if (option) {
      onChange?.(option.value);
    }
  };

  return (
    <RadixSelect.Root
      value={value}
      disabled={disabled}
      onValueChange={handleValueChange}
    >
      <RadixSelect.Trigger
        className={cn(selectTriggerClassName, className)}
      >
        {icon && (
          <span aria-hidden="true" className="flex shrink-0 text-text-secondary">
            {icon}
          </span>
        )}
        {/* Every label is stacked invisibly in one grid cell, so the trigger keeps the width of
            the longest option and does not jump when the choice changes. */}
        <span className="grid min-w-0 flex-1 text-left">
          {options.map((option) => (
            <span
              key={option.value}
              aria-hidden="true"
              className="invisible col-start-1 row-start-1 truncate"
            >
              {option.shortLabel ? (
                <>
                  <span className="sm:hidden">{option.shortLabel}</span>
                  <span className="hidden sm:inline">{option.label}</span>
                </>
              ) : (
                option.label
              )}
            </span>
          ))}
          <span className="col-start-1 row-start-1 truncate">
            <RadixSelect.Value placeholder={placeholder}>
              {selected?.shortLabel ? (
                <>
                  <span className="sm:hidden">{selected.shortLabel}</span>
                  <span className="hidden sm:inline">{selected.label}</span>
                </>
              ) : (
                selected?.label
              )}
            </RadixSelect.Value>
          </span>
        </span>
        <RadixSelect.Icon
          aria-hidden="true"
          className="ml-1.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
        >
          <AngleDownIcon className="size-4" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          align="end"
          sideOffset={4}
          className="z-[60] min-w-(--radix-select-trigger-width) font-medium"
        >
          <RadixSelect.Viewport className="flex cursor-pointer flex-col gap-0.5 rounded-lg border border-stroke-primary-subtle bg-surface-primary p-1.5 text-sm leading-5 text-text-secondary shadow-md">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md border-0 px-2.5 py-2 outline-none",
                  opt.value === value && "text-text-primary",
                  "hover:bg-surface-brand-subtle hover:font-semibold data-highlighted:bg-surface-brand-subtle data-highlighted:font-semibold",
                )}
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                {opt.value === value && (
                  <RadixSelect.Icon aria-hidden="true">
                    <TickIcon className="size-4 text-text-secondary" />
                  </RadixSelect.Icon>
                )}
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

export default Select;
