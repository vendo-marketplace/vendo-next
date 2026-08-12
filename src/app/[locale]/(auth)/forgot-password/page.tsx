import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { ForgotPassword } from "@/features/auth/components/forgot-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Відновлення пароля",
  description: "Отримайте посилання для відновлення пароля Vendo.",
};

const ForgotPasswordPage = () => {
  return (
    <AuthContentContainer>
      <ForgotPassword />
    </AuthContentContainer>
  );
};

export default ForgotPasswordPage;
