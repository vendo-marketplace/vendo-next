import { ArrowRightIcon, TickIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button/button";
import { FormField } from "@/components/ui/form/form-field";
import { UserIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { Link } from "@/i18n/navigation";
import { AuthContentHeader } from "./auth-content-header";

export function AccountCreated() {
  return (
    <>
      <div className="flex justify-center mx-auto items-center size-14 bg-brand-50 rounded-full text-brand-600">
        <TickIcon className="size-8" aria-hidden="true" />
      </div>

      <AuthContentHeader
        title="Вітаємо у Vendo!"
        description="Розкажіть трохи про себе, щоб ми могли персоналізувати Ваш досвід та
          зробити покупки ще зручнішими."
      />

      <div className="space-y-4">
        <FormField id="account-created-full-name" label="Ім’я">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              name="fullName"
              autoComplete="name"
              placeholder="Введіть своє ім’я"
              start={<UserIcon className="size-full" />}
            />
          )}
        </FormField>

        <label className="flex flex-col gap-3 text-[14px] font-medium text-neutral-700">
          Дата народження
          <Input name="birthDate" type="date" autoComplete="bday" />
        </label>
      </div>

      <Button asChild className="w-full">
        <Link href="/sign-in">Увійти в акаунт</Link>
      </Button>

      <Link
        className="font-medium cursor-pointer flex items-center justify-center gap-2 text-[14px] leading-5 text-neutral-600"
        href="/sign-in"
      >
        <span>Пропустити</span>
        <ArrowRightIcon className="size-4" />
      </Link>
    </>
  );
}
