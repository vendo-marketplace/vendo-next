import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { AuthContentHeader } from "@/features/auth/components/auth-content-header";
import { ResetPassword } from "@/features/auth/components/reset-password";
import { validateResetCode } from "@/features/auth/server/validate-reset-code";

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

  const isCodeValid = await validateResetCode(code);

  return (
    <AuthContentContainer>
      {isCodeValid ? (
        <ResetPassword code={code} />
      ) : (
        <AuthContentHeader
          className="text-center"
          title="Недійсний код скидання пароля"
          description="Це посилання недійсне або термін його дії минув. Запросіть нове
            посилання для скидання пароля."
        />
      )}
    </AuthContentContainer>
  );
}
