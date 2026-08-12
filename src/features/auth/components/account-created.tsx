"use client";

import { ArrowRightIcon, TickIcon } from "@/assets/icons";
import { Link, useRouter } from "@/i18n/navigation";

import type { AccountCompletionCredentials } from "../types/auth";
import { AuthContentHeader } from "./auth-content-header";
import { AccountCompletionForm } from "./forms/account-completion-form";

type AccountCreatedProps = {
  onSuccess?: (
    credentials: AccountCompletionCredentials,
  ) => void | Promise<void>;
};

export function AccountCreated({ onSuccess }: AccountCreatedProps) {
  const router = useRouter();

  const handleSuccess = async (credentials: AccountCompletionCredentials) => {
    if (onSuccess) {
      await onSuccess(credentials);
      return;
    }

    router.push("/sign-in");
  };

  return (
    <>
      <div className="flex justify-center mx-auto items-center size-14 bg-brand-50 rounded-full text-brand-600">
        <TickIcon className="size-8" aria-hidden="true" />
      </div>

      <AuthContentHeader
        title="Вітаємо у Vendo!"
        description="Розкажіть трохи про себе, щоб ми могли персоналізувати Ваш досвід та
          зробити покупки ще зручнішими."
      />

      <AccountCompletionForm onSuccess={handleSuccess} />

      <Link
        className="font-medium cursor-pointer flex items-center justify-center gap-2 text-[14px] leading-5 text-neutral-600"
        href="/sign-in"
      >
        <span>Пропустити</span>
        <ArrowRightIcon className="size-4" />
      </Link>
    </>
  );
}
