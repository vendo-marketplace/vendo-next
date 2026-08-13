"use client";

import { AngleDownIcon, AngleRightIcon } from "@/assets/icons";
import type { SelectOption } from "@/types/types";
import { cn } from "@/utils/utils";
import { Select as RadixSelect } from "radix-ui";

type Props<T extends string> = {
  options: readonly SelectOption<T>[];
  value?: T;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: T) => void;
};

const Select = <T extends string>({
  options,
  value,
  placeholder = "Select an option",
  disabled,
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
      <RadixSelect.Trigger className="flex justify-between items-center font-medium text-neutral-600 text-[14px] leading-5  w-52 px-4 py-1.5 rounded-lg border border-neutral-300">
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon aria-hidden="true">
          <AngleDownIcon className="size-4" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="w-52 font-medium"
        >
          <RadixSelect.Viewport className="rounded-lg bg-neutral-50 p-2 gap-6 cursor-pointer border border-border-base text-neutral-600 text-[14px] leading-5">
            {options.map((opt) => (
              <RadixSelect.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  "flex items-center justify-between rounded-lg border-0 px-2 py-1.5 outline-none",
                  opt.value === value && "text-neutral-950",
                  "hover:bg-brand-50 hover:font-semibold data-highlighted:bg-brand-50 data-highlighted:font-semibold",
                )}
              >
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                {opt.value === value && (
                  <RadixSelect.Icon aria-hidden="true">
                    <AngleRightIcon className="size-3.5 text-neutral-600" />
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
