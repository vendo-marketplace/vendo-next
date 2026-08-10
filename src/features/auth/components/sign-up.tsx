"use client";

import { useSignUp } from "../hooks/use-sign-up";
import type { LoginCredentials } from "../types/auth";
import { SignInForm } from "./sign-in-form";

export function SignUp({
  onSuccess,
}: {
  onSuccess?: (email: string) => void;
}) {
  const { mutate, isPending } = useSignUp();

  const signUp = (credentials: LoginCredentials) => {
    mutate(credentials, {
      onSuccess: () => {
        onSuccess?.(credentials.email);
      },
    });
  };

  return (
    <SignInForm
      onSubmit={signUp}
      isPending={isPending}
      submitLabel="Створити акаунт"
      passwordAutoComplete="new-password"
      idPrefix="sign-up"
    />
  );
}
