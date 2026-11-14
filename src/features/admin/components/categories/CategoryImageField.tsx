"use client";

import { ImageOff, LoaderCircle, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ChangeEvent, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button/button";
import type { Category } from "@/features/categories/types/category";
import { getApiErrorMessage } from "@/utils/api-error";

import {
  useRemoveCategoryImage,
  useUploadCategoryImage,
} from "../../hooks/use-admin-categories";
import { ConfirmDialog } from "../shared/ConfirmDialog";

type Props = {
  category: Category;
};

export const CategoryImageField = ({ category }: Props) => {
  const t = useTranslations("Admin.categories.image");
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadCategoryImage();
  const remove = useRemoveCategoryImage();
  const isBusy = upload.isPending || remove.isPending;

  const uploadSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    // Reset so picking the same file again still fires `change`.
    event.target.value = "";
    if (!image) return;

    upload.mutate(
      { categoryId: category.id, image },
      {
        onSuccess: () => toast.success(t("uploaded")),
        onError: (error) => toast.error(getApiErrorMessage(error, t("uploadError"))),
      },
    );
  };

  const removeImage = () =>
    remove.mutate(category.id, {
      onSuccess: () => toast.success(t("removed")),
      onError: (error) => toast.error(getApiErrorMessage(error, t("removeError"))),
    });

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-text-primary">{t("title")}</h4>
      <div className="flex items-center gap-4">
        <ImagePreview category={category} isUploading={upload.isPending} />

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isBusy}
              onClick={() => inputRef.current?.click()}
            >
              <Upload aria-hidden="true" className="size-4" />
              {upload.isPending ? t("uploading") : category.image ? t("replace") : t("upload")}
            </Button>
            {category.image && (
              <ConfirmDialog
                destructive
                onConfirm={removeImage}
                copy={{
                  title: t("confirmTitle"),
                  text: t("confirmText", { title: category.title }),
                  actionLabel: t("confirm"),
                }}
              >
                <Button size="sm" variant="error-outline" disabled={isBusy}>
                  <Trash2 aria-hidden="true" className="size-4" />
                  {t("remove")}
                </Button>
              </ConfirmDialog>
            )}
          </div>
          <p className="text-xs text-text-tertiary">{t("hint")}</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={uploadSelectedFile}
        />
      </div>
    </div>
  );
};

type ImagePreviewProps = {
  category: Category;
  isUploading: boolean;
};

const ImagePreview = ({ category, isUploading }: ImagePreviewProps) => {
  const t = useTranslations("Admin.categories.image");

  return (
    <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-stroke-secondary bg-surface-secondary">
      {isUploading ? (
        <LoaderCircle aria-hidden="true" className="size-6 animate-spin text-text-tertiary" />
      ) : category.image ? (
        // Category images are SVG icons on S3; next/image adds nothing here.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={category.image.url} alt="" className="size-full object-contain p-3" />
      ) : (
        <ImageOff aria-label={t("empty")} className="size-6 text-text-placeholder" />
      )}
    </div>
  );
};
