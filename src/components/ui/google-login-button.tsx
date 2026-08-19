"use client";

import { useGoogleLogin as useGoogleOAuthLogin } from "@react-oauth/google";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

import { useGoogleLogin } from "@/features/auth/hooks/use-google-login";
import { GoogleIcon } from "./icons";
import { Button } from "./button/button";

type GoogleLoginButtonProps = {
  label: string;
};

export function GoogleLoginButton({ label }: GoogleLoginButtonProps) {
  const router = useRouter();
  const { mutate: loginWithGoogle, isPending } = useGoogleLogin();

  const requestGoogleAuthCode = useGoogleOAuthLogin({
    flow: "auth-code",
    onSuccess: ({ code }) => {
      loginWithGoogle(
        { authCode: code },
        {
          onSuccess: () => router.push("/"),
          onError: (error) => {
            toast.error(error.response?.data.message ?? "Google login failed");
          },
        },
      );
    },
    onError: () => {
      toast.error("Google login failed");
    },
    onNonOAuthError: () => {
      toast.error("Google login was cancelled or could not be opened");
    },
  });

  return (
    <Button
      variant="secondary"
      className="w-full text-[14px] leading-5"
      disabled={isPending}
      onClick={() => requestGoogleAuthCode()}
    >
      <GoogleIcon className="size-4" />
      <span>{label}</span>
    </Button>
  );
}
