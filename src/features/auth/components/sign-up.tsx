"use client";

import { useRouter } from "@/i18n/navigation";

import { useSignUp } from "../hooks/use-sign-up";
import type { LoginCredentials } from "../types/auth";
import { SignInForm } from "./forms/sign-in-form";

export function SignUp() {
  const router = useRouter();
  const { mutate, isPending } = useSignUp();

  const signUp = (credentials: LoginCredentials) => {
    mutate(credentials, {
      onSuccess: () => {
        router.push("/onboarding");
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
