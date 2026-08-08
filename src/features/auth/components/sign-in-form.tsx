"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form/form-field";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";

import { useLogin } from "../hooks/use-login";
import { signInSchema } from "../schemas/sign-in-schema";
import type { LoginCredentials } from "../types/auth";

export function SignInForm() {
  const login = useLogin();
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
    <form
      className="space-y-4"
      noValidate
      onSubmit={handleSubmit((credentials) => login.mutate(credentials))}
    >
      <FormField
        id="email"
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
          id="password"
          label="Пароль"
          error={errors.password?.message}
          required
        >
          {(fieldProps) => (
            <Input
              {...fieldProps}
              {...register("password")}
              type="password"
              autoComplete="current-password"
              value={password}
              onClear={() => clearField("password")}
              placeholder="Введіть пароль"
              start={<LockIcon className="size-full" />}
            />
          )}
        </FormField>

        <Link href="/">Забули пароль?</Link>
      </div>

      {login.isError && (
        <p role="alert" className="text-sm text-red-600">
          Не вдалося увійти. Перевірте дані та спробуйте ще раз.
        </p>
      )}

      <Button className="w-full" type="submit" disabled={login.isPending}>
        Увійти
      </Button>
    </form>
  );
}
