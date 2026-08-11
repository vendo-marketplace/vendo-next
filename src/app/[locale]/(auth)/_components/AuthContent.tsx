"use client";

import { AuthForm, type AuthTab } from "@/features/auth/components/auth-form";
import { SignUpFlow } from "@/features/auth/components/sign-up-flow";

type AuthContentProps = {
  activeTab: AuthTab;
};

const AuthContent = ({ activeTab }: AuthContentProps) => (
  <div className="flex flex-1 items-center justify-center">
    <div className="w-120 space-y-6">
      {activeTab === "sign-up" ? (
        <SignUpFlow />
      ) : (
        <AuthForm activeTab="sign-in" />
      )}
    </div>
  </div>
);

export default AuthContent;
