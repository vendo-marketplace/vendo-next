import type { Metadata } from "next";

import { AuthPageWrapper } from "@/features/auth/components/auth-page-wrapper";
import { OnboardingContent } from "./_components/OnboardingContent";

export const metadata: Metadata = {
  title: "Завершення реєстрації",
  description: "Підтвердьте email та завершіть налаштування акаунта Vendo.",
};

export default function OnboardingPage() {
  return (
    <AuthPageWrapper>
      <OnboardingContent />
    </AuthPageWrapper>
  );
}
