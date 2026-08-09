"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

import { Input, type InputProps } from "./input";

export type PasswordInputProps = Omit<InputProps, "end" | "type"> & {
  hidePasswordLabel?: string;
  showPasswordLabel?: string;
};

export function PasswordInput({
  disabled,
  hidePasswordLabel = "Hide password",
  showPasswordLabel = "Show password",
  ...props
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleLabel = isPasswordVisible
    ? hidePasswordLabel
    : showPasswordLabel;

  return (
    <Input
      {...props}
      type={isPasswordVisible ? "text" : "password"}
      disabled={disabled}
      end={
        <button
          type="button"
          aria-label={toggleLabel}
          aria-pressed={isPasswordVisible}
          disabled={disabled}
          onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
          className="flex size-5 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPasswordVisible ? (
            <EyeOffIcon className="size-full" aria-hidden="true" />
          ) : (
            <EyeIcon className="size-full" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
}
