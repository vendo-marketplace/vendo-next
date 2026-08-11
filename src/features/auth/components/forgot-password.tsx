"use client";

import { toast } from "sonner";

import { useForgotPassword } from "../hooks/use-forgot-password";
import type { ForgotPasswordCredentials } from "../types/auth";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPassword() {
  const { mutate, isPending } = useForgotPassword();

  const requestPasswordReset = (credentials: ForgotPasswordCredentials) => {
    mutate(credentials, {
      onSuccess: () => {
        toast.success("Посилання для скидання пароля надіслано на вашу пошту");
      },
      onError: (error) => {
        console.log(error);
        toast.error(
          error.response?.data.message ??
            "Не вдалося надіслати посилання. Спробуйте ще раз.",
        );
      },
    });
  };

  return (
    <ForgotPasswordForm isPending={isPending} onSubmit={requestPasswordReset} />
  );
}
