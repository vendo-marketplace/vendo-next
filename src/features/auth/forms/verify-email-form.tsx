"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button/button";
import { FormField } from "@/components/ui/form/form-field";
import { Input } from "@/components/ui/input/input";

import {
  verifyEmailSchema,
  type VerifyEmailValues,
} from "../schemas/verify-email-schema";

type VerifyEmailFormProps = {
  initialOtp?: string;
  isPending?: boolean;
  onSubmit: (values: VerifyEmailValues) => void | Promise<void>;
};

export function VerifyEmailForm({
  initialOtp = "",
  isPending = false,
  onSubmit,
}: VerifyEmailFormProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: initialOtp },
    mode: "onChange",
  });

  const otp = useWatch({ control, name: "otp" });

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        id="verify-email-otp"
        label="Код підтвердження"
        error={errors.otp?.message}
        required
      >
        {(fieldProps) => (
          <Input
            {...fieldProps}
            {...register("otp")}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onClear={() =>
              setValue("otp", "", {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
            placeholder="Введіть шестизначний код"
          />
        )}
      </FormField>

      <Button
        className="w-full"
        type="submit"
        disabled={isPending || isSubmitting}
      >
        Підтвердити
      </Button>
    </form>
  );
}
