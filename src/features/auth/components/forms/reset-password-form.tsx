"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/button";
import { FormField } from "@/components/ui/form/form-field";
import { LockIcon } from "@/components/ui/icons";
import { PasswordInput } from "@/components/ui/input/password-input";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../schemas/reset-password-schema";

type ResetPasswordFormProps = {
  isPending: boolean;
  onSubmit: (values: ResetPasswordFormValues) => void;
};

export function ResetPasswordForm({
  isPending,
  onSubmit,
}: ResetPasswordFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const password = useWatch({ control, name: "password" });

  const clearPassword = () => {
    setValue("password", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
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
            disabled={isPending}
            value={password}
            onClear={clearPassword}
            placeholder="Введіть новий пароль"
            start={<LockIcon className="size-full" />}
          />
        )}
      </FormField>

      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Збереження..." : "Підтвердити"}
      </Button>
    </form>
  );
}
