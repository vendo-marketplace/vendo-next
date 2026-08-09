"use client";

import { ForgotPasswordForm } from "@/features/auth/forms/forgot-password-form";
import { Link } from "@/i18n/navigation";

const ForgotPassword = () => {
  const submitResetRequest = () => {
    // Add the forgot-password mutation and success redirect here.
  };

  return (
    <div className="mx-auto my-auto flex w-full max-w-120 flex-col gap-6 px-4">
      <div className="space-y-1">
        <h1 className="text-neutral-950 text-[24px] leading-7.5 font-semibold">
          Забули свій пароль?
        </h1>
        <p className="text-neutral-400 text-[16px] leading-6 font-normal">
          Введіть свою електронну пошту, і ми надішлемо вам посилання для
          скидання пароля.
        </p>
      </div>

      <ForgotPasswordForm onSubmit={submitResetRequest} />

      <p className="text-neutral-600 text-center text-[14px] leading-5">
        Вже маєте акаунт?{" "}
        <Link className="text-brand-600 font-medium underline" href="/login">
          Увійти
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
