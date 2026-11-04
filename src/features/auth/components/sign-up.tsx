"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

import { useSignUp } from "../hooks/use-sign-up";
import type { LoginCredentials } from "../types/auth";
import { SignInForm } from "./forms/sign-in-form";

export function SignUp() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>();
  const { mutate, isPending } = useSignUp();

  const signUp = (credentials: LoginCredentials) => {
    setSubmitError(undefined);
    mutate(credentials, {
      onSuccess: () => {
        window.sessionStorage.setItem(
          "pending-verification-email",
          credentials.email,
        );
        router.push("/onboarding");
      },
      onError: (error) => {
        setSubmitError(
          error.response?.data.message ??
            "Не вдалося створити акаунт. Перевірте введені дані та спробуйте ще раз.",
        );
      },
    });
  };

  return (
    <SignInForm
      onSubmit={signUp}
      isPending={isPending}
      submitError={submitError}
      submitLabel="Створити акаунт"
      passwordAutoComplete="new-password"
      idPrefix="sign-up"
    />
  );
}
