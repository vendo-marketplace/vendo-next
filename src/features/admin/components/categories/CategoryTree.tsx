"use client";

import {
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  ImageOff,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import type { Category } from "@/features/categories/types/category";
import { cn } from "@/utils/utils";

import { filterCategoryTree, walkCategories } from "../../lib/category-tree";
import { CategoryTypeBadge } from "./CategoryTypeBadge";

type Props = {
  categories: Category[];
  selectedId: string | null;
  expandedIds: ReadonlySet<string>;
  onExpandedChange: (expandedIds: ReadonlySet<string>) => void;
  isRefreshing: boolean;
  onSelect: (category: Category) => void;
  onRefresh: () => void;
  onCreateRoot: () => void;
};

export const CategoryTree = ({
  categories,
  selectedId,
  expandedIds,
  onExpandedChange,
  isRefreshing,
  onSelect,
  onRefresh,
  onCreateRoot,
}: Props) => {
  const t = useTranslations("Admin.categories.tree");
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;
  const visible = useMemo(
    () => filterCategoryTree(categories, query),
    [categories, query],
  );

  const toggle = (categoryId: string) => {
    const next = new Set(expandedIds);
    if (next.has(categoryId)) next.delete(categoryId);
    else next.add(categoryId);
    onExpandedChange(next);
  };

  const expandAll = () =>
    onExpandedChange(new Set(Array.from(walkCategories(categories), ({ id }) => id)));

  return (
    <section
      aria-labelledby="category-tree-heading"
      className="flex flex-col rounded-2xl border border-stroke-secondary bg-surface-primary"
    >
      <div className="flex items-center justify-between gap-2 border-b border-stroke-secondary px-4 py-3">
        <h3 id="category-tree-heading" className="font-semibold text-text-primary">
          {t("title")}
        </h3>
        <Button size="sm" onClick={onCreateRoot}>
          <Plus aria-hidden="true" className="size-4" />
          {t("newRoot")}
        </Button>
      </div>

      <div className="flex flex-col gap-2 px-4 pt-3">
        <Input
          aria-label={t("searchLabel")}
          placeholder={t("searchPlaceholder")}
          start={<Search />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
        />
        <div className="flex items-center gap-1">
          <Button variant="text-secondary" size="xs" onClick={expandAll} disabled={isSearching}>
            <ChevronsUpDown aria-hidden="true" className="size-3.5" />
            {t("expandAll")}
          </Button>
          <Button
            variant="text-secondary"
            size="xs"
            onClick={() => onExpandedChange(new Set())}
            disabled={isSearching}
          >
            <ChevronsDownUp aria-hidden="true" className="size-3.5" />
            {t("collapseAll")}
          </Button>
          <Button
            variant="text-secondary"
            size="xs"
            className="ml-auto"
            aria-label={t("refresh")}
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              aria-hidden="true"
              className={cn("size-3.5", isRefreshing && "animate-spin")}
            />
          </Button>
        </div>
      </div>

      <div className="max-h-[32rem] overflow-y-auto px-2 pt-1 pb-3 xl:max-h-[calc(100dvh-18rem)]">
        {visible.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-text-secondary">
            {isSearching ? t("noMatches", { query: query.trim() }) : t("empty")}
          </p>
        ) : (
          <ul role="tree" aria-labelledby="category-tree-heading">
            {visible.map((category) => (
              <TreeNode
                key={category.id}
                category={category}
                depth={0}
                selectedId={selectedId}
                isExpanded={(id) => isSearching || expandedIds.has(id)}
                onToggle={toggle}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

type TreeNodeProps = {
  category: Category;
  depth: number;
  selectedId: string | null;
  isExpanded: (categoryId: string) => boolean;
  onToggle: (categoryId: string) => void;
  onSelect: (category: Category) => void;
};

const TreeNode = ({
  category,
  depth,
  selectedId,
  isExpanded,
  onToggle,
  onSelect,
}: TreeNodeProps) => {
  const t = useTranslations("Admin.categories.tree");
  const hasChildren = category.children.length > 0;
  const open = hasChildren && isExpanded(category.id);
  const isSelected = category.id === selectedId;

  return (
    <li
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? open : undefined}
    >
      <div
        className={cn(
          "group flex items-center gap-1 rounded-lg pr-2 transition-colors",
          isSelected ? "bg-surface-brand-subtle" : "hover:bg-surface-secondary",
        )}
        style={{ paddingLeft: `${depth * 1}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={t("toggle", { title: category.title })}
            onClick={() => onToggle(category.id)}
            className="grid size-7 shrink-0 place-items-center rounded-md text-text-tertiary hover:text-text-primary"
          >
            <ChevronRight
              aria-hidden="true"
              className={cn("size-4 transition-transform", open && "rotate-90")}
            />
          </button>
        ) : (
          <span aria-hidden="true" className="size-7 shrink-0" />
        )}

        <button
          type="button"
          onClick={() => onSelect(category)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 py-2 text-left text-sm",
            isSelected ? "font-semibold text-text-brand" : "text-text-primary",
          )}
        >
          <span className="truncate">{category.title}</span>
          {!category.image && depth < 2 && (
            <ImageOff
              aria-label={t("noImage")}
              className="size-3.5 shrink-0 text-text-placeholder"
            />
          )}
          <span className="ml-auto flex shrink-0 items-center gap-1.5">
            {hasChildren && (
              <span className="text-xs text-text-tertiary tabular-nums">
                {category.children.length}
              </span>
            )}
            <CategoryTypeBadge type={category.type} compact />
          </span>
        </button>
      </div>

      {open && (
        <ul role="group">
          {category.children.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              selectedId={selectedId}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
