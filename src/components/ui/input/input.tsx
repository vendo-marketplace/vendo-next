import { CrossIcon } from "@/assets/icons";
import { cn } from "@/utils/utils";

const inputVariants = {
  size: {
    sm: "p-2",
    base: "",
    lg: "py-3 px-3.5 [&_[data-slot=input-start]]:size-5 [&_[data-slot=input-start]>svg]:size-5 [&_[data-slot=input-control]]:text-[16px] [&_[data-slot=input-control]]:leading-6",
    xl: "py-3.5 px-4 [&_[data-slot=input-start]]:size-5 [&_[data-slot=input-start]>svg]:size-5 [&_[data-slot=input-control]]:text-[16px] [&_[data-slot=input-control]]:leading-6",
  },
} as const;

export type InputSize = keyof typeof inputVariants.size;

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  size?: InputSize;
  start?: React.ReactNode;
  invalid?: boolean;
  onClear?: () => void;
};

export function getInputClassName({
  size = "base",
  invalid,
}: Pick<InputProps, "size" | "invalid"> = {}) {
  return cn(
    "flex group focus-within:border-brand-600 items-center gap-2 border rounded-lg p-2.5 bg-neutral-50 border-neutral-300 shadow-[0px_1px_0.5px_0.05px_#1D293D05]",
    invalid && "border-red-500",
    inputVariants.size[size],
  );
}

export function Input({
  size = "base",
  start,
  invalid,
  disabled,
  className,
  value,
  onClear,
  ...props
}: InputProps) {
  return (
    <div
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={getInputClassName({ size, invalid })}
    >
      {start && (
        <div
          data-slot="input-start"
          className={cn(
            "flex justify-center shrink-0 items-center size-4 text-neutral-400 group-focus-within:text-brand-600",
            invalid && "text-red-700",
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
          "w-full placeholder:text-neutral-400 outline-none text-neutral-950 text-[14px] leading-5",
          invalid && "border-red-500 focus-within:border-red-500",
          className,
        )}
      />

      {value && (
        <button
          aria-label="Clear input"
          type="button"
          onClick={onClear}
          className={cn(
            "size-4 flex justify-center items-center text-neutral-600 group-focus-within:text-brand-600",
            invalid && "text-red-700",
          )}
        >
          <CrossIcon />
        </button>
      )}
    </div>
  );
}
