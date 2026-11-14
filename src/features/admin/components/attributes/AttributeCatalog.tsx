"use client";

import { LoaderCircle, Pencil, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import type {
  Category,
  CategoryAttribute,
  CategoryAttributeType,
} from "@/features/categories/types/category";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/utils/utils";

import { useAdminAttributes } from "../../hooks/use-admin-attributes";
import { useAdminCategoryTree } from "../../hooks/use-admin-categories";
import { getAttributeUsage } from "../../lib/category-tree";
import { ATTRIBUTE_TYPES } from "../../schemas/attribute-schema";
import { CopyId } from "../shared/CopyId";
import { LoadErrorPanel } from "../shared/LoadErrorPanel";
import { AttributeTypeBadge } from "./AttributeTypeBadge";

const SEARCH_DEBOUNCE_MS = 300;
const MAX_LISTED_CATEGORIES = 3;
const NO_USAGE: Category[] = [];

type Props = {
  highlightedId: string | null;
  onEdit: (attribute: CategoryAttribute) => void;
};

export const AttributeCatalog = ({ highlightedId, onEdit }: Props) => {
  const t = useTranslations("Admin.attributes.catalog");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<CategoryAttributeType | undefined>();
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const isFiltered = Boolean(debouncedSearch || type);

  const {
    data: attributes = [],
    isPending,
    isError,
    isFetching,
    refetch,
  } = useAdminAttributes({ search: debouncedSearch, type });
  const { data: tree } = useAdminCategoryTree();
  const usage = useMemo(() => getAttributeUsage(tree ?? []), [tree]);

  return (
    <section
      aria-labelledby="attribute-catalog-heading"
      className="rounded-2xl border border-stroke-secondary bg-surface-primary"
    >
      <header className="flex flex-col gap-3 border-b border-stroke-secondary px-5 py-4">
        <h3
          id="attribute-catalog-heading"
          className="flex items-center gap-2 font-semibold text-text-primary"
        >
          {t("title")}
          {!isPending && (
            <span className="font-normal text-text-tertiary tabular-nums">
              · {attributes.length}
            </span>
          )}
          {isFetching && !isPending && (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-text-tertiary" />
          )}
        </h3>
        <Input
          aria-label={t("searchPlaceholder")}
          placeholder={t("searchPlaceholder")}
          start={<Search />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
        />
        <TypeFilter value={type} onChange={setType} />
      </header>

      {isPending ? (
        <p className="px-5 py-10 text-center text-sm text-text-secondary">{t("loading")}</p>
      ) : isError ? (
        <div className="p-5">
          <LoadErrorPanel message={t("loadError")} onRetry={() => void refetch()} />
        </div>
      ) : attributes.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-text-secondary">
          {isFiltered ? t("noMatches") : t("empty")}
        </p>
      ) : (
        <ul className="divide-y divide-stroke-secondary">
          {attributes.map((attribute) => (
            <AttributeRow
              key={attribute.id}
              attribute={attribute}
              usedIn={usage.get(attribute.id) ?? NO_USAGE}
              isHighlighted={attribute.id === highlightedId}
              onEdit={() => onEdit(attribute)}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

type TypeFilterProps = {
  value: CategoryAttributeType | undefined;
  onChange: (value: CategoryAttributeType | undefined) => void;
};

const TypeFilter = ({ value, onChange }: TypeFilterProps) => {
  const t = useTranslations("Admin.attributes");

  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("catalog.typeFilter")}>
      <FilterChip active={value === undefined} onClick={() => onChange(undefined)}>
        {t("catalog.allTypes")}
      </FilterChip>
      {ATTRIBUTE_TYPES.map((type) => (
        <FilterChip
          key={type}
          active={value === type}
          onClick={() => onChange(value === type ? undefined : type)}
        >
          {t(`types.${type}`)}
        </FilterChip>
      ))}
    </div>
  );
};

type FilterChipProps = {
  active: boolean;
  onClick: () => void;
  children: string;
};

const FilterChip = ({ active, onClick, children }: FilterChipProps) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
      active
        ? "border-stroke-brand bg-surface-brand-subtle text-text-brand"
        : "border-stroke-primary-subtle text-text-secondary hover:text-text-primary",
    )}
  >
    {children}
  </button>
);

type AttributeRowProps = {
  attribute: CategoryAttribute;
  usedIn: Category[];
  isHighlighted: boolean;
  onEdit: () => void;
};

const AttributeRow = ({ attribute, usedIn, isHighlighted, onEdit }: AttributeRowProps) => {
  const t = useTranslations("Admin.attributes.catalog");

  return (
    <li
      className={cn(
        "flex flex-col gap-2 px-5 py-4 transition-colors",
        isHighlighted && "bg-surface-success-subtle",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <span className="font-medium text-text-primary">{attribute.title}</span>
          <AttributeTypeBadge type={attribute.type} theme="brand" />
          {attribute.required && <Badge theme="warning">{t("required")}</Badge>}
          {usedIn.length === 0 && <Badge theme="white">{t("unused")}</Badge>}
          {isHighlighted && <Badge theme="success">{t("new")}</Badge>}
        </div>
        <Button
          variant="text-secondary"
          size="xs"
          aria-label={t("edit", { title: attribute.title })}
          onClick={onEdit}
        >
          <Pencil aria-hidden="true" className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-tertiary">
        <span className="font-mono">{attribute.slug}</span>
        <CopyId id={attribute.id} />
      </div>

      {attribute.allowedValues && attribute.allowedValues.length > 0 && (
        <ul className="flex flex-wrap gap-1">
          {attribute.allowedValues.map((value) => (
            <li key={value}>
              <Badge>{value}</Badge>
            </li>
          ))}
        </ul>
      )}

      <UsageLine usedIn={usedIn} />
    </li>
  );
};

const UsageLine = ({ usedIn }: { usedIn: Category[] }) => {
  const t = useTranslations("Admin.attributes.catalog");

  if (usedIn.length === 0) {
    return <p className="text-xs text-text-secondary">{t("notUsed")}</p>;
  }

  const listed = usedIn.slice(0, MAX_LISTED_CATEGORIES);
  const hiddenCount = usedIn.length - listed.length;

  return (
    <p className="text-xs text-text-secondary">
      {t("usedIn", { count: usedIn.length })}{" "}
      <span className="text-text-primary">
        {listed.map(({ title }) => title).join(", ")}
        {hiddenCount > 0 && ` ${t("more", { count: hiddenCount })}`}
      </span>
    </p>
  );
};
