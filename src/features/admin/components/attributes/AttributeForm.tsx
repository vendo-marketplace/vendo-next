"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  Controller,
  useForm,
  type UseFormRegisterReturn,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";

import { FormErrorNotice } from "@/components/ui/form/form-error-notice";
import { FormField } from "@/components/ui/form/form-field";
import { Input } from "@/components/ui/input/input";
import type { CategoryAttribute } from "@/features/categories/types/category";
import { applyApiErrorToForm, SERVER_ERROR_KEY } from "@/utils/api-error";
import { cn } from "@/utils/utils";

import { useCreateAttribute, useUpdateAttribute } from "../../hooks/use-admin-attributes";
import { useAutoSlug } from "../../hooks/use-auto-slug";
import {
  ATTRIBUTE_TYPES,
  attributeFormSchema,
  type AttributeFormValues,
  typeNeedsValues,
} from "../../schemas/attribute-schema";
import { AllowedValuesInput } from "./AllowedValuesInput";

type FormState = {
  isSubmitting: boolean;
  isDirty: boolean;
};

type Props = {
  // Edits this attribute; creates a new one when omitted.
  attribute?: CategoryAttribute;
  onSaved?: (attribute: CategoryAttribute) => void;
  bodyClassName?: string;
  renderActions: (state: FormState) => ReactNode;
};

const EMPTY_VALUES: AttributeFormValues = {
  title: "",
  slug: "",
  type: "STRING",
  required: false,
  allowedValues: [],
};

const toFormValues = (attribute: CategoryAttribute | undefined): AttributeFormValues =>
  attribute
    ? {
        title: attribute.title,
        slug: attribute.slug,
        type: attribute.type,
        required: attribute.required,
        allowedValues: attribute.allowedValues ?? [],
      }
    : EMPTY_VALUES;

export const AttributeForm = ({ attribute, onSaved, bodyClassName, renderActions }: Props) => {
  const t = useTranslations("Admin.attributes.form");
  const tForm = useTranslations("Admin.form");
  const createAttribute = useCreateAttribute();
  const updateAttribute = useUpdateAttribute();
  const isEdit = attribute !== undefined;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeFormSchema),
    defaultValues: toFormValues(attribute),
  });

  const type = useWatch({ control, name: "type" });
  const autoSlug = useAutoSlug({
    followTitle: !isEdit,
    setSlug: (slug) => setValue("slug", slug, { shouldDirty: true }),
  });
  const serverError = errors.root?.server?.message;

  const save = async ({ type: selectedType, allowedValues, ...values }: AttributeFormValues) => {
    const body = {
      ...values,
      allowedValues: typeNeedsValues(selectedType) ? allowedValues : undefined,
    };

    if (attribute) {
      const updated = await updateAttribute.mutateAsync({ attributeId: attribute.id, body });
      toast.success(t("updated"));
      return updated;
    }

    const created = await createAttribute.mutateAsync({ ...body, type: selectedType });
    toast.success(t("created", { title: created.title }));
    reset(EMPTY_VALUES);
    autoSlug.restart();
    return created;
  };

  const submit = handleSubmit(async (values) => {
    try {
      onSaved?.(await save(values));
    } catch (error) {
      applyApiErrorToForm(error, setError, {
        fields: ["title", "slug", "type", "allowedValues"],
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
      <div className={cn("flex flex-col gap-5", bodyClassName)}>
        {serverError && <FormErrorNotice message={serverError} />}

        <FormField id="attribute-title" label={tForm("title")} error={errors.title?.message} required>
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

        <FormField id="attribute-slug" label={tForm("slug")} error={errors.slug?.message} required>
          {(fieldProps) => (
            <>
              <Input
                {...fieldProps}
                {...register("slug", { onChange: autoSlug.onSlugChange })}
                clearable={false}
                autoComplete="off"
                spellCheck={false}
                className="font-mono"
                placeholder="laptop_memory"
              />
              {autoSlug.isFollowing && (
                <p className="text-xs text-text-tertiary">{tForm("slugHint")}</p>
              )}
            </>
          )}
        </FormField>

        {isEdit ? (
          <LockedType value={type} />
        ) : (
          <TypeField value={type} registration={register("type")} />
        )}

        {typeNeedsValues(type) && (
          <FormField
            id="attribute-values"
            label={t("valuesLabel")}
            error={errors.allowedValues?.message ?? errors.allowedValues?.root?.message}
            required
          >
            {(fieldProps) => (
              <Controller
                control={control}
                name="allowedValues"
                render={({ field }) => (
                  <AllowedValuesInput {...fieldProps} value={field.value} onChange={field.onChange} />
                )}
              />
            )}
          </FormField>
        )}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-surface-brand"
            {...register("required")}
          />
          <span>
            <span className="block text-sm font-medium text-text-primary">{t("requiredLabel")}</span>
            <span className="block text-xs text-text-secondary">{t("requiredHint")}</span>
          </span>
        </label>
      </div>

      {renderActions({ isSubmitting, isDirty })}
    </form>
  );
};

type TypeFieldProps = {
  value: AttributeFormValues["type"];
  registration: UseFormRegisterReturn<"type">;
};

const TypeField = ({ value, registration }: TypeFieldProps) => {
  const t = useTranslations("Admin.attributes");

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-semibold text-text-primary">
        {t("form.typeLabel")}
        <span aria-hidden="true" className="ml-1 text-xs text-text-error">
          *
        </span>
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ATTRIBUTE_TYPES.map((option) => {
          const isSelected = option === value;

          return (
            <label
              key={option}
              className={cn(
                "flex cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2 transition-colors has-focus-visible:shadow-focus-brand",
                isSelected
                  ? "border-stroke-brand bg-surface-brand-subtle"
                  : "border-stroke-primary-subtle hover:border-stroke-brand-subtle",
              )}
            >
              <input type="radio" value={option} className="sr-only" {...registration} />
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-text-brand" : "text-text-primary",
                )}
              >
                {t(`types.${option}`)}
              </span>
              <span className="font-mono text-xs text-text-tertiary">{option}</span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-text-secondary">{t(`form.typeHints.${value}`)}</p>
    </fieldset>
  );
};

// The API does not allow changing the type of an existing attribute.
const LockedType = ({ value }: { value: AttributeFormValues["type"] }) => {
  const t = useTranslations("Admin.attributes");

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-text-primary">{t("form.typeLabel")}</span>
      <p className="text-sm text-text-primary">
        {t(`types.${value}`)} <span className="font-mono text-xs text-text-tertiary">{value}</span>
      </p>
      <p className="text-xs text-text-secondary">{t("form.typeLocked")}</p>
    </div>
  );
};
