"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import checkEmailGif from "@/assets/gifs/checkEmail.gif";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/i18n/navigation";
import { getApiErrorMessage } from "@/utils/api-error";

import { useForgotPassword } from "../hooks/use-forgot-password";

import { useResendPassword } from "../hooks/use-resend-password";
import type { ForgotPasswordCredentials } from "../types/auth";
import { AuthContentHeader } from "./auth-content-header";
import { ForgotPasswordForm } from "./forms/forgot-password-form";

const RESEND_COOLDOWN_SECONDS = 60;

export function ForgotPassword() {
  const { mutateAsync: forgotPassword } = useForgotPassword();
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

  const requestPasswordReset = async (
    credentials: ForgotPasswordCredentials,
  ) => {
    await forgotPassword(credentials);
    setSubmittedEmail(credentials.email);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
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
        onError: (error) => {
          toast.error(
            getApiErrorMessage(
              error,
              "Не вдалося надіслати посилання. Спробуйте ще раз.",
            ),
          );
        },
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
            sizes="160px"
            className="object-contain"
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-display-xs font-semibold text-text-primary sm:text-display-sm">
            Перевірте свою пошту!
          </h1>
          <p className="text-md text-text-secondary">
            Ми надіслали на адресу{" "}
            <span className="text-text-brand-dark underline">{submittedEmail}</span>{" "}
            посилання для скидання пароля. Воно буде дійсне недовго, тож
            скористайтеся ним якомога швидше.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/sign-in">Продовжити</Link>
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Не отримали лист?{" "}
          <button
            className="font-medium text-text-brand hover:text-text-hover disabled:cursor-not-allowed disabled:opacity-50"
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
      <ForgotPasswordForm onSubmit={requestPasswordReset} />
    </>
  );
}
