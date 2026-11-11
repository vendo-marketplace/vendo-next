import { getLocale } from "next-intl/server";

import { DEFAULT_ADMIN_SECTION } from "@/features/admin/config/admin-sections";
import { redirect } from "@/i18n/navigation";

export default async function AdminIndexPage() {
  const locale = await getLocale();

  redirect({ href: DEFAULT_ADMIN_SECTION.href, locale });
}
