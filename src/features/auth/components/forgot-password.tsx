"use client";

import type { AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import checkEmailGif from "@/assets/gifs/checkEmail.gif";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/i18n/navigation";
import type { ApiError } from "@/types/types";

import { useForgotPassword } from "../hooks/use-forgot-password";

import { useResendPassword } from "../hooks/use-resend-password";
import type { ForgotPasswordCredentials } from "../types/auth";
import { AuthContentHeader } from "./auth-content-header";
import { ForgotPasswordForm } from "./forgot-password-form";

const RESEND_COOLDOWN_SECONDS = 60;

export function ForgotPassword() {
  const { mutate: forgotPassword, isPending: isForgotPasswordPending } =
    useForgotPassword();
  const { mutate: resendPassword, isPending: isResendPending } =
    useResendPassword();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timeout = window.setTimeout(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1_000);

    return () => window.clearTimeout(timeout);
  }, [resendCooldown]);

  const showError = (error: AxiosError<ApiError>) => {
    toast.error(
      error.response?.data.message ??
        "Не вдалося надіслати посилання. Спробуйте ще раз.",
    );
  };

  const requestPasswordReset = (credentials: ForgotPasswordCredentials) => {
    forgotPassword(credentials, {
      onSuccess: () => {
        setSubmittedEmail(credentials.email);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      },
      onError: showError,
    });
  };

  const resendPasswordReset = () => {
    if (!submittedEmail || resendCooldown > 0) return;

    resendPassword(
      { email: submittedEmail },
      {
        onSuccess: () => {
          setResendCooldown(RESEND_COOLDOWN_SECONDS);
          toast.success("Посилання надіслано повторно");
        },
        onError: showError,
      },
    );
  };

  if (submittedEmail) {
    return (
      <div className="space-y-6">
        <div className="relative mx-auto h-34.25 w-40">
          <Image
            src={checkEmailGif}
            alt="Надісланий електронний лист"
            fill
            unoptimized
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
            Перевірте свою пошту!
          </h1>
          <p className="text-[14px] leading-5 text-neutral-400">
            Ми надіслали на адресу{" "}
            <span className="text-brand-800 underline">{submittedEmail}</span>{" "}
            посилання для скидання пароля. Воно буде дійсне недовго, тож
            скористайтеся ним якомога швидше.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/sign-in">Продовжити</Link>
        </Button>

        <p className="text-center text-[14px] text-neutral-400">
          Не отримали лист?{" "}
          <button
            className="font-medium text-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={isResendPending || resendCooldown > 0}
            onClick={resendPasswordReset}
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

  return (
    <>
      <AuthContentHeader
        title="Забули свій пароль?"
        description="Введіть свою електронну пошту, і ми надішлемо вам посилання для скидання пароля."
      />
      <ForgotPasswordForm
        isPending={isForgotPasswordPending}
        onSubmit={requestPasswordReset}
      />
    </>
  );
}
