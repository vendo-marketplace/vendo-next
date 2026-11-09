import { ChevronDown, ChevronUp } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input/input";
import { cn } from "@/utils/utils";

type NumberInputProps = Omit<
  InputProps,
  "type" | "value" | "onChange" | "step" | "min" | "max" | "end"
> & {
  value: string;
  onValueChange: (value: string) => void;
  min?: number | string;
  max?: number | string;
  step?: number | string;
};

const formatStepValue = (value: number, step: number) => {
  const precision = step.toString().split(".")[1]?.length ?? 0;
  return value.toFixed(Math.min(precision, 10));
};

export default function NumberInput({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  size = "sm",
  containerClassName,
  className,
  disabled,
  ...props
}: NumberInputProps) {
  const stepValue = step === "any" ? 1 : Number(step);
  const safeStep = Number.isFinite(stepValue) && stepValue > 0 ? stepValue : 1;

  const changeByStep = (direction: -1 | 1) => {
    const current = Number(value);
    const start = Number.isFinite(current) ? current : 0;
    let next = start + safeStep * direction;

    if (min !== undefined) next = Math.max(next, Number(min));
    if (max !== undefined) next = Math.min(next, Number(max));

    onValueChange(formatStepValue(next, safeStep));
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      role="spinbutton"
      aria-valuenow={value ? Number(value) : undefined}
      aria-valuemin={min === undefined ? undefined : Number(min)}
      aria-valuemax={max === undefined ? undefined : Number(max)}
      size={size}
      value={value}
      disabled={disabled}
      onChange={(event) => onValueChange(event.target.value)}
      clearable={false}
      containerClassName={cn(
        "w-full min-w-0 px-0 py-0 [&_[data-slot=input-end]]:h-full [&_[data-slot=input-end]]:items-stretch",
        containerClassName,
      )}
      end={
        <span className="flex h-full w-9 flex-col rounded-r-lg bg-surface-primary-subtle">
          <button
            type="button"
            aria-label="Збільшити значення"
            disabled={disabled || (max !== undefined && Number(value) >= Number(max))}
            onClick={() => changeByStep(1)}
            className="grid w-full flex-1 place-items-center rounded-tr-lg text-text-tertiary transition-colors hover:bg-brand-100 hover:text-text-brand focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stroke-brand active:bg-brand-200 disabled:opacity-40"
          >
            <ChevronUp aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Зменшити значення"
            disabled={disabled || (min !== undefined && Number(value) <= Number(min))}
            onClick={() => changeByStep(-1)}
            className="grid w-full flex-1 place-items-center rounded-br-lg text-text-tertiary transition-colors hover:bg-brand-100 hover:text-text-brand focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stroke-brand active:bg-brand-200 disabled:opacity-40"
          >
            <ChevronDown aria-hidden="true" className="size-4" />
          </button>
        </span>
      }
      className={cn("px-3", className)}
    />
  );
}
