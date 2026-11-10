import { CrossIcon } from "@/assets/icons";
import { cn } from "@/utils/utils";

const inputVariants = {
  size: {
    sm: "h-9 p-2",
    base: "h-10 p-2.5",
    lg: "h-12 py-3 px-3.5 [&_[data-slot=input-start]]:size-5 [&_[data-slot=input-start]>svg]:size-5 [&_[data-slot=input-control]]:text-md",
    xl: "h-13 py-3.5 px-4 [&_[data-slot=input-start]]:size-5 [&_[data-slot=input-start]>svg]:size-5 [&_[data-slot=input-control]]:text-md",
  },
} as const;

export type InputSize = keyof typeof inputVariants.size;

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  size?: InputSize;
  start?: React.ReactNode;
  end?: React.ReactNode;
  invalid?: boolean;
  containerClassName?: string;
  onClear?: () => void;
  clearable?: boolean;
};

export function getInputClassName({
  size = "base",
  invalid,
}: Pick<InputProps, "size" | "invalid"> = {}) {
  return cn(
    "flex group items-center gap-2 border rounded-lg bg-surface-primary border-stroke-primary-subtle shadow-xs transition-colors focus-within:border-stroke-brand focus-within:shadow-focus-input has-disabled:bg-surface-tertiary",
    invalid && "border-stroke-error focus-within:border-stroke-error focus-within:shadow-xs",
    inputVariants.size[size],
  );
}

export function Input({
  size = "base",
  start,
  end,
  invalid,
  containerClassName,
  disabled,
  className,
  clearable = true,
  value,
  onClear,
  ...props
}: InputProps) {
  return (
    <div
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(getInputClassName({ size, invalid }), containerClassName)}
    >
      {start && (
        <div
          data-slot="input-start"
          className={cn(
            "flex justify-center shrink-0 items-center size-4 text-text-tertiary",
            !invalid && "group-focus-within:text-text-brand",
          )}
        >
          {start}
        </div>
      )}
      <input
        data-slot="input-control"
        {...props}
        value={value}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full placeholder:font-normal placeholder:text-text-placeholder outline-none font-medium text-text-primary text-sm disabled:font-normal disabled:text-text-tertiary disabled:cursor-not-allowed",
          className,
        )}
      />

      {clearable && value && (
        <button
          aria-label="Очистити поле"
          type="button"
          tabIndex={-1}
          onClick={onClear}
          className="size-4 flex justify-center items-center text-text-secondary hover:text-text-primary"
        >
          <CrossIcon />
        </button>
      )}

      {end && (
        <div
          data-slot="input-end"
          className={cn(
            "flex shrink-0 items-center justify-center text-text-secondary",
            !invalid && "group-focus-within:text-text-brand",
          )}
        >
          {end}
        </div>
      )}
    </div>
  );
}
