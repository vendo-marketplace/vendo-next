"use client";

import { BellIcon } from "@/assets/icons/BellIcon";
import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import { Link } from "@/i18n/navigation";

// TODO(api): there is no notifications endpoint yet, so the list is always empty.
export default function NotificationsPage() {
  const { data: user, isPending } = useMe();

  if (isPending) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="page-container py-6">
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Сповіщення</h1>
      <div className="flex flex-col items-center gap-4 rounded-lg border border-stroke-secondary bg-surface-primary px-4 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-surface-brand-subtle text-text-brand">
          <BellIcon size={24} />
        </span>
        {user ? (
          <div className="flex max-w-sm flex-col gap-2">
            <p className="text-md font-semibold text-text-primary">Нових сповіщень немає</p>
            <p className="text-sm text-text-secondary">
              Тут з’являться відповіді на ваші оголошення та нові товари з автопошуків.
            </p>
          </div>
        ) : (
          <>
            <p className="max-w-sm text-sm text-text-secondary">
              Увійдіть, щоб бачити сповіщення про ваші оголошення й автопошуки.
            </p>
            <Button asChild size="sm">
              <Link href="/sign-in">Увійти</Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
