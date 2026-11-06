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
      type="number"
      min={min}
      max={max}
      step={step}
      size={size}
      value={value}
      disabled={disabled}
      onChange={(event) => onValueChange(event.target.value)}
      clearable={false}
      containerClassName={cn("w-full min-w-0 p-0.5", containerClassName)}
      end={
        <span className="flex flex-col rounded-sm bg-surface-primary-subtle p-0.5">
          <button
            type="button"
            aria-label="Збільшити значення"
            disabled={disabled || (max !== undefined && Number(value) >= Number(max))}
            onClick={() => changeByStep(1)}
            className="grid size-3.5 place-items-center rounded-[2px] text-text-tertiary transition-colors hover:bg-white hover:text-text-primary disabled:opacity-40"
          >
            <ChevronUp aria-hidden="true" className="size-3" />
          </button>
          <button
            type="button"
            aria-label="Зменшити значення"
            disabled={disabled || (min !== undefined && Number(value) <= Number(min))}
            onClick={() => changeByStep(-1)}
            className="grid size-3.5 place-items-center rounded-[2px] text-text-tertiary transition-colors hover:bg-white hover:text-text-primary disabled:opacity-40"
          >
            <ChevronDown aria-hidden="true" className="size-3" />
          </button>
        </span>
      }
      className={cn(
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
    />
  );
}
