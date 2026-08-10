"use client";

import {
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button/button";
import { cn } from "@/utils/utils";
import Image from "next/image";
import img from "@/assets/auth/message-sent.png";

const CODE_LENGTH = 6;

type VerifyCodeProps = {
  email: string;
  onSuccess: () => void;
};

export function VerifyCode({ email, onSuccess }: VerifyCodeProps) {
  const [code, setCode] = useState(() => Array<string>(CODE_LENGTH).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setCode((current) =>
      current.map((currentDigit, digitIndex) =>
        digitIndex === index ? digit : currentDigit,
      ),
    );

    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH)
      .split("");

    if (!digits.length) return;

    event.preventDefault();
    setCode(
      Array.from({ length: CODE_LENGTH }, (_, index) => digits[index] ?? ""),
    );
    inputsRef.current[Math.min(digits.length, CODE_LENGTH) - 1]?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.every(Boolean)) onSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="w-40 h-34.25 relative mx-auto">
        <Image src={img} alt="Image" fill />
      </div>

      <div className="space-y-1">
        <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
          Підтвердіть Ваш e-mail
        </h1>
        <p className="text-[14px] leading-5 text-neutral-400">
          Ми відправили код підтвердження на адресу {email}. Введіть його нижче.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-3" role="group" aria-label="Код підтвердження">
          {code.map((digit, index) => (
            <input
              // The position is stable and is the identity of an OTP field.
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              value={digit}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Цифра ${index + 1}`}
              maxLength={1}
              className={cn(
                "h-12 min-w-0 flex-1 rounded-lg border border-neutral-300 bg-neutral-50 text-center text-[18px] font-medium text-neutral-950 outline-none",
                "focus:border-brand-600 focus:shadow-[0_0_0_2px_#BEDBFF]",
              )}
            />
          ))}
        </div>

        <Button
          className="w-full"
          type="submit"
          disabled={!code.every(Boolean)}
        >
          Підтвердити
        </Button>
      </form>

      <p className="text-center text-[14px] text-neutral-400">
        Не отримали лист?{" "}
        <button
          className="font-medium text-brand-600 hover:text-brand-700"
          type="button"
        >
          Надіслати ще раз
        </button>
      </p>
    </div>
  );
}
