"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import { Link } from "@/i18n/navigation";

import { TickIcon } from "@/assets/icons";
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
      <div className="space-y-6 text-center w-120 mx-auto my-auto">
        <div className="flex justify-center mx-auto items-center size-14 bg-brand-50 rounded-full text-brand-600">
          <TickIcon className="size-8" aria-hidden="true" />
        </div>

        <AuthContentHeader
          className="text-center"
          title="Пароль успішно змінено"
          description="Ваш новий пароль надійно збережено. Тепер ви можете використовувати
            його для входу в акаунт."
        />

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
