"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormErrorNotice } from "@/components/ui/form/form-error-notice";
import { FormField } from "@/components/ui/form/form-field";
import { Input } from "@/components/ui/input/input";
import type { Category } from "@/features/categories/types/category";
import { applyApiErrorToForm, SERVER_ERROR_KEY } from "@/utils/api-error";

import { useCreateCategory, useUpdateCategory } from "../../hooks/use-admin-categories";
import { useAutoSlug } from "../../hooks/use-auto-slug";
import { categoryFormSchema, type CategoryFormValues } from "../../schemas/category-schema";
import { AdminDialog } from "../shared/AdminDialog";
import { FormActions } from "../shared/FormActions";
import { AttributePicker } from "./AttributePicker";

export type CategoryFormMode =
  | { kind: "create"; parent: Category | null }
  | { kind: "edit"; category: Category };

type Props = {
  mode: CategoryFormMode | null;
  onClose: () => void;
  onCreated: (categoryId: string) => void;
};

const getModeKey = (mode: CategoryFormMode) =>
  mode.kind === "edit" ? `edit-${mode.category.id}` : `create-${mode.parent?.id ?? "root"}`;

export const CategoryFormDialog = ({ mode, onClose, onCreated }: Props) => {
  const t = useTranslations("Admin.categories.form");

  const getTitle = (current: CategoryFormMode) => {
    if (current.kind === "edit") return t("editTitle", { title: current.category.title });
    if (current.parent) return t("createChildTitle", { parent: current.parent.title });
    return t("createTitle");
  };

  return (
    <AdminDialog open={mode !== null} onClose={onClose} title={mode ? getTitle(mode) : ""}>
      {mode && (
        <CategoryForm
          key={getModeKey(mode)}
          mode={mode}
          onDone={onClose}
          onCreated={onCreated}
        />
      )}
    </AdminDialog>
  );
};

type CategoryFormProps = {
  mode: CategoryFormMode;
  onDone: () => void;
  onCreated: (categoryId: string) => void;
};

const getDefaultValues = (mode: CategoryFormMode): CategoryFormValues =>
  mode.kind === "edit"
    ? {
        title: mode.category.title,
        slug: mode.category.slug,
        attributes: mode.category.attributes.map(({ id }) => id),
      }
    : { title: "", slug: "", attributes: [] };

const CategoryForm = ({ mode, onDone, onCreated }: CategoryFormProps) => {
  const t = useTranslations("Admin.categories.form");
  const tForm = useTranslations("Admin.form");
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isEdit = mode.kind === "edit";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: getDefaultValues(mode),
  });

  const autoSlug = useAutoSlug({
    followTitle: !isEdit,
    setSlug: (slug) => setValue("slug", slug, { shouldDirty: true }),
  });
  const serverError = errors.root?.server?.message;

  const save = async ({ title, slug, attributes }: CategoryFormValues) => {
    if (mode.kind === "edit") {
      await updateCategory.mutateAsync({
        categoryId: mode.category.id,
        body: { title, slug, attributes },
      });
      toast.success(t("updated"));
      return;
    }

    const created = await createCategory.mutateAsync({
      title,
      slug,
      parentId: mode.parent?.id,
      attributes: attributes.length > 0 ? attributes : undefined,
    });
    toast.success(t("created", { title }));
    onCreated(created.id);
  };

  const submit = handleSubmit(async (values) => {
    try {
      await save(values);
      onDone();
    } catch (error) {
      applyApiErrorToForm(error, setError, {
        fields: ["title", "slug", "attributes"],
        fallback: isEdit ? t("updateError") : t("createError"),
      });
    }
  });

  return (
    <form
      noValidate
      onSubmit={submit}
      onChange={() => serverError && clearErrors(SERVER_ERROR_KEY)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
        {serverError && <FormErrorNotice message={serverError} />}

        <FormField id="category-title" label={tForm("title")} error={errors.title?.message} required>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              {...register("title", { onChange: autoSlug.onTitleChange })}
              clearable={false}
              autoComplete="off"
              placeholder={t("titlePlaceholder")}
            />
          )}
        </FormField>

        <FormField id="category-slug" label={tForm("slug")} error={errors.slug?.message} required>
          {(fieldProps) => (
            <>
              <Input
                {...fieldProps}
                {...register("slug", { onChange: autoSlug.onSlugChange })}
                clearable={false}
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                placeholder="smart_watches"
              />
              {autoSlug.isFollowing && (
                <p className="text-xs text-text-tertiary">{tForm("slugHint")}</p>
              )}
            </>
          )}
        </FormField>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-text-primary">{t("attributesLabel")}</span>
          <Controller
            control={control}
            name="attributes"
            render={({ field }) => (
              <AttributePicker
                value={field.value}
                onChange={field.onChange}
                assigned={isEdit ? mode.category.attributes : []}
              />
            )}
          />
          {errors.attributes?.message && (
            <p role="alert" className="text-xs text-text-error">
              {errors.attributes.message}
            </p>
          )}
        </div>
      </div>

      <FormActions
        isSubmitting={isSubmitting}
        disabled={isEdit && !isDirty}
        submitLabel={isEdit ? tForm("save") : tForm("create")}
      />
    </form>
  );
};
