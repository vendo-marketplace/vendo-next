"use client";

import type { AxiosError } from "axios";
import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import img from "@/assets/gifs/emailSent.gif";
import { Button } from "@/components/ui/button/button";
import { OtpCodeInput } from "@/components/ui/otp-code-input";
import type { ApiError } from "@/types/types";

import { useResendVerification } from "../hooks/use-resend-verification";
import { useValidateVerification } from "../hooks/use-validate-verification";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

type VerifyCodeProps = {
  email: string;
  onSuccess?: () => void;
};

export function VerifyCode({ email, onSuccess }: VerifyCodeProps) {
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(
    RESEND_COOLDOWN_SECONDS,
  );
  const { mutate: resendVerification, isPending: isResendPending } =
    useResendVerification();
  const { mutate: validateVerification, isPending: isValidationPending } =
    useValidateVerification();

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timeout = window.setTimeout(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1_000);

    return () => window.clearTimeout(timeout);
  }, [resendCooldown]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== CODE_LENGTH) return;

    validateVerification(code, {
      onSuccess: () => onSuccess?.(),
      onError: (error: AxiosError<ApiError>) => {
        toast.error(
          error.response?.data.message ??
            "Не вдалося підтвердити код. Перевірте його та спробуйте ще раз.",
        );
      },
    });
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;

    resendVerification(email, {
      onSuccess: () => {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        toast.success("Код підтвердження надіслано повторно");
      },
      onError: (error: AxiosError<ApiError>) => {
        toast.error(
          error.response?.data.message ??
            "Не вдалося надіслати код. Спробуйте ще раз.",
        );
      },
    });
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
          disabled={code.length !== CODE_LENGTH || isValidationPending}
        >
          {isValidationPending ? "Підтвердження..." : "Підтвердити"}
        </Button>
      </form>

      <p className="text-center text-[14px] text-neutral-400">
        Не отримали лист?{" "}
        <button
          className="font-medium text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isResendPending || resendCooldown > 0}
          onClick={handleResend}
        >
          {isResendPending
            ? "Надсилання..."
            : resendCooldown > 0
              ? `Надіслати ще раз (${resendCooldown} с)`
              : "Надіслати ще раз"}
        </button>
      </p>
    </div>
  );
}
