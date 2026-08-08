"use client";

import { useRouter } from "@/i18n/navigation";
import { useLogin } from "../hooks/use-login";
import { LoginCredentials } from "../types/auth";
import { SignInForm } from "./sign-in-form";

export function SignIn() {
  const router = useRouter();
  const { mutate, isPending, isError } = useLogin();
  const signIn = (credentials: LoginCredentials) => {
    mutate(credentials, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <SignInForm
      onSubmit={signIn}
      isPending={isPending}
      submitError={
        isError
          ? "Не вдалося увійти. Перевірте дані та спробуйте ще раз."
          : undefined
      }
    />
  );
}
