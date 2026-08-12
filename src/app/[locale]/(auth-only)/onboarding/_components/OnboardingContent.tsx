"use client";

import { AccountCreated } from "@/features/auth/components/account-created";
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
          <AccountCreated onSuccess={onSuccess} />
        ) : (
          <VerifyCode email={user.email} />
        )}
      </AuthContentContainer>
    </>
  );
}
