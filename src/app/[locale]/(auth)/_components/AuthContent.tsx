"use client";

import { Logo } from "@/components/ui/logo";
import {
  AuthForm,
  type AuthTab,
} from "@/features/auth/components/auth-form";
import { SignUpFlow } from "@/features/auth/components/sign-up-flow";

import AuthContentFooter from "./AuthContentFooter";

type AuthContentProps = {
  activeTab: AuthTab;
};

const AuthContent = ({ activeTab }: AuthContentProps) => (
  <div className="flex flex-1 flex-col">
    <div className="flex px-15 py-6">
      <Logo size="sm" />
    </div>
    <div className="flex flex-1 items-center justify-center">
      <div className="w-120 space-y-6">
        {activeTab === "sign-up" ? (
          <SignUpFlow />
        ) : (
          <AuthForm activeTab="sign-in" />
        )}
      </div>
    </div>
    <AuthContentFooter />
  </div>
);

export default AuthContent;
