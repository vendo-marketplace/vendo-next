"use client";

import { toast } from "sonner";
import { useSignUp } from "../hooks/use-sign-up";
import type { LoginCredentials } from "../types/auth";
import { SignInForm } from "./sign-in-form";

export function SignUp() {
  const { mutate, isPending } = useSignUp();

  const signUp = (credentials: LoginCredentials) => {
    mutate(credentials, {
      onError: (e) => {
        console.log(e);
        toast.error(e.message);
      },
      onSuccess: () => {
        toast.success("asda");
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
