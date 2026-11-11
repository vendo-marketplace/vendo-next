import { getTranslations } from "next-intl/server";

import { ReindexCard } from "@/features/admin/components/ReindexCard";

export default async function AdminSearchPage() {
  const t = await getTranslations("Admin.sections");

  return (
    <section aria-labelledby="admin-section-heading">
      <h2 id="admin-section-heading" className="sr-only">
        {t("search")}
      </h2>
      <ReindexCard />
    </section>
  );
}
