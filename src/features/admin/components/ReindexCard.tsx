"use client";

import { DatabaseZap } from "lucide-react";
import { useTranslations } from "next-intl";

import { useReindex } from "../hooks/use-reindex";
import { AdminActionCard } from "./AdminActionCard";

export const ReindexCard = () => {
  const t = useTranslations("Admin.reindex");
  const reindex = useReindex();

  return (
    <AdminActionCard
      mutation={reindex}
      icon={DatabaseZap}
      title={t("title")}
      description={t("description")}
      actionLabel={t("action")}
      pendingLabel={t("pending")}
      confirm={{
        title: t("confirmTitle"),
        text: t("confirmText"),
        actionLabel: t("confirm"),
      }}
      errorFallback={t("error")}
      getSuccessMessage={(time) => t("success", { time })}
    />
  );
};
