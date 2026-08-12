import type { Metadata } from "next";

import { AuthPageWrapper } from "@/features/auth/components/auth-page-wrapper";
import AuthPage from "../_components/AuthPage";

export const metadata: Metadata = {
  title: "Вхід",
  description: "Увійдіть у свій акаунт Vendo.",
};

const SignInPage = () => (
  <AuthPageWrapper>
    <AuthPage activeTab="sign-in" />
  </AuthPageWrapper>
);

export default SignInPage;
