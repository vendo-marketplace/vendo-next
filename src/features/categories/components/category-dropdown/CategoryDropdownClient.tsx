"use client";

import { ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Grid4Icon } from "@/assets/icons/Grid4Icon";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";
import { useCatalogDialog } from "../../hooks/use-catalog-dialog";
import type { CategoryOption } from "../../types/category";
import { CategoryIcon } from "./category-icons";

interface CategoryDropdownClientProps {
  categories: CategoryOption[];
  unavailable?: boolean;
}

const categoryHref = (parentSlug: string, categorySlug: string) =>
  `/category/${encodeURIComponent(parentSlug)}/${encodeURIComponent(categorySlug)}`;

function CategoryBranch({
  category,
  parentSlug,
  onNavigate,
  openPath,
  level,
  onToggle,
}: {
  category: CategoryOption;
  parentSlug: string;
  onNavigate: () => void;
  openPath: string[];
  level: number;
  onToggle: (categoryId: string, level: number) => void;
}) {
  if (category.type === "CHILD") {
    return (
      <Link
        href={categoryHref(parentSlug, category.slug)}
        onClick={onNavigate}
        className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-text-primary transition-colors hover:bg-surface-secondary-brand hover:text-text-brand"
      >
        <span>{category.title}</span>
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-text-tertiary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text-brand"
        />
      </Link>
    );
  }

  if (category.children.length === 0) {
    return (
      <span className="block rounded-lg px-2 py-2 text-sm text-text-secondary">
        {category.title}
      </span>
    );
  }

  const isExpanded = openPath[level] === category.id;
  const childrenId = `category-children-${category.id}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={childrenId}
        onClick={() => onToggle(category.id, level)}
        className="group flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-secondary-brand hover:text-text-brand"
      >
        <span>{category.title}</span>
        <ChevronRight
          aria-hidden="true"
          className={`size-4 shrink-0 text-text-tertiary transition-transform duration-200 group-hover:text-text-brand ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>
      <div
        id={childrenId}
        aria-hidden={!isExpanded}
        inert={!isExpanded}
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden pl-3">
          <div className="grid border-l border-stroke-secondary pl-2">
            {category.children.map((child) => (
              <CategoryBranch
                key={child.id}
                category={child}
                parentSlug={parentSlug}
                onNavigate={onNavigate}
                openPath={openPath}
                level={level + 1}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const OPEN_CATALOG_EVENT = "vendo:toggle-catalog";

export default function CategoryDropdownClient({
  categories,
  unavailable = false,
}: CategoryDropdownClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    categories[0]?.id ?? null,
  );
  const [openPath, setOpenPath] = useState<string[]>([]);
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    categories[0];

  const toggleCategory = (categoryId: string, level: number) => {
    setOpenPath((current) =>
      current[level] === categoryId
        ? current.slice(0, level)
        : [...current.slice(0, level), categoryId],
    );
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setOpenPath([]);
  };

  // Phones open the catalog from the bottom menu, which has no access to this state.
  useEffect(() => {
    const toggle = () => setIsOpen((open) => !open);
    window.addEventListener(OPEN_CATALOG_EVENT, toggle);
    return () => window.removeEventListener(OPEN_CATALOG_EVENT, toggle);
  }, []);

  useCatalogDialog({
    isOpen,
    onClose: () => setIsOpen(false),
    dialogRef,
    triggerRef,
  });

  return (
    <>
      <div ref={triggerRef} className="hidden w-fit md:block">
        <Button
          variant="secondary"
          title="Каталог товарів"
          aria-label="Каталог товарів"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls="catalog-dialog"
          onClick={() => setIsOpen((open) => !open)}
          className={cn(
            "h-10 gap-1.5 px-3 font-medium lg:px-5",
            isOpen && "border-stroke-brand",
          )}
        >
          <Grid4Icon size={16} />
          <span className="hidden lg:inline">Каталог</span>
        </Button>
      </div>

      {isOpen && (
        <div className="page-container fixed inset-x-0 top-14 z-50 md:top-19">
          <section
            role="dialog"
            id="catalog-dialog"
            aria-modal="true"
            aria-label="Каталог товарів"
            tabIndex={-1}
            ref={dialogRef}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), select:not([disabled])',
              );
              const first = focusable.item(0);
              const last = focusable.item(focusable.length - 1);

              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (
                !event.shiftKey &&
                (document.activeElement === last ||
                  document.activeElement === event.currentTarget)
              ) {
                event.preventDefault();
                first?.focus();
              }
            }}
            className="flex max-h-[calc(100dvh-3.5rem-6rem)] w-full flex-col overflow-hidden rounded-b-xl bg-surface-primary shadow-2xl md:max-h-[calc(100dvh-4.75rem-1rem)]"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-stroke-secondary px-4 py-2 sm:px-5 md:hidden">
              <p className="text-base font-semibold text-text-primary">
                Каталог
              </p>
              <button
                type="button"
                aria-label="Закрити каталог"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-text-secondary hover:bg-surface-secondary"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            {unavailable ? (
              <p className="p-6 text-sm text-text-secondary">
                Не вдалося завантажити категорії. Спробуйте оновити сторінку.
              </p>
            ) : categories.length === 0 ? (
              <p className="p-6 text-sm text-text-secondary">
                Категорії поки відсутні.
              </p>
            ) : (
              <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto overscroll-contain md:grid-cols-[260px_minmax(0,1fr)] md:overflow-hidden lg:grid-cols-[300px_minmax(0,1fr)]">
                <div className="hidden min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain border-r border-stroke-secondary p-4 pb-8 md:block lg:p-5 lg:pb-8">
                  <nav
                    aria-label="Основні категорії"
                    className="grid grid-cols-[minmax(0,1fr)] gap-1"
                  >
                    {categories.map((category, index) => {
                      const isSelected = category.id === selectedCategory?.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => selectCategory(category.id)}
                          aria-current={isSelected ? "true" : undefined}
                          className={`flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-surface-secondary-brand font-semibold text-text-brand"
                              : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                          }`}
                        >
                          {category.image ? (
                            <Image
                              src={category.image.url}
                              alt=""
                              width={24}
                              height={24}
                              className="size-6 shrink-0 object-contain"
                            />
                          ) : (
                            <CategoryIcon index={index} aria-hidden="true" className="size-5 shrink-0" />
                          )}
                          <span className="min-w-0 flex-1 leading-snug break-words">
                            {category.title}
                          </span>
                          <ChevronRight
                            aria-hidden="true"
                            className="size-4 shrink-0"
                          />
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="min-h-0 p-4 pb-8 md:overflow-y-auto md:overscroll-contain md:p-6 md:pb-8 lg:p-8">
                  <label className="mb-5 grid gap-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary md:hidden">
                    Основна категорія
                    <select
                      value={selectedCategory?.id ?? ""}
                      onChange={(event) => selectCategory(event.target.value)}
                      className="h-11 w-full rounded-lg border border-stroke-primary bg-surface-primary px-3 text-sm font-medium normal-case tracking-normal text-text-primary"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  {selectedCategory && (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
                      {selectedCategory.children.length > 0 ? (
                        selectedCategory.children.map((subcategory) => (
                          <section key={subcategory.id}>
                            <h2 className="px-2 py-2.5 text-sm font-semibold text-text-primary">
                              {subcategory.title}
                            </h2>
                            {subcategory.children.length > 0 && (
                              <div className="mt-1 grid">
                                {subcategory.children.map((child) => (
                                  <CategoryBranch
                                    key={child.id}
                                    category={child}
                                    parentSlug={selectedCategory.slug}
                                    onNavigate={() => setIsOpen(false)}
                                    openPath={openPath}
                                    level={0}
                                    onToggle={toggleCategory}
                                  />
                                ))}
                              </div>
                            )}
                          </section>
                        ))
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
