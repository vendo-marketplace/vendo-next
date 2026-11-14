"use client";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";

import { AdminDialogClose } from "./AdminDialog";

type Props = {
  isSubmitting: boolean;
  disabled?: boolean;
  submitLabel: string;
};

// Cancel + submit footer for forms inside AdminDialog.
export const FormActions = ({ isSubmitting, disabled = false, submitLabel }: Props) => {
  const t = useTranslations("Admin.form");

  return (
    <div className="flex flex-col-reverse gap-2 border-t border-stroke-secondary px-6 py-4 sm:flex-row sm:justify-end">
      <AdminDialogClose asChild>
        <Button variant="outline">{t("cancel")}</Button>
      </AdminDialogClose>
      <Button type="submit" disabled={isSubmitting || disabled}>
        {isSubmitting && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
        {isSubmitting ? t("saving") : submitLabel}
      </Button>
    </div>
  );
};
