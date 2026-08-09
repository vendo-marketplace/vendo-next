"use client";

import { VerifyEmailForm } from "@/features/auth/forms/verify-email-form";
import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import type { VerifyEmailValues } from "@/features/auth/schemas/verify-email-schema";
import type { VerificationFlow } from "@/features/auth/types/auth";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

type VerifyEmailProps = {
  email?: string;
  flow: VerificationFlow;
  initialOtp?: string;
};

export function VerifyEmail({ email, initialOtp, flow }: VerifyEmailProps) {
  const { mutate, isPending } = useVerifyEmail();

  const submitOtp = ({ otp }: VerifyEmailValues) => {
    mutate(otp, {
      onSuccess: () => {
        toast.success("Код підтверджено");
      },
      onError: (error) => toast.error(error.response?.data.message),
    });
  };

  return (
    <div className="mx-auto my-auto flex w-full max-w-120 flex-col gap-6 px-4">
      <div className="space-y-1">
        <h1 className="text-neutral-950 text-[24px] leading-7.5 font-semibold">
          Підтвердіть Ваш e-mail
        </h1>
        <p className="text-neutral-400 text-[16px] leading-6 font-normal">
          На електронну адресу <span className="text-brand-600">{email}</span>{" "}
          надіслано код-підтвердження. Будь ласка, введіть його.
        </p>
      </div>

      <VerifyEmailForm
        initialOtp={initialOtp}
        isPending={isPending}
        onSubmit={submitOtp}
      />

      <p className="text-neutral-600 text-center text-[14px] leading-5">
        Не отримали код?{" "}
        <Link
          className="text-brand-600 font-medium underline"
          href="/forgot-password"
        >
          Надіслати ще раз
        </Link>
      </p>
    </div>
  );
}
