"use client";

import { AccountCompletion } from "@/features/auth/components/account-completion";
import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { VerifyCode } from "@/features/auth/components/verify-code";
import { useCompleteAccount } from "@/features/auth/hooks/use-complete-account";
import { useMe } from "@/features/auth/hooks/use-me";
import type { AccountCompletionCredentials } from "@/features/auth/types/auth";
import { useRouter } from "@/i18n/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useEffect, useState, useSyncExternalStore } from "react";

export function OnboardingContent() {
  const router = useRouter();
  const [sendVerificationOnMount] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("send-verification-code-on-onboarding") ===
        "true",
  );
  const { data: user } = useMe();
  const registrationEmail = useSyncExternalStore(
    () => () => {},
    () => window.sessionStorage.getItem("pending-verification-email") ?? "",
    () => "",
  );
  const { mutate: completeAccount } = useCompleteAccount();

  useEffect(() => {
    if (sendVerificationOnMount) {
      window.sessionStorage.removeItem("send-verification-code-on-onboarding");
    }
  }, [sendVerificationOnMount]);

  useEffect(() => {
    if (user?.emailVerified) {
      window.sessionStorage.removeItem("pending-verification-email");
    }
  }, [user?.emailVerified]);

  const onSuccess = (credentials: AccountCompletionCredentials) => {
    completeAccount(credentials, {
      onSuccess: () => router.push("/"),
    });
  };
  const email = user?.email ?? registrationEmail;
  if (!user && !email) return <LoadingSpinner />;
  return (
    <>
      <AuthContentContainer>
        {user?.emailVerified ? (
          <AccountCompletion onSuccess={onSuccess} />
        ) : (
          <VerifyCode
            email={email}
            sendOnMount={Boolean(
              user && !user.emailVerified && sendVerificationOnMount,
            )}
          />
        )}
      </AuthContentContainer>
    </>
  );
}
