"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/button";
import { FormErrorNotice } from "@/components/ui/form/form-error-notice";
import { FormField } from "@/components/ui/form/form-field";
import { LockIcon } from "@/components/ui/icons";
import { PasswordInput } from "@/components/ui/input/password-input";
import { applyApiErrorToForm, SERVER_ERROR_KEY } from "@/utils/api-error";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../schemas/reset-password-schema";

type ResetPasswordFormProps = {
  isPending?: boolean;
  onSubmit: (values: ResetPasswordFormValues) => Promise<void>;
};

export function ResetPasswordForm({
  isPending,
  onSubmit,
}: ResetPasswordFormProps) {
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const password = useWatch({ control, name: "password" });
  const serverError = errors.root?.server?.message;
  const isBusy = isPending || isSubmitting;

  const clearServerError = () => {
    if (serverError) clearErrors(SERVER_ERROR_KEY);
  };

  const clearPassword = () => {
    setValue("password", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearServerError();
  };

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      applyApiErrorToForm(error, setError, {
        fields: ["password"],
        fallback: "Не вдалося змінити пароль. Спробуйте ще раз.",
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
        id="reset-password"
        label="Пароль"
        error={errors.password?.message}
        required
      >
        {(fieldProps) => (
          <PasswordInput
            {...fieldProps}
            {...register("password")}
            autoComplete="new-password"
            disabled={isBusy}
            value={password}
            onClear={clearPassword}
            placeholder="Введіть новий пароль"
            start={<LockIcon className="size-full" />}
          />
        )}
      </FormField>

      {serverError && <FormErrorNotice message={serverError} />}

      <Button className="mt-2 w-full" type="submit" disabled={isBusy}>
        {isBusy ? "Збереження..." : "Підтвердити"}
      </Button>
    </form>
  );
}
