import { Button } from "@/components/ui/button/button";
import { CheckIcon, UserIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { Link } from "@/i18n/navigation";

export function AccountCreated() {
  return (
    <div className="space-y-6">
      <div className="flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <div className="flex size-7 items-center justify-center rounded-full bg-brand-600">
          <CheckIcon className="size-3.5" />
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
          Вітаємо у Vendo!
        </h1>
        <p className="text-[14px] leading-5 text-neutral-400">
          Розкажіть трохи про себе, щоб ми могли персоналізувати Ваш досвід та
          зробити покупки ще зручнішими.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex flex-col gap-3 text-[14px] font-medium text-neutral-700">
          Ім’я
          <Input
            name="fullName"
            autoComplete="name"
            placeholder="Введіть своє ім’я"
            start={<UserIcon className="size-full" />}
          />
        </label>

        <label className="flex flex-col gap-3 text-[14px] font-medium text-neutral-700">
          Дата народження
          <Input name="birthDate" type="date" autoComplete="bday" />
        </label>
      </div>

      <Button asChild className="w-full">
        <Link href="/sign-in">Увійти в акаунт</Link>
      </Button>

      <p className="text-center text-[14px] text-neutral-400">
        <Link className="font-medium hover:text-neutral-600" href="/sign-in">
          Пропустити →
        </Link>
      </p>
    </div>
  );
}
