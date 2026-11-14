import { getTranslations } from "next-intl/server";

import { CategoriesManager } from "@/features/admin/components/categories/CategoriesManager";

export default async function AdminCategoriesPage() {
  const t = await getTranslations("Admin.sections");

  return (
    <section aria-labelledby="admin-section-heading">
      <h2 id="admin-section-heading" className="sr-only">
        {t("categories")}
      </h2>
      <CategoriesManager />
    </section>
  );
}
