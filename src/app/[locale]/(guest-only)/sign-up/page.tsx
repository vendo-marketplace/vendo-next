import type { Metadata } from "next";

import AuthPage from "../_components/AuthPage";

export const metadata: Metadata = {
  title: "Реєстрація",
  description: "Створіть акаунт Vendo та почніть робити покупки.",
};

const SignUpPage = () => <AuthPage activeTab="sign-up" />;

export default SignUpPage;
