"use client";

import {
  AuthForm,
  type AuthTab,
} from "@/features/auth/components/forms/auth-form";
import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { Logo } from "@/components/ui/logo";

type AuthContentProps = {
  activeTab: AuthTab;
};

const AuthContent = ({ activeTab }: AuthContentProps) => (
  <AuthContentContainer>
    <Logo size="sm" />
    <AuthForm activeTab={activeTab} />
  </AuthContentContainer>
);

export default AuthContent;
