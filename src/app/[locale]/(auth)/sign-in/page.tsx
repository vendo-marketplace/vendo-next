import type { Metadata } from "next";

import AuthPage from "../_components/AuthPage";

export const metadata: Metadata = {
  title: "Вхід",
  description: "Увійдіть у свій акаунт Vendo.",
};

const SignInPage = () => <AuthPage activeTab="sign-in" />;

export default SignInPage;
