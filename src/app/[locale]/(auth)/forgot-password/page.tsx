import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { AuthContentHeader } from "@/features/auth/components/auth-content-header";
import { ForgotPassword } from "@/features/auth/components/forgot-password";

const ForgotPasswordPage = () => {
  return (
    <AuthContentContainer>
      <AuthContentHeader
        title="Забули свій пароль?"
        description="Введіть свою електронну пошту, і ми надішлемо вам посилання для скидання пароля."
      />
      <ForgotPassword />
    </AuthContentContainer>
  );
};

export default ForgotPasswordPage;
