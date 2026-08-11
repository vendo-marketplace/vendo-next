import { AuthContentHeader } from "@/features/auth/components/auth-content-header";
import { ForgotPassword } from "@/features/auth/components/forgot-password";

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col gap-6 flex-1 justify-center items-center">
      <div className="w-120 space-y-6">
        <AuthContentHeader
          title="Забули свій пароль?"
          description="Введіть свою електронну пошту, і ми надішлемо вам посилання для скидання пароля."
        />
        <ForgotPassword />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
