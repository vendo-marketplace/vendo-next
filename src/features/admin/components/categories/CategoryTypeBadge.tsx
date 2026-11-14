import { useTranslations } from "next-intl";

import { Badge, type BadgeTheme } from "@/components/ui/badge/badge";
import type { CategoryType } from "@/features/categories/types/category";

const THEME: Record<CategoryType, BadgeTheme> = {
  PARENT: "brand",
  SUB: "gray",
  CHILD: "success",
};

type Props = {
  type: CategoryType;
  // Shows the raw API value, for dense rows such as the tree.
  compact?: boolean;
};

export const CategoryTypeBadge = ({ type, compact = false }: Props) => {
  const t = useTranslations("Admin.categories.types");

  return (
    <Badge theme={THEME[type]} title={compact ? t(type) : undefined}>
      {compact ? type : t(type)}
    </Badge>
  );
};
