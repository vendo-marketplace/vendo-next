"use client";

import { AccountCompletion } from "@/features/auth/components/account-completion";
import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { VerifyCode } from "@/features/auth/components/verify-code";
import { useMe } from "@/features/auth/hooks/use-me";

export function OnboardingContent() {
  const { data: user } = useMe();
  const onSuccess = () => {
    console.log("asdasd");
  };
  if (!user) return null;
  return (
    <>
      <AuthContentContainer>
        {user.emailVerified ? (
          <AccountCompletion onSuccess={onSuccess} />
        ) : (
          <VerifyCode email={user.email} />
        )}
      </AuthContentContainer>
    </>
  );
}
