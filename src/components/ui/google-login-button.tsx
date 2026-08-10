"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

import { useGoogleLogin } from "@/features/auth/hooks/use-google-login";

export function GoogleLoginButton() {
  const router = useRouter();
  const { mutate: loginWithGoogle } = useGoogleLogin();

  return (
    <GoogleLogin
      logo_alignment="center"
      size="medium"
      onSuccess={(response) => {
        if (!response.credential) {
          toast.error("Google did not return an ID token");
          return;
        }

        loginWithGoogle(
          { idToken: response.credential },
          {
            onSuccess: () => router.push("/"),
            onError: (error) => {
              toast.error(
                error.response?.data.message ?? "Google login failed",
              );
            },
          },
        );
      }}
      onError={() => {
        toast.error("Google login failed");
      }}
    />
  );
}
