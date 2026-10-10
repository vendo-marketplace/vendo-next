import { Camera, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";

import { MAX_PRODUCT_IMAGES } from "@/features/products/components/create-product/form-utils";

type CreateProductImagesFieldProps = {
  images: File[];
  previews: string[];
  error: string;
  onAdd: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
};

export default function CreateProductImagesField({
  images,
  previews,
  error,
  onAdd,
  onRemove,
}: CreateProductImagesFieldProps) {
  return (
    <section className="rounded-2xl border border-stroke-primary-subtle bg-white p-5 shadow-[0_4px_24px_rgba(20,31,54,0.03)] sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#edf4ff] text-text-brand">
            <Camera aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="font-semibold">
              Фото товару <span className="text-text-brand">*</span>
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Перше фото буде обкладинкою оголошення.
            </p>
          </div>
        </div>
        <span className="hidden rounded-full bg-surface-primary-subtle px-2.5 py-1 text-xs text-text-tertiary sm:inline-flex">
          {images.length}/{MAX_PRODUCT_IMAGES}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {previews.map((src, index) => (
          <div
            key={`${images[index]?.name}-${index}`}
            className={`group relative aspect-square overflow-hidden rounded-xl border border-stroke-primary-subtle ${
              index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
            }`}
          >
            <Image
              src={src}
              alt={`Фото товару ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
            />
            {index === 0 && (
              <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                Обкладинка
              </span>
            )}
            <button
              type="button"
              aria-label={`Видалити фото ${index + 1}`}
              onClick={() => onRemove(index)}
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/95 text-text-primary opacity-100 shadow-sm transition sm:opacity-0 sm:group-hover:opacity-100"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ))}

        {images.length < MAX_PRODUCT_IMAGES && (
          <label
            className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed ${
              error
                ? "border-stroke-error bg-surface-error-subtle"
                : "border-[#c9d5e8] bg-[#fbfcff] hover:border-stroke-brand hover:bg-[#f4f8ff]"
            } transition ${images.length === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-white text-text-brand shadow-sm">
              <ImagePlus aria-hidden="true" className="size-5" />
            </span>
            <span className="text-sm font-medium">
              {images.length ? "Додати фото" : "Завантажити фото"}
            </span>
            <span className="text-center text-xs text-text-tertiary">
              PNG, JPG до 10 МБ
              <br />
              до {MAX_PRODUCT_IMAGES} фото
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={onAdd}
            />
          </label>
        )}
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-text-error">{error}</p>}
    </section>
  );
}
