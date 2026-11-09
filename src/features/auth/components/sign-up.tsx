"use client";

import { useRouter } from "@/i18n/navigation";

import { useSignUp } from "../hooks/use-sign-up";
import type { LoginCredentials } from "../types/auth";
import { SignInForm } from "./forms/sign-in-form";

export function SignUp() {
  const router = useRouter();
  const { mutateAsync: createAccount } = useSignUp();

  const signUp = async (credentials: LoginCredentials) => {
    await createAccount(credentials);
    window.sessionStorage.setItem(
      "pending-verification-email",
      credentials.email,
    );
    router.push("/onboarding");
  };

  return (
    <SignInForm
      onSubmit={signUp}
      fallbackErrorMessage="Не вдалося створити акаунт. Перевірте введені дані та спробуйте ще раз."
      submitLabel="Створити акаунт"
      passwordAutoComplete="new-password"
      idPrefix="sign-up"
    />
  );
}
