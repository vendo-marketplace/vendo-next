"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/button";
import { FormField } from "@/components/ui/form/form-field";
import { MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";

import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "../schemas/forgot-password-schema";

type ForgotPasswordFormProps = {
  onSubmit: (values: ForgotPasswordValues) => void | Promise<void>;
  isPending?: boolean;
};

export function ForgotPasswordForm({
  onSubmit,
  isPending = false,
}: ForgotPasswordFormProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const email = useWatch({ control, name: "email" });

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
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
            value={email}
            onClear={() =>
              setValue("email", "", {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            placeholder="Введіть електронну пошту"
            start={<MailIcon className="size-full" />}
          />
        )}
      </FormField>

      <Button
        className="w-full"
        type="submit"
        disabled={isPending || isSubmitting}
      >
        Надіслати посилання
      </Button>
    </form>
  );
}
