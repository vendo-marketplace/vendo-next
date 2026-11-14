"use client";

import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";

import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Category } from "@/features/categories/types/category";

import { useAdminAttributes } from "../../hooks/use-admin-attributes";
import { useAdminCategoryTree } from "../../hooks/use-admin-categories";
import {
  findCategoryById,
  findCategoryTrail,
  getCategoryTreeStats,
} from "../../lib/category-tree";
import { LoadErrorPanel } from "../shared/LoadErrorPanel";
import { CategoryDetails } from "./CategoryDetails";
import { CategoryFormDialog, type CategoryFormMode } from "./CategoryFormDialog";
import { CategoryStats } from "./CategoryStats";
import { CategoryTree } from "./CategoryTree";

// Below this width the details panel sits under the tree, so selecting a
// category scrolls it into view.
const STACKED_LAYOUT_QUERY = "(max-width: 1279px)";

const EMPTY_TREE: Category[] = [];

export const CategoriesManager = () => {
  const t = useTranslations("Admin.categories");
  const { data: tree = EMPTY_TREE, isPending, isError, refetch, isRefetching } =
    useAdminCategoryTree();
  const { data: attributes } = useAdminAttributes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set());
  const [formMode, setFormMode] = useState<CategoryFormMode | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => getCategoryTreeStats(tree), [tree]);
  const trail = useMemo(
    () => (selectedId ? findCategoryTrail(tree, selectedId) : []),
    [tree, selectedId],
  );
  const selected = selectedId ? findCategoryById(tree, selectedId) : undefined;

  // Selecting also opens the path to the category, so it is visible in the tree.
  const selectById = (categoryId: string) => {
    setSelectedId(categoryId);
    setExpandedIds((current) => {
      const ancestors = findCategoryTrail(tree, categoryId).slice(0, -1);
      return new Set([...current, ...ancestors.map(({ id }) => id)]);
    });

    if (window.matchMedia(STACKED_LAYOUT_QUERY).matches) {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showCreated = (categoryId: string) => {
    const parentId = formMode?.kind === "create" ? formMode.parent?.id : undefined;
    // The new category is not in the tree until it refetches, so open its parent
    // now; the details panel fills in once the fresh tree arrives.
    setExpandedIds((current) => (parentId ? new Set([...current, parentId]) : current));
    setSelectedId(categoryId);
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <LoadErrorPanel message={t("loadError")} onRetry={() => void refetch()} />;

  return (
    <div className="flex flex-col gap-5">
      <CategoryStats stats={stats} attributesCount={attributes?.length} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:items-start">
        <CategoryTree
          categories={tree}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          isRefreshing={isRefetching}
          onSelect={({ id }) => selectById(id)}
          onRefresh={() => void refetch()}
          onCreateRoot={() => setFormMode({ kind: "create", parent: null })}
        />

        <div ref={detailsRef} className="scroll-mt-24 xl:sticky xl:top-24">
          <CategoryDetails
            category={selected}
            trail={trail}
            onSelect={({ id }) => selectById(id)}
            onEdit={(category) => setFormMode({ kind: "edit", category })}
            onAddChild={(parent) => setFormMode({ kind: "create", parent })}
          />
        </div>
      </div>

      <CategoryFormDialog
        mode={formMode}
        onClose={() => setFormMode(null)}
        onCreated={showCreated}
      />
    </div>
  );
};
