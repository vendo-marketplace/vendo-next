"use client";

import { AccountCompletion } from "@/features/auth/components/account-completion";
import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { VerifyCode } from "@/features/auth/components/verify-code";
import { useCompleteAccount } from "@/features/auth/hooks/use-complete-account";
import { useMe } from "@/features/auth/hooks/use-me";
import type { AccountCompletionCredentials } from "@/features/auth/types/auth";
import { useRouter } from "@/i18n/navigation";

export function OnboardingContent() {
  const router = useRouter();
  const { data: user } = useMe();
  const { mutate: completeAccount } = useCompleteAccount();

  const onSuccess = (credentials: AccountCompletionCredentials) => {
    completeAccount(credentials, {
      onSuccess: () => router.push("/"),
    });
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
