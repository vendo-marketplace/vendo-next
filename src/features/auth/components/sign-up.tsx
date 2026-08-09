"use client";

import { useSignUp } from "../hooks/use-sign-up";
import type { LoginCredentials } from "../types/auth";
import { SignInForm } from "./sign-in-form";

type SignUpProps = {
  onSuccess: () => void;
};

export function SignUp({ onSuccess }: SignUpProps) {
  const { mutate, isPending, isError } = useSignUp();

  const signUp = (credentials: LoginCredentials) => {
    mutate(credentials, { onSuccess });
  };

  return (
    <SignInForm
      onSubmit={signUp}
      isPending={isPending}
      submitError={
        isError
          ? "Не вдалося створити акаунт. Перевірте дані та спробуйте ще раз."
          : undefined
      }
      submitLabel="Створити акаунт"
      showForgotPassword={false}
      passwordAutoComplete="new-password"
      idPrefix="sign-up"
    />
  );
}
