"use client";

import { ChevronRight, ExternalLink, FolderTree, Info, Pencil, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import type { Category, CategoryAttribute } from "@/features/categories/types/category";
import { Link } from "@/i18n/navigation";

import { AttributeTypeBadge } from "../attributes/AttributeTypeBadge";
import { CopyId } from "../shared/CopyId";
import { CategoryImageField } from "./CategoryImageField";
import { CategoryTypeBadge } from "./CategoryTypeBadge";

type Props = {
  category: Category | undefined;
  trail: Category[];
  onSelect: (category: Category) => void;
  onEdit: (category: Category) => void;
  onAddChild: (parent: Category) => void;
};

const PANEL_CLASS_NAME = "rounded-2xl border border-stroke-secondary bg-surface-primary";

export const CategoryDetails = ({ category, trail, onSelect, onEdit, onAddChild }: Props) => {
  if (!category) return <NoSelection />;

  return (
    <section aria-labelledby="category-details-heading" className={PANEL_CLASS_NAME}>
      <DetailsHeader
        category={category}
        ancestors={trail.slice(0, -1)}
        onSelect={onSelect}
        onEdit={onEdit}
        onAddChild={onAddChild}
      />
      <div className="grid gap-6 p-5 lg:grid-cols-2">
        <CategoryImageField category={category} />
        <AttributesSection attributes={category.attributes} />
        <ChildrenSection category={category} onSelect={onSelect} />
      </div>
      <DetailsFooter category={category} root={trail[0]} />
    </section>
  );
};

const NoSelection = () => {
  const t = useTranslations("Admin.categories.details");

  return (
    <div
      className={`${PANEL_CLASS_NAME} flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center`}
    >
      <div className="mb-4 grid size-12 place-items-center rounded-full bg-surface-secondary text-text-tertiary">
        <FolderTree aria-hidden="true" className="size-6" />
      </div>
      <p className="font-semibold text-text-primary">{t("placeholderTitle")}</p>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{t("placeholderText")}</p>
    </div>
  );
};

type DetailsHeaderProps = Omit<Props, "category" | "trail"> & {
  category: Category;
  ancestors: Category[];
};

const DetailsHeader = ({
  category,
  ancestors,
  onSelect,
  onEdit,
  onAddChild,
}: DetailsHeaderProps) => {
  const t = useTranslations("Admin.categories.details");

  return (
    <header className="flex flex-col gap-4 border-b border-stroke-secondary p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {ancestors.length > 0 && (
          <nav aria-label={t("trail")} className="mb-2">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-text-tertiary">
              {ancestors.map((ancestor) => (
                <li key={ancestor.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    className="hover:text-text-brand"
                    onClick={() => onSelect(ancestor)}
                  >
                    {ancestor.title}
                  </button>
                  <ChevronRight aria-hidden="true" className="size-3" />
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <h3
            id="category-details-heading"
            className="text-xl font-semibold break-words text-text-primary"
          >
            {category.title}
          </h3>
          <CategoryTypeBadge type={category.type} />
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
          <dt className="text-text-tertiary">{t("slug")}</dt>
          <dd className="font-mono break-all text-text-primary">{category.slug}</dd>
          <dt className="text-text-tertiary">{t("id")}</dt>
          <dd className="text-text-primary">
            <CopyId id={category.id} />
          </dd>
        </dl>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
          <Pencil aria-hidden="true" className="size-4" />
          {t("edit")}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onAddChild(category)}>
          <Plus aria-hidden="true" className="size-4" />
          {t("addChild")}
        </Button>
      </div>
    </header>
  );
};

const AttributesSection = ({ attributes }: { attributes: CategoryAttribute[] }) => {
  const t = useTranslations("Admin.categories.details");

  return (
    <div className="flex flex-col gap-3">
      <SectionHeading count={attributes.length}>{t("attributes")}</SectionHeading>
      {attributes.length === 0 ? (
        <p className="text-sm text-text-secondary">{t("noAttributes")}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-stroke-secondary rounded-xl border border-stroke-secondary">
          {attributes.map((attribute) => (
            <li key={attribute.id} className="flex flex-col gap-1 px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-medium text-text-primary">{attribute.title}</span>
                <AttributeTypeBadge type={attribute.type} />
                {attribute.required && <Badge theme="warning">{t("required")}</Badge>}
              </div>
              {attribute.allowedValues && attribute.allowedValues.length > 0 && (
                <p className="text-xs text-text-secondary">
                  {t("values", { values: attribute.allowedValues.join(", ") })}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

type ChildrenSectionProps = {
  category: Category;
  onSelect: (category: Category) => void;
};

const ChildrenSection = ({ category, onSelect }: ChildrenSectionProps) => {
  const t = useTranslations("Admin.categories.details");

  return (
    <div className="flex flex-col gap-3 lg:col-span-2">
      <SectionHeading count={category.children.length}>{t("children")}</SectionHeading>
      {category.children.length === 0 ? (
        <p className="text-sm text-text-secondary">{t("noChildren")}</p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {category.children.map((child) => (
            <li key={child.id}>
              <button
                type="button"
                onClick={() => onSelect(child)}
                className="flex w-full items-center gap-2 rounded-lg border border-stroke-secondary px-3 py-2.5 text-left text-sm transition-colors hover:border-stroke-brand-subtle hover:bg-surface-brand-subtle"
              >
                <span className="min-w-0 flex-1 truncate font-medium text-text-primary">
                  {child.title}
                </span>
                <CategoryTypeBadge type={child.type} compact />
                <ChevronRight aria-hidden="true" className="size-4 text-text-tertiary" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

type SectionHeadingProps = {
  count: number;
  children: string;
};

const SectionHeading = ({ count, children }: SectionHeadingProps) => (
  <h4 className="text-sm font-semibold text-text-primary">
    {children} <span className="font-normal text-text-tertiary tabular-nums">· {count}</span>
  </h4>
);

type DetailsFooterProps = {
  category: Category;
  root: Category | undefined;
};

const DetailsFooter = ({ category, root }: DetailsFooterProps) => {
  const t = useTranslations("Admin.categories.details");
  // Public category pages live at /category/{root}/{category}; a root has none.
  const siteHref =
    root && root.id !== category.id ? `/category/${root.slug}/${category.slug}` : undefined;

  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke-secondary px-5 py-3 text-xs text-text-tertiary">
      <span className="flex items-center gap-1.5">
        <Info aria-hidden="true" className="size-3.5" />
        {t("noDelete")}
      </span>
      {siteHref && (
        <Link
          href={siteHref}
          target="_blank"
          className="flex items-center gap-1 font-medium text-text-brand hover:underline"
        >
          {t("openOnSite")}
          <ExternalLink aria-hidden="true" className="size-3.5" />
        </Link>
      )}
    </footer>
  );
};
