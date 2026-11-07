"use client";

import { useRouter } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin } from "../hooks/use-login";
import { authKeys } from "../queries/auth.keys";
import type { LoginCredentials, MeResponse } from "../types/auth";
import { SignInForm } from "./forms/sign-in-form";

export function SignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: login } = useLogin();

  const signIn = async (credentials: LoginCredentials) => {
    await login(credentials);
    const user = queryClient.getQueryData<MeResponse>(authKeys.me());
    router.push(user && !user.emailVerified ? "/onboarding" : "/");
  };

  return (
    <SignInForm
      onSubmit={signIn}
      fallbackErrorMessage="Перевірте дані для входу та спробуйте ще раз."
      showForgotPasswordLink
    />
  );
}
