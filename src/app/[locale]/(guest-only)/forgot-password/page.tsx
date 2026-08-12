import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { AuthPageWrapper } from "@/features/auth/components/auth-page-wrapper";
import { ForgotPassword } from "@/features/auth/components/forgot-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Відновлення пароля",
  description: "Отримайте посилання для відновлення пароля Vendo.",
};

const ForgotPasswordPage = () => {
  return (
    <AuthPageWrapper>
      <AuthContentContainer>
        <ForgotPassword />
      </AuthContentContainer>
    </AuthPageWrapper>
  );
};

export default ForgotPasswordPage;
