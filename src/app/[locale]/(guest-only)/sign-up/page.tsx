import type { Metadata } from "next";

import { AuthPageWrapper } from "@/features/auth/components/auth-page-wrapper";
import AuthPage from "../_components/AuthPage";

export const metadata: Metadata = {
  title: "Реєстрація",
  description: "Створіть акаунт Vendo та почніть робити покупки.",
};

const SignUpPage = () => (
  <AuthPageWrapper>
    <AuthPage activeTab="sign-up" />
  </AuthPageWrapper>
);

export default SignUpPage;
