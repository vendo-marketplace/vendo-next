"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { OtpCodeInput } from "@/components/ui/otp-code-input";
import Image from "next/image";
import img from "@/assets/gifs/emailSent.gif";

const CODE_LENGTH = 6;

type VerifyCodeProps = {
  email: string;
  onSuccess: () => void;
};

export function VerifyCode({ email, onSuccess }: VerifyCodeProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length === CODE_LENGTH) onSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="w-40 h-34.25 relative mx-auto">
        <Image src={img} alt="Image" fill unoptimized />
      </div>

      <div className="space-y-1">
        <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
          Підтвердіть Ваш e-mail
        </h1>
        <p className="text-[14px] leading-5 text-neutral-400">
          Ми відправили код підтвердження на адресу{" "}
          <span className="underline text-brand-800">{email}</span>. Введіть
          його нижче.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-center">
          <OtpCodeInput
            aria-label="Код підтвердження"
            value={code}
            onChange={setCode}
          />
        </div>

        <Button
          className="w-full"
          type="submit"
          disabled={code.length !== CODE_LENGTH}
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
