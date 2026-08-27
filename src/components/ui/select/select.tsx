"use client";

import { AngleDownIcon, AngleRightIcon, TickIcon } from "@/assets/icons";
import type { SelectOption } from "@/types/types";
import { cn } from "@/utils/utils";
import { Select as RadixSelect } from "radix-ui";

type Props<T extends string> = {
  options: readonly SelectOption<T>[];
  value?: T;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: T) => void;
  className?: string;
};

const Select = <T extends string>({
  options,
  value,
  placeholder = "Select an option",
  disabled,
  className,
  onChange,
}: Props<T>) => {
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
        className={`group flex justify-between items-center gap-2 font-medium text-text-secondary text-[14px] leading-5 w-fit px-4 py-1.5 rounded-lg border border-stroke-primary ${className}`}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon
          aria-hidden="true"
          className="transition-transform duration-200 group-data-[state=open]:rotate-180"
        >
          <AngleDownIcon className="size-4" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          align="end"
          sideOffset={4}
          className="min-w-(--radix-select-trigger-width) font-medium"
        >
          <RadixSelect.Viewport className="rounded-lg bg-surface-primary p-2 gap-6 cursor-pointer border border-stroke-primary-subtle text-text-secondary text-[14px] leading-5">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "flex items-center justify-between rounded-lg border-0 gap-2 px-2 py-1.5 outline-none",
                  opt.value === value && "text-text-primary",
                  "hover:bg-surface-brand-subtle hover:font-semibold data-highlighted:bg-surface-brand-subtle data-highlighted:font-semibold",
                )}
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                {opt.value === value && (
                  <RadixSelect.Icon aria-hidden="true">
                    <TickIcon className="size-3.5 text-text-secondary" />
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
