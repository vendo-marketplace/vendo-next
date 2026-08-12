"use client";

import {
  AuthForm,
  type AuthTab,
} from "@/features/auth/components/forms/auth-form";
import { AuthContentContainer } from "@/features/auth/components/auth-content-container";

type AuthContentProps = {
  activeTab: AuthTab;
};

const AuthContent = ({ activeTab }: AuthContentProps) => (
  <AuthContentContainer>
    <AuthForm activeTab={activeTab} />
  </AuthContentContainer>
);

export default AuthContent;
