"use client";

import { TickIcon } from "@/assets/icons";

import type { AccountCompletionCredentials } from "../types/auth";
import { AuthContentHeader } from "./auth-content-header";
import { AccountCompletionForm } from "./forms/account-completion-form";

type AccountCompletionProps = {
  onSubmit: (credentials: AccountCompletionCredentials) => Promise<void>;
};

export function AccountCompletion({ onSubmit }: AccountCompletionProps) {
  return (
    <>
      <div className="flex justify-center mx-auto items-center size-14 bg-surface-brand-subtle rounded-full text-text-brand">
        <TickIcon className="size-8" aria-hidden="true" />
      </div>

      <AuthContentHeader
        title="Вітаємо у Vendo!"
        description="Розкажіть трохи про себе, щоб ми могли персоналізувати Ваш досвід та
          зробити покупки ще зручнішими."
      />

      <AccountCompletionForm
        onSubmit={onSubmit}
        submitLabel="Увійти в акаунт"
      />
    </>
  );
}
