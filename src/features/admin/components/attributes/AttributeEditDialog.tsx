"use client";

import { useTranslations } from "next-intl";

import type { CategoryAttribute } from "@/features/categories/types/category";

import { AdminDialog } from "../shared/AdminDialog";
import { FormActions } from "../shared/FormActions";
import { AttributeForm } from "./AttributeForm";

type Props = {
  attribute: CategoryAttribute | null;
  onClose: () => void;
};

export const AttributeEditDialog = ({ attribute, onClose }: Props) => {
  const t = useTranslations("Admin");

  return (
    <AdminDialog
      open={attribute !== null}
      onClose={onClose}
      title={attribute ? t("attributes.form.editTitle", { title: attribute.title }) : ""}
    >
      {attribute && (
        <AttributeForm
          key={attribute.id}
          attribute={attribute}
          onSaved={onClose}
          bodyClassName="min-h-0 overflow-y-auto px-6 py-5"
          renderActions={({ isSubmitting, isDirty }) => (
            <FormActions
              isSubmitting={isSubmitting}
              disabled={!isDirty}
              submitLabel={t("form.save")}
            />
          )}
        />
      )}
    </AdminDialog>
  );
};
