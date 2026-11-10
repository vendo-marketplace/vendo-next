"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { FormField } from "@/components/ui/form/form-field";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { PasswordInput } from "@/components/ui/input/password-input";

import { Button } from "@/components/ui/button/button";
import { FormErrorNotice } from "@/components/ui/form/form-error-notice";
import { signInSchema } from "../../schemas/sign-in-schema";
import type { LoginCredentials } from "../../types/auth";
import { Link } from "@/i18n/navigation";
import { applyApiErrorToForm, SERVER_ERROR_KEY } from "@/utils/api-error";

type SignInFormProps = {
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
  fallbackErrorMessage: string;
  submitLabel?: string;
  passwordAutoComplete?: "current-password" | "new-password";
  idPrefix?: string;
  showForgotPasswordLink?: boolean;
};

export function SignInForm({
  onSubmit,
  fallbackErrorMessage,
  submitLabel = "Увійти",
  passwordAutoComplete = "current-password",
  idPrefix = "sign-in",
  showForgotPasswordLink = false,
}: SignInFormProps) {
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<LoginCredentials>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });
  const serverError = errors.root?.server?.message;

  const clearServerError = () => {
    if (serverError) clearErrors(SERVER_ERROR_KEY);
  };

  const clearField = (field: keyof LoginCredentials) => {
    setValue(field, "", {
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
        fields: ["email", "password"],
        fallback: fallbackErrorMessage,
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
        id={`${idPrefix}-email`}
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
            value={email}
            onClear={() => clearField("email")}
            placeholder="Введіть електронну пошту"
            start={<MailIcon className="size-full" />}
          />
        )}
      </FormField>

      <FormField
        id={`${idPrefix}-password`}
        label="Пароль"
        labelAction={
          showForgotPasswordLink && (
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-text-brand hover:text-text-brand-dark"
            >
              Забули пароль?
            </Link>
          )
        }
        error={errors.password?.message}
        required
      >
        {(fieldProps) => (
          <PasswordInput
            {...fieldProps}
            {...register("password")}
            autoComplete={passwordAutoComplete}
            value={password}
            onClear={() => clearField("password")}
            placeholder="Введіть пароль"
            start={<LockIcon className="size-full" />}
          />
        )}
      </FormField>

      {serverError && <FormErrorNotice message={serverError} />}

      <Button className="mt-2 w-full" type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
