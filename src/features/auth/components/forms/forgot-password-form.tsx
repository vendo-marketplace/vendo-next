"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/button";
import { FormErrorNotice } from "@/components/ui/form/form-error-notice";
import { FormField } from "@/components/ui/form/form-field";
import { MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { applyApiErrorToForm, SERVER_ERROR_KEY } from "@/utils/api-error";

import { forgotPasswordSchema } from "../../schemas/forgot-password-schema";
import type { ForgotPasswordCredentials } from "../../types/auth";

type ForgotPasswordFormProps = {
  isPending?: boolean;
  onSubmit: (values: ForgotPasswordCredentials) => Promise<void>;
};

export function ForgotPasswordForm({
  isPending = false,
  onSubmit,
}: ForgotPasswordFormProps) {
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<ForgotPasswordCredentials>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const email = useWatch({ control, name: "email" });
  const serverError = errors.root?.server?.message;
  const isBusy = isPending || isSubmitting;

  const clearServerError = () => {
    if (serverError) clearErrors(SERVER_ERROR_KEY);
  };

  const clearEmail = () => {
    setValue("email", "", {
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
        fields: ["email"],
        fallback: "Не вдалося надіслати посилання. Спробуйте ще раз.",
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
        id="forgot-password-email"
        label="Електронна пошта"
        error={errors.email?.message}
        required
      >
        {(fieldProps) => (
          <Input
            {...fieldProps}
            {...register("email")}
            type="email"
            autoComplete="email"
            disabled={isBusy}
            value={email}
            onClear={clearEmail}
            placeholder="Введіть електронну пошту"
            start={<MailIcon className="size-full" />}
          />
        )}
      </FormField>

      {serverError && <FormErrorNotice message={serverError} />}

      <Button className="mt-2 w-full" type="submit" disabled={isBusy}>
        {isBusy ? "Надсилання..." : "Надіслати посилання"}
      </Button>
    </form>
  );
}
