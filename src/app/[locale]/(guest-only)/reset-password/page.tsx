import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { AuthContentHeader } from "@/features/auth/components/auth-content-header";
import { AuthPageWrapper } from "@/features/auth/components/auth-page-wrapper";
import { ResetPassword } from "@/features/auth/components/reset-password";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Скидання пароля",
  description: "Створіть новий пароль для свого акаунта Vendo.",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ code?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const codeParam = (await searchParams).code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

  return (
    <AuthPageWrapper>
      <AuthContentContainer>
        {!code ? (
          <AuthContentHeader
            className="text-center"
            title="Відсутній код скидання пароля"
            description="Перейдіть за повним посиланням із листа, щоб змінити пароль."
          />
        ) : (
          <ResetPassword code={code} />
        )}
      </AuthContentContainer>
    </AuthPageWrapper>
  );
}
