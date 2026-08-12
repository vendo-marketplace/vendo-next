import { AuthContentContainer } from "@/features/auth/components/auth-content-container";
import { ResetPassword } from "@/features/auth/components/reset-password";

type ResetPasswordPageProps = {
  searchParams: Promise<{ code?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const codeParam = (await searchParams).code;
  const code = Array.isArray(codeParam) ? codeParam[0] : codeParam;

  return (
    <AuthContentContainer>
      {code ? (
        <ResetPassword code={code} />
      ) : (
        <div className="space-y-1 text-center">
          <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
            Відсутній код скидання пароля
          </h1>
          <p className="text-[16px] leading-6 text-neutral-400">
            Перейдіть за повним посиланням із листа, щоб змінити пароль.
          </p>
        </div>
      )}
    </AuthContentContainer>
  );
}
