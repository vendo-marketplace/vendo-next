"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/button";
import { FormErrorNotice } from "@/components/ui/form/form-error-notice";
import { FormField } from "@/components/ui/form/form-field";
import { UserIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { applyApiErrorToForm, SERVER_ERROR_KEY } from "@/utils/api-error";

import { accountCompletionSchema } from "../../schemas/account-completion-schema";
import type { AccountCompletionCredentials } from "../../types/auth";

type AccountCompletionFormProps = {
  onSubmit: (credentials: AccountCompletionCredentials) => Promise<void>;
  submitLabel?: string;
  submittingLabel?: string;
};

export function AccountCompletionForm({
  onSubmit,
  submitLabel = "Зберегти ім’я",
  submittingLabel = "Збереження...",
}: AccountCompletionFormProps) {
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<AccountCompletionCredentials>({
    resolver: zodResolver(accountCompletionSchema),
    defaultValues: { fullName: "" },
    mode: "onChange",
  });

  const fullName = useWatch({ control, name: "fullName" });
  const serverError = errors.root?.server?.message;

  const clearServerError = () => {
    if (serverError) clearErrors(SERVER_ERROR_KEY);
  };

  const clearFullName = () => {
    setValue("fullName", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearServerError();
  };

  const submit = handleSubmit(async (credentials) => {
    try {
      await onSubmit(credentials);
    } catch (error) {
      applyApiErrorToForm(error, setError, {
        fields: ["fullName"],
        fallback: "Не вдалося зберегти ім’я. Спробуйте ще раз.",
      });
    }
  });

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={submit}
      onChange={clearServerError}
    >
      <FormField
        id="account-completion-full-name"
        label="Ім’я"
        error={errors.fullName?.message}
        required
      >
        {(fieldProps) => (
          <Input
            {...fieldProps}
            {...register("fullName")}
            autoComplete="name"
            disabled={isSubmitting}
            value={fullName}
            onClear={clearFullName}
            placeholder="Введіть своє ім’я"
            start={<UserIcon className="size-full" />}
          />
        )}
      </FormField>

      {serverError && <FormErrorNotice message={serverError} />}

      <Button className="mt-2 w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
