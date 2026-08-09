"use client";

import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useLogin } from "../hooks/use-login";
import { LoginCredentials } from "../types/auth";
import { SignInForm } from "./sign-in-form";

export function SignIn() {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const signIn = (credentials: LoginCredentials) => {
    mutate(credentials, {
      onSuccess: () => {
        toast.success("Signed in!");
        router.replace("/");
      },
      onError: (e) => {
        toast.error(e.response?.data.message);
      },
    });
  };

  return <SignInForm onSubmit={signIn} isPending={isPending} />;
}
