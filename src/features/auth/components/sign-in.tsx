"use client";

import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin } from "../hooks/use-login";
import { authKeys } from "../queries/auth.keys";
import type { LoginCredentials, MeResponse } from "../types/auth";
import { SignInForm } from "./forms/sign-in-form";

export function SignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useLogin();
  const signIn = (credentials: LoginCredentials) => {
    mutate(credentials, {
      onSuccess: () => {
        const user = queryClient.getQueryData<MeResponse>(authKeys.me());
        router.push(user && !user.emailVerified ? "/onboarding" : "/");
      },
      onError: (e) => {
        toast.error(e.response?.data.message ?? "Перевірте дані для входу");
      },
    });
  };

  return (
    <SignInForm
      onSubmit={signIn}
      isPending={isPending}
      showForgotPasswordLink
    />
  );
}
