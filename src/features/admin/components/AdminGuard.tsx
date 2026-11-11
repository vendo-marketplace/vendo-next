"use client";

import { RefreshCw, ShieldX } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";

import { Button } from "@/components/ui/button/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMe } from "@/features/auth/hooks/use-me";
import { Link, useRouter } from "@/i18n/navigation";

import { hasAdminRole } from "../utils/has-admin-role";

type Props = {
  children: ReactNode;
};

export const AdminGuard = ({ children }: Props) => {
  const t = useTranslations("Admin");
  const router = useRouter();
  const { data: user, isPending, isError, refetch } = useMe();
  const isSignedOut = !isPending && !isError && !user;

  useEffect(() => {
    if (isSignedOut) router.replace("/sign-in");
  }, [isSignedOut, router]);

  if (isPending || isSignedOut) return <LoadingSpinner />;

  if (isError) {
    return (
      <AdminNotice
        icon={<RefreshCw aria-hidden="true" className="size-6" />}
        title={t("loadErrorTitle")}
        text={t("loadErrorText")}
        action={<Button onClick={() => void refetch()}>{t("retry")}</Button>}
      />
    );
  }

  if (!hasAdminRole(user)) {
    return (
      <AdminNotice
        icon={<ShieldX aria-hidden="true" className="size-6" />}
        title={t("forbiddenTitle")}
        text={t("forbiddenText")}
        action={
          <Button asChild>
            <Link href="/">{t("backHome")}</Link>
          </Button>
        }
      />
    );
  }

  return children;
};

type AdminNoticeProps = {
  icon: ReactNode;
  title: string;
  text: string;
  action: ReactNode;
};

const AdminNotice = ({ icon, title, text, action }: AdminNoticeProps) => (
  <section className="page-container flex-1 py-10">
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-stroke-primary-subtle bg-surface-secondary px-6 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-surface-primary text-text-secondary">
        {icon}
      </div>
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      <p className="mt-2 max-w-md text-text-secondary">{text}</p>
      <div className="mt-5">{action}</div>
    </div>
  </section>
);
