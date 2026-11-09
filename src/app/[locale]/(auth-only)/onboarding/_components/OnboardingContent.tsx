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
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
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
  const { mutateAsync: completeAccount } = useCompleteAccount();

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

  const submitAccountCompletion = async (
    credentials: AccountCompletionCredentials,
  ) => {
    await completeAccount(credentials);
    router.push("/");
  };
  const email = user?.email ?? registrationEmail;
  const showAccountCompletion = Boolean(user?.emailVerified || isVerificationComplete);
  if (!user && !email) return <LoadingSpinner />;
  return (
    <>
      <AuthContentContainer>
        {showAccountCompletion ? (
          <AccountCompletion onSubmit={submitAccountCompletion} />
        ) : (
          <VerifyCode
            email={email}
            onSuccess={() => setIsVerificationComplete(true)}
            sendOnMount={Boolean(
              user && !user.emailVerified && sendVerificationOnMount,
            )}
          />
        )}
      </AuthContentContainer>
    </>
  );
}
