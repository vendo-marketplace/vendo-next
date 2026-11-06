import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input/input";
import type { CategoryOption } from "@/features/categories/types/category";
import { getCategoryIcon } from "@/features/categories/components/category-dropdown/category-icons";

type CreateProductCategoryPickerProps = {
  categories: CategoryOption[];
  selectedCategory?: CategoryOption;
  selectedCategoryTrail: CategoryOption[];
  isOpen: boolean;
  categoryError?: string;
  onSelect: (path: string[]) => void;
  onOpenChange: (isOpen: boolean) => void;
};

function RootCategoryIcon({
  categories,
  category,
}: {
  categories: CategoryOption[];
  category: CategoryOption;
}) {
  const Icon = getCategoryIcon(Math.max(categories.findIndex(({ id }) => id === category.id), 0));
  return <Icon aria-hidden="true" className="size-5" />;
}

export default function CreateProductCategoryPicker({
  categories,
  selectedCategory,
  selectedCategoryTrail,
  isOpen,
  categoryError,
  onSelect,
  onOpenChange,
}: CreateProductCategoryPickerProps) {
  const [browsePath, setBrowsePath] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const breadcrumbs = useMemo(() => {
    const trail: CategoryOption[] = [];
    let level = categories;

    for (const id of browsePath) {
      const selected = level.find((category) => category.id === id);
      if (!selected) break;

      trail.push(selected);
      level = selected.children;
    }

    return trail;
  }, [browsePath, categories]);

  const currentCategories = breadcrumbs.at(-1)?.children ?? categories;
  const selectedRootCategory = selectedCategoryTrail[0] ?? selectedCategory;
  const filteredCategories = currentCategories.filter((category) =>
    category.title.toLocaleLowerCase("uk").includes(search.trim().toLocaleLowerCase("uk")),
  );

  const selectCategory = (category: CategoryOption) => {
    if (category.type !== "CHILD" && category.children.length > 0) {
      setBrowsePath((current) => [...current, category.id]);
      setSearch("");
      return;
    }

    onSelect([...browsePath, category.id]);
    setBrowsePath([]);
    setSearch("");
    onOpenChange(false);
  };

  const reopen = () => {
    setBrowsePath([]);
    setSearch("");
    onOpenChange(true);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Категорія <span className="text-text-brand">*</span>
      </p>

      {selectedCategory && !isOpen ? (
        <div className="flex flex-col gap-3 rounded-xl border border-stroke-primary-subtle bg-[#fbfcff] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f1f5fb] text-text-brand">
              {selectedRootCategory?.image ? (
                <Image
                  src={selectedRootCategory.image.url}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              ) : (
                <RootCategoryIcon
                  categories={categories}
                  category={selectedRootCategory ?? selectedCategory}
                />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {selectedCategory.title}
              </p>
              {selectedCategoryTrail.length > 1 && (
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {selectedCategoryTrail.slice(0, -1).map((category, index) => (
                    <span key={category.id} className="inline-flex items-center gap-1">
                      {index > 0 && (
                        <ChevronRight
                          aria-hidden="true"
                          className="size-3.5 text-text-tertiary"
                        />
                      )}
                      <span className="rounded-md bg-white px-2 py-1 text-xs text-text-tertiary">
                        {category.title}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={reopen}
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg px-3 py-2 text-sm font-medium text-text-brand transition hover:bg-surface-brand-subtle sm:self-auto"
          >
            Змінити <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stroke-primary-subtle bg-white">
          <div className="border-b border-stroke-secondary p-3 sm:p-4">
            <div className="mb-3 flex min-h-7 items-center gap-2">
              {browsePath.length > 0 && (
                <button
                  type="button"
                  aria-label="Назад до попереднього рівня"
                  onClick={() => {
                    setBrowsePath((current) => current.slice(0, -1));
                    setSearch("");
                  }}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-primary-subtle hover:text-text-primary"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </button>
              )}
              <p className="text-sm font-medium">
                {breadcrumbs.length ? "Оберіть підкатегорію" : "З чого почнемо?"}
              </p>
              {breadcrumbs.length > 0 && (
                <div className="ml-auto hidden min-w-0 items-center gap-1 overflow-hidden sm:flex">
                  {breadcrumbs.map((category, index) => (
                    <span key={category.id} className="flex min-w-0 items-center gap-1">
                      {index > 0 && (
                        <ChevronRight
                          aria-hidden="true"
                          className="size-3.5 shrink-0 text-text-tertiary"
                        />
                      )}
                      <span className="max-w-32 truncate rounded-md bg-surface-primary-subtle px-2 py-1 text-xs text-text-tertiary">
                        {category.title}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Input
              size="sm"
              containerClassName="w-full min-w-0"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onClear={() => setSearch("")}
              placeholder="Знайти категорію"
              aria-label="Пошук категорії"
              start={<Search aria-hidden="true" className="size-4" />}
              className="h-5 px-3"
            />
            {filteredCategories.length > 5 && (
              <p className="mt-2 flex items-center gap-1 text-xs text-text-tertiary">
                <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
                {filteredCategories.length} категорій у списку — прокрутіть, щоб побачити всі
              </p>
            )}
          </div>

          <div className="max-h-[21rem] overscroll-contain overflow-y-auto p-2">
            {filteredCategories.length ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category)}
                  className="flex h-16 w-full shrink-0 items-center gap-3 rounded-lg px-3 text-left transition hover:bg-[#f4f7fc] focus-visible:bg-[#f4f7fc]"
                >
                  {browsePath.length === 0 && (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f1f5fb] text-text-brand">
                      {category.image ? (
                        <Image
                          src={category.image.url}
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 object-contain"
                        />
                      ) : (
                        <RootCategoryIcon categories={categories} category={category} />
                      )}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{category.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-text-tertiary">
                      {category.type !== "CHILD" && category.children.length
                        ? `${category.children.length} підкатегорій`
                        : "Обрати цю категорію"}
                    </span>
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-text-tertiary"
                  />
                </button>
              ))
            ) : (
              <p className="px-3 py-8 text-center text-sm text-text-tertiary">
                Нічого не знайдено. Спробуйте іншу назву.
              </p>
            )}
          </div>
        </div>
      )}

      {categoryError && <p role="alert" className="text-sm text-text-error">{categoryError}</p>}
    </div>
  );
}
