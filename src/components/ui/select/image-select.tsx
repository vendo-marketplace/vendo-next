"use client";

import Image from "next/image";
import { Select } from "radix-ui";
import angleDownIcon from "@/assets/icons/angle-down.svg";
import type { SelectOption } from "@/types/types";

export type ImageSelectOption<T extends string> = SelectOption<T> & {
  image: string;
};

type Props<T extends string> = {
  options: readonly ImageSelectOption<T>[];
  value?: T;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: T) => void;
};

const ImageSelect = <T extends string>({
  options,
  value,
  placeholder = "Select an option",
  disabled,
  onChange,
}: Props<T>) => {
  const selectedOption = options.find((option) => option.value === value);

  const handleValueChange = (nextValue: string) => {
    const option = options.find((option) => option.value === nextValue);

    if (option) {
      onChange?.(option.value);
    }
  };

  return (
    <Select.Root
      value={value}
      disabled={disabled}
      onValueChange={handleValueChange}
    >
      <Select.Trigger className="flex cursor-pointer items-center gap-2 border-none text-neutral-600">
        <Select.Value placeholder={placeholder}>
          {selectedOption && (
            <div className="flex items-center gap-2 h-5 ">
              <div className="flex size-5 items-center justify-center">
                <Image
                  src={selectedOption.image}
                  width={16}
                  height={16}
                  alt={selectedOption.label}
                />
              </div>
              <span className="text-[14px] h-full leading-5">
                {selectedOption.label}
              </span>
            </div>
          )}
        </Select.Value>
        <Select.Icon aria-hidden="true">
          <Image
            src={angleDownIcon}
            alt="Angle down icon"
            width={16}
            height={16}
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position="popper" sideOffset={4} className="min-w-36">
          <Select.Viewport className="space-y-1 rounded-md border border-neutral-400">
            {options.map(({ image, label, value }) => (
              <Select.Item
                key={value}
                value={value}
                className="flex cursor-pointer items-center gap-2 border-none outline-none focus:bg-neutral-400"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center">
                    <Image src={image} width={16} height={16} alt={label} />
                  </div>
                  <span>{label}</span>
                </div>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default ImageSelect;
