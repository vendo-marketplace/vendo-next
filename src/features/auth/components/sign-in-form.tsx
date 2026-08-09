"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";

import { FormField } from "@/components/ui/form/form-field";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { PasswordInput } from "@/components/ui/input/password-input";

import { Button } from "@/components/ui/button/button";
import { signInSchema } from "../schemas/sign-in-schema";
import type { LoginCredentials } from "../types/auth";

type SignInFormProps = {
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>;
  isPending?: boolean;
  submitError?: string;
  submitLabel?: string;
  showForgotPassword?: boolean;
  passwordAutoComplete?: "current-password" | "new-password";
  idPrefix?: string;
};

export function SignInForm({
  onSubmit,
  isPending = false,
  submitLabel = "Увійти",
  showForgotPassword = true,
  passwordAutoComplete = "current-password",
  idPrefix = "sign-in",
}: SignInFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
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

  const clearField = (field: keyof LoginCredentials) => {
    setValue(field, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
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

      <div className="flex flex-col gap-3">
        <FormField
          id={`${idPrefix}-password`}
          label="Пароль"
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

        {showForgotPassword && (
          <Link
            href="/forgot-password"
            className="text-brand-600 font-medium text-[14px] leading-5"
          >
            Забули пароль?
          </Link>
        )}
      </div>

      {/* {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )} */}

      <Button className="w-full" type="submit" disabled={isPending}>
        {submitLabel}
      </Button>
    </form>
  );
}
