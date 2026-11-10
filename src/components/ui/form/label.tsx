import type { ComponentProps } from "react";

import { cn } from "@/utils/utils";

export type LabelProps = ComponentProps<"label"> & {
  required?: boolean;
};

export function Label({ children, className, required, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-semibold text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-xs font-semibold text-text-error">
          *
        </span>
      )}
    </label>
  );
}
