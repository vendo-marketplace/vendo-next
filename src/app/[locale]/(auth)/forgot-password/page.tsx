import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { ForgotPassword } from "@/features/auth/components/forgot-password";

const ForgotPasswordPage = () => {
  return (
    <AuthContentContainer>
      <ForgotPassword />
    </AuthContentContainer>
  );
};

export default ForgotPasswordPage;
