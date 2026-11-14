"use client";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";
import type { CategoryAttribute } from "@/features/categories/types/category";

import { AttributeForm } from "./AttributeForm";

type Props = {
  onCreated: (attribute: CategoryAttribute) => void;
};

export const AttributeCreatePanel = ({ onCreated }: Props) => {
  const t = useTranslations("Admin.attributes.form");

  return (
    <section
      aria-labelledby="attribute-create-heading"
      className="rounded-2xl border border-stroke-secondary bg-surface-primary"
    >
      <header className="border-b border-stroke-secondary px-5 py-4">
        <h3 id="attribute-create-heading" className="font-semibold text-text-primary">
          {t("title")}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </header>

      <AttributeForm
        onSaved={onCreated}
        bodyClassName="p-5"
        renderActions={({ isSubmitting }) => (
          <div className="px-5 pb-5">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
              {isSubmitting ? t("creating") : t("submit")}
            </Button>
          </div>
        )}
      />
    </section>
  );
};
