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
        "text-neutral-950 font-medium text-[14px] leading-5",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-red-700">
          *
        </span>
      )}
    </label>
  );
}
