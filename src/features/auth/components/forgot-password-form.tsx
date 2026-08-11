"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/button";
import { FormField } from "@/components/ui/form/form-field";
import { MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";

import { forgotPasswordSchema } from "../schemas/forgot-password-schema";
import type { ForgotPasswordCredentials } from "../types/auth";

type ForgotPasswordFormProps = {
  isPending?: boolean;
  onSubmit: (
    credentials: ForgotPasswordCredentials,
  ) => void | Promise<void>;
};

export function ForgotPasswordForm({
  isPending = false,
  onSubmit,
}: ForgotPasswordFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<ForgotPasswordCredentials>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const email = useWatch({ control, name: "email" });

  const clearEmail = () => {
    setValue("email", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
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
            disabled={isPending}
            value={email}
            onClear={clearEmail}
            placeholder="Введіть електронну пошту"
            start={<MailIcon className="size-full" />}
          />
        )}
      </FormField>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Надсилання..." : "Надіслати посилання"}
      </Button>
    </form>
  );
}
