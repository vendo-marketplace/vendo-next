"use client";

import {
  AuthForm,
  type AuthTab,
} from "@/features/auth/components/forms/auth-form";
import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { SignUpFlow } from "@/features/auth/components/sign-up-flow";

type AuthContentProps = {
  activeTab: AuthTab;
};

const AuthContent = ({ activeTab }: AuthContentProps) => (
  <AuthContentContainer>
    {activeTab === "sign-up" ? (
      <SignUpFlow />
    ) : (
      <AuthForm activeTab="sign-in" />
    )}
  </AuthContentContainer>
);

export default AuthContent;
