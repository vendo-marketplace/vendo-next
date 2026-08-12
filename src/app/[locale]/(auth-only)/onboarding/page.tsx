import type { Metadata } from "next";

import { Logo } from "@/components/ui/logo";
import AuthContentFooter from "../../(guest-only)/_components/AuthContentFooter";
import { OnboardingContent } from "./_components/OnboardingContent";

export const metadata: Metadata = {
  title: "Завершення реєстрації",
  description: "Підтвердьте email та завершіть налаштування акаунта Vendo.",
};

export default function OnboardingPage() {
  return (
    <>
      <div className="flex px-15 py-6">
        <Logo size="sm" />
      </div>
      <OnboardingContent />;
      <AuthContentFooter />
    </>
  );

  return;
}
