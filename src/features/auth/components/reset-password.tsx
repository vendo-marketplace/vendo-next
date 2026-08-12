"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import { CheckIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";

import { useResetPassword } from "../hooks/use-reset-password";
import type { ResetPasswordFormValues } from "../schemas/reset-password-schema";
import { AuthContentHeader } from "./auth-content-header";
import { ResetPasswordForm } from "./forms/reset-password-form";

type ResetPasswordProps = {
  code: string;
};

export function ResetPassword({ code }: ResetPasswordProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const submitPassword = ({ password }: ResetPasswordFormValues) => {
    resetPassword(
      { code, password },
      {
        onSuccess: () => setIsSuccess(true),
        onError: (error) => {
          toast.error(
            error.response?.data.message ??
              "Не вдалося змінити пароль. Спробуйте ще раз.",
          );
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-50">
          <div className="flex size-7 items-center justify-center rounded-full bg-brand-600">
            <CheckIcon className="size-3.5" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
            Пароль успішно змінено
          </h1>
          <p className="text-[14px] leading-5 text-neutral-400">
            Ваш новий пароль надійно збережено. Тепер ви можете використовувати
            його для входу в акаунт.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/sign-in">Увійти в акаунт</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AuthContentHeader
        title="Змініть свій пароль"
        description="Ласкаво просимо назад! Виберіть новий надійний пароль і збережіть його, щоб продовжити."
      />
      <ResetPasswordForm isPending={isPending} onSubmit={submitPassword} />
    </div>
  );
}
