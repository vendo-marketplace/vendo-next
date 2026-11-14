"use client";

import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";

type Props = {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  invalid: boolean;
  "aria-describedby"?: string;
};

// Comma-separated input adds several values at once; duplicates are skipped
// because the API requires unique values.
export const AllowedValuesInput = ({ id, value, onChange, invalid, ...aria }: Props) => {
  const t = useTranslations("Admin.attributes.form");
  const [draft, setDraft] = useState("");

  const add = () => {
    const next = draft
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (next.length === 0) return;

    onChange([...new Set([...value, ...next])]);
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          id={id}
          size="sm"
          invalid={invalid}
          aria-describedby={aria["aria-describedby"]}
          containerClassName="flex-1"
          placeholder={t("valuesPlaceholder")}
          value={draft}
          clearable={false}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            add();
          }}
        />
        <Button variant="outline" size="sm" onClick={add} disabled={!draft.trim()}>
          <Plus aria-hidden="true" className="size-4" />
          {t("addValue")}
        </Button>
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1 rounded-lg border border-stroke-primary-subtle bg-surface-secondary py-1 pr-1 pl-2.5 text-sm text-text-primary"
            >
              {item}
              <button
                type="button"
                aria-label={t("removeValue", { value: item })}
                onClick={() => onChange(value.filter((current) => current !== item))}
                className="grid size-5 place-items-center rounded text-text-tertiary hover:bg-surface-primary hover:text-text-primary"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
