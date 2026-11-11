import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminGuard } from "@/features/admin/components/AdminGuard";
import { AdminNav } from "@/features/admin/components/AdminNav";

export const metadata: Metadata = {
  title: "Адмін-панель",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const t = await getTranslations("Admin");

  return (
    <AdminGuard>
      <div className="page-container flex-1 py-8 lg:py-10">
        <header className="mb-7">
          <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-text-secondary sm:text-base">
            {t("description")}
          </p>
        </header>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <AdminNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
