"use client";

import { Check, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input/input";
import type { CategoryAttribute } from "@/features/categories/types/category";
import { cn } from "@/utils/utils";

import { useAdminAttributes } from "../../hooks/use-admin-attributes";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  // Already-assigned attributes, so their chips have titles before the list loads.
  assigned: CategoryAttribute[];
};

export const AttributePicker = ({ value, onChange, assigned }: Props) => {
  const t = useTranslations("Admin.categories.picker");
  const { data: attributes = [], isPending, isError } = useAdminAttributes();
  const [query, setQuery] = useState("");

  const titles = useMemo(
    () => new Map([...assigned, ...attributes].map(({ id, title }) => [id, title])),
    [assigned, attributes],
  );
  const selected = new Set(value);
  const normalizedQuery = query.trim().toLocaleLowerCase("uk");
  const matches = attributes.filter(
    ({ title, slug }) =>
      !normalizedQuery ||
      title.toLocaleLowerCase("uk").includes(normalizedQuery) ||
      slug.includes(normalizedQuery),
  );

  const toggle = (attributeId: string) =>
    onChange(
      selected.has(attributeId)
        ? value.filter((id) => id !== attributeId)
        : [...value, attributeId],
    );

  return (
    <div className="flex flex-col gap-3">
      {value.length === 0 ? (
        <p className="text-sm text-text-secondary">{t("none")}</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((attributeId) => {
            const title = titles.get(attributeId) ?? attributeId;

            return (
              <li
                key={attributeId}
                className="flex items-center gap-1 rounded-lg border border-stroke-brand-subtle bg-surface-brand-subtle py-1 pr-1 pl-2.5 text-sm text-text-brand"
              >
                {title}
                <button
                  type="button"
                  aria-label={t("remove", { title })}
                  onClick={() => toggle(attributeId)}
                  className="grid size-5 place-items-center rounded hover:bg-surface-primary"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="rounded-xl border border-stroke-secondary">
        <div className="border-b border-stroke-secondary p-2">
          <Input
            size="sm"
            aria-label={t("search")}
            placeholder={t("search")}
            start={<Search />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
          />
        </div>
        <ul className="max-h-52 overflow-y-auto p-1">
          {isPending ? (
            <PickerNote>{t("loading")}</PickerNote>
          ) : isError ? (
            <PickerNote>{t("loadError")}</PickerNote>
          ) : matches.length === 0 ? (
            <PickerNote>{attributes.length === 0 ? t("empty") : t("noMatches")}</PickerNote>
          ) : (
            matches.map((attribute) => (
              <AttributeOption
                key={attribute.id}
                attribute={attribute}
                checked={selected.has(attribute.id)}
                onToggle={() => toggle(attribute.id)}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const PickerNote = ({ children }: { children: string }) => (
  <li className="px-3 py-3 text-sm text-text-secondary">{children}</li>
);

type AttributeOptionProps = {
  attribute: CategoryAttribute;
  checked: boolean;
  onToggle: () => void;
};

const AttributeOption = ({ attribute, checked, onToggle }: AttributeOptionProps) => {
  const t = useTranslations("Admin");

  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-surface-secondary"
      >
        <span
          aria-hidden="true"
          className={cn(
            "grid size-4 shrink-0 place-items-center rounded border",
            checked
              ? "border-stroke-brand bg-surface-brand text-text-invert"
              : "border-stroke-primary bg-surface-primary",
          )}
        >
          {checked && <Check className="size-3" />}
        </span>
        <span className="min-w-0 flex-1 truncate text-text-primary">{attribute.title}</span>
        <span className="shrink-0 text-xs text-text-tertiary">
          {t(`attributes.types.${attribute.type}`)}
          {attribute.required && ` · ${t("categories.details.required")}`}
        </span>
      </button>
    </li>
  );
};
