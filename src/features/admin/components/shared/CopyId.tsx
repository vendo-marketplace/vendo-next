"use client";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { cn } from "@/utils/utils";

type Props = {
  id: string;
  className?: string;
};

// The id in monospace with a button that copies it.
export const CopyId = ({ id, className }: Props) => {
  const t = useTranslations("Admin");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success(t("idCopied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <span className={cn("inline-flex items-center gap-1 font-mono break-all", className)}>
      {id}
      <button
        type="button"
        aria-label={t("copyId")}
        onClick={() => void copy()}
        className="grid size-6 shrink-0 place-items-center rounded-md text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
      >
        <Copy aria-hidden="true" className="size-3.5" />
      </button>
    </span>
  );
};
