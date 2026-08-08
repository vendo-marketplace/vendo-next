import { CrossIcon } from "@/assets/icons";
import { cn } from "@/utils/utils";

type InputSize = "sm" | "base" | "lg" | "xl";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: InputSize;
  start?: React.ReactNode;
  invalid?: boolean;
  onClear?: () => void;
};

export function Input({
  size = "base",
  start,
  invalid,
  disabled,
  className,
  onClear,
  ...props
}: InputProps) {
  return (
    <div
      data-size={size}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className="flex group focus-within:border-brand-600 items-center gap-2 border rounded-lg p-2 bg-neutral-50 border-neutral-300 shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
    >
      {start && (
        <div className="flex justify-center items-center size-4 text-neutral-400 group-focus-within:text-brand-600">
          {start}
        </div>
      )}
      <input
        {...props}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full placeholder:text-neutral-400 outline-none text-neutral-950 text-[16px] leading-6",
          className,
        )}
      />

      <button
        aria-label="Clear input"
        onClick={onClear}
        className="size-4 flex justify-center items-center text-neutral-600 group-focus-within:text-brand-600"
      >
        <CrossIcon />
      </button>
    </div>
  );
}
