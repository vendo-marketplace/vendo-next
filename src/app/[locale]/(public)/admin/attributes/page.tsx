import { getTranslations } from "next-intl/server";

import { AttributesManager } from "@/features/admin/components/attributes/AttributesManager";

export default async function AdminAttributesPage() {
  const t = await getTranslations("Admin.sections");

  return (
    <section aria-labelledby="admin-section-heading">
      <h2 id="admin-section-heading" className="sr-only">
        {t("attributes")}
      </h2>
      <AttributesManager />
    </section>
  );
}
