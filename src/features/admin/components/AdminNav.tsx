"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import { ADMIN_SECTIONS } from "../config/admin-sections";

export const AdminNav = () => {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  return (
    <nav aria-label={t("navLabel")} className="lg:w-56 lg:shrink-0">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {ADMIN_SECTIONS.map(({ id, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={id}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-surface-brand-subtle text-text-brand"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {t(`sections.${id}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
