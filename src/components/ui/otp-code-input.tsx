"use client";

import type { ComponentProps } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/utils/utils";

type OtpCodeInputProps = Omit<
  ComponentProps<typeof InputOTP>,
  "children" | "maxLength" | "pattern" | "render"
> & {
  length?: number;
};

export function OtpCodeInput({
  length = 6,
  containerClassName,
  ...props
}: OtpCodeInputProps) {
  return (
    <InputOTP
      maxLength={length}
      pattern={REGEXP_ONLY_DIGITS}
      containerClassName={cn(containerClassName)}
      {...props}
    >
      <InputOTPGroup className="gap-3">
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="w-16 h-13 py-3.5 px-4 font-normal ring-0! text-neutral-950 text-[16px] leading-6 rounded-lg border bg-neutral-50 border-neutral-300 data-[active=true]:border-brand-600"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
