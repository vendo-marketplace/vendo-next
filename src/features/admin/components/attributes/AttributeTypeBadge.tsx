import { useTranslations } from "next-intl";

import { Badge, type BadgeTheme } from "@/components/ui/badge/badge";
import type { CategoryAttributeType } from "@/features/categories/types/category";

type Props = {
  type: CategoryAttributeType;
  theme?: BadgeTheme;
};

export const AttributeTypeBadge = ({ type, theme = "gray" }: Props) => {
  const t = useTranslations("Admin.attributes.types");

  return <Badge theme={theme}>{t(type)}</Badge>;
};
