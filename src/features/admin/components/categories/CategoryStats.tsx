import { useTranslations } from "next-intl";

import type { CategoryTreeStats } from "../../lib/category-tree";

type Props = {
  stats: CategoryTreeStats;
  // Undefined while the attribute list is loading.
  attributesCount: number | undefined;
};

export const CategoryStats = ({ stats, attributesCount }: Props) => {
  const t = useTranslations("Admin.categories.stats");

  const items = [
    { label: t("total"), value: stats.total },
    { label: t("parents"), value: stats.byType.PARENT },
    { label: t("leaves"), value: stats.byType.CHILD },
    { label: t("withoutImage"), value: stats.withoutImage },
    { label: t("attributes"), value: attributesCount ?? "—" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl border border-stroke-secondary bg-surface-primary px-4 py-3"
        >
          <dt className="text-xs font-medium text-text-tertiary">{label}</dt>
          <dd className="mt-1 text-xl font-semibold text-text-primary tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};
