"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import type { CategoryOption } from "@/features/categories/types/category";
import CreateProductCategoryPicker from "@/features/products/components/create-product/CreateProductCategoryPicker";
import type {
  AutoSearchFilters,
  AutoSearchFormValues,
  UpdatableAutoSearchStatus,
} from "@/features/auto-search/types/auto-search";

type Props = {
  categories: CategoryOption[];
  initialValues?: AutoSearchFormValues;
  isEditing?: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (filters: AutoSearchFilters, status: UpdatableAutoSearchStatus) => Promise<void>;
};

const defaultExpirationDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const minimumExpirationDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const findCategoryPath = (
  categories: CategoryOption[],
  categoryId: string,
): string[] => {
  for (const category of categories) {
    if (category.id === categoryId) return [category.id];

    const childPath = findCategoryPath(category.children, categoryId);
    if (childPath.length) return [category.id, ...childPath];
  }
  return [];
};

const getCategoryTrail = (categories: CategoryOption[], path: string[]) => {
  const trail: CategoryOption[] = [];
  let level = categories;

  for (const categoryId of path) {
    const category = level.find(({ id }) => id === categoryId);
    if (!category) break;
    trail.push(category);
    level = category.children;
  }

  return trail;
};

export default function AutoSearchForm({
  categories,
  initialValues,
  isEditing = false,
  isSaving,
  onCancel,
  onSave,
}: Props) {
  const t = useTranslations("AutoSearch");
  const [values, setValues] = useState<AutoSearchFormValues>(
    initialValues ?? {
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      city: "",
      expirationDate: defaultExpirationDate(),
      status: "ACTIVE",
    },
  );
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(
    !initialValues?.categoryId,
  );
  const [error, setError] = useState("");
  const categoryPath = useMemo(
    () => findCategoryPath(categories, values.categoryId),
    [categories, values.categoryId],
  );
  const selectedCategoryTrail = useMemo(
    () => getCategoryTrail(categories, categoryPath),
    [categories, categoryPath],
  );
  const selectedCategory = selectedCategoryTrail.at(-1);

  const update = (field: keyof AutoSearchFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: field === "status" ? (value as UpdatableAutoSearchStatus) : value,
    }));
    setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const minPrice = values.minPrice.trim() ? Number(values.minPrice) : undefined;
    const maxPrice = values.maxPrice.trim() ? Number(values.maxPrice) : undefined;
    const expirationDate = new Date(values.expirationDate);

    if (!isEditing && !values.categoryId) {
      setError(t("categoryRequired"));
      return;
    }
    if (
      !isEditing &&
      (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) ||
      !isEditing &&
      (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))
    ) {
      setError(t("priceInvalid"));
      return;
    }
    if (
      !isEditing &&
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      setError(t("priceOrder"));
      return;
    }
    if (!Number.isFinite(expirationDate.getTime()) || expirationDate <= new Date()) {
      setError(t("expirationInvalid"));
      return;
    }

    const hasPriceRange = minPrice !== undefined || maxPrice !== undefined;
    const filters: AutoSearchFilters = {
      categoryId: values.categoryId,
      ...(hasPriceRange && { priceRange: { minPrice, maxPrice } }),
      ...(values.city.trim() && { address: { city: values.city.trim() } }),
      expirationDate: expirationDate.toISOString(),
    };

    try {
      await onSave(filters, values.status);
    } catch {
      setError(t("saveError"));
    }
  };

  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="rounded-2xl border border-stroke-primary-subtle bg-surface-primary p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {isEditing ? t("editTitle") : t("createTitle")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t(isEditing ? "editFormDescription" : "formDescription")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {!isEditing && (
          <>
            <div className="sm:col-span-2">
              <CreateProductCategoryPicker
                categories={categories}
                selectedCategory={selectedCategory}
                selectedCategoryTrail={selectedCategoryTrail}
                isOpen={isCategoryPickerOpen}
                onOpenChange={setIsCategoryPickerOpen}
                onSelect={(path) => {
                  update("categoryId", path.at(-1) ?? "");
                  setIsCategoryPickerOpen(false);
                }}
              />
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-sm font-medium">{t("priceRange")}</legend>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.minPrice}
                  onChange={(event) => update("minPrice", event.target.value)}
                  placeholder={t("fromPrice")}
                  aria-label={t("fromPrice")}
                  className="h-11"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.maxPrice}
                  onChange={(event) => update("maxPrice", event.target.value)}
                  placeholder={t("toPrice")}
                  aria-label={t("toPrice")}
                  className="h-11"
                />
              </div>
            </fieldset>

            <label className="flex flex-col gap-2 text-sm font-medium">
              {t("cityOptional")}
              <Input
                value={values.city}
                onChange={(event) => update("city", event.target.value)}
                placeholder={t("cityPlaceholder")}
                className="h-11"
              />
            </label>
          </>
        )}

        <label className="flex flex-col gap-2 text-sm font-medium">
          {t("expiration")}
          <Input
            type="datetime-local"
            min={minimumExpirationDate()}
            required
            value={values.expirationDate}
            onChange={(event) => update("expirationDate", event.target.value)}
            className="h-11"
          />
        </label>

        {isEditing && (
          <label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
            {t("status")}
            <select
              value={values.status}
              onChange={(event) => update("status", event.target.value)}
              className="h-11 w-full rounded-lg border border-stroke-primary bg-surface-primary px-3 text-sm font-normal text-text-primary outline-none focus:border-stroke-brand"
            >
              <option value="ACTIVE">{t("active")}</option>
              <option value="CANCELLED">{t("paused")}</option>
            </select>
          </label>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-text-error">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving} className="min-h-11 px-5">
          {isSaving ? t("saving") : isEditing ? t("saveChanges") : t("create")}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="min-h-11">
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
