import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { AuthContentHeader } from "@/features/auth/components/auth-content-header";
import { ResetPassword } from "@/features/auth/components/reset-password";

type ResetPasswordPageProps = {
  searchParams: Promise<{ code?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const codeParam = (await searchParams).code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

  if (!code) {
    return (
      <AuthContentContainer>
        <AuthContentHeader
          className="text-center"
          title="Відсутній код скидання пароля"
          description="Перейдіть за повним посиланням із листа, щоб змінити пароль."
        />
      </AuthContentContainer>
    );
  }

  return <ResetPassword code={code} />;
}
