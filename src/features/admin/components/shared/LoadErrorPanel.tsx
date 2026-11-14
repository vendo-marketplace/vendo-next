"use client";

import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";

type Props = {
  message: string;
  onRetry: () => void;
};

export const LoadErrorPanel = ({ message, onRetry }: Props) => {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-stroke-secondary bg-surface-primary px-6 py-12 text-center">
      <p className="text-text-secondary">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw aria-hidden="true" className="size-4" />
        {t("retry")}
      </Button>
    </div>
  );
};
