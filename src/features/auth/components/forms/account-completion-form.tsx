"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { CalendarIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button/button";
import { FormField } from "@/components/ui/form/form-field";
import { UserIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";

import { accountCompletionSchema } from "../../schemas/account-completion-schema";
import type { AccountCompletionCredentials } from "../../types/auth";

type AccountCompletionFormProps = {
  onSuccess: (
    credentials: AccountCompletionCredentials,
  ) => void | Promise<void>;
};

export function AccountCompletionForm({
  onSuccess,
}: AccountCompletionFormProps) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<AccountCompletionCredentials>({
    resolver: zodResolver(accountCompletionSchema),
    defaultValues: { fullName: "", birthDate: "" },
    mode: "onChange",
  });

  const fullName = useWatch({ control, name: "fullName" });

  const clearFullName = () => {
    setValue("fullName", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSuccess)}>
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

      <FormField
        id="account-completion-birth-date"
        label="Дата народження"
        error={errors.birthDate?.message}
        required
      >
        {(fieldProps) => (
          <Input
            {...fieldProps}
            {...register("birthDate")}
            type="date"
            autoComplete="bday"
            disabled={isSubmitting}
            clearable={false}
            className="[&::-webkit-calendar-picker-indicator]:hidden text-neutral-600"
            start={<CalendarIcon className="size-full" />}
            onFocus={(event) => event.currentTarget.showPicker()}
          />
        )}
      </FormField>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Збереження..." : "Увійти в акаунт"}
      </Button>
    </form>
  );
}
