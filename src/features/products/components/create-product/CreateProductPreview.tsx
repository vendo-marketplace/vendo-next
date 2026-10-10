import { ImagePlus, MapPin, Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";

import {
  formatProductPrice,
  type ProductDraft,
} from "@/features/products/components/create-product/form-utils";

type CreateProductPreviewProps = {
  draft: ProductDraft;
  previews: string[];
};

export default function CreateProductPreview({ draft, previews }: CreateProductPreviewProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <section className="overflow-hidden rounded-2xl border border-stroke-primary-subtle bg-white shadow-[0_4px_24px_rgba(20,31,54,0.04)]">
        <div className="flex items-center justify-between border-b border-stroke-secondary px-5 py-4">
          <div>
            <p className="text-sm font-semibold">Попередній перегляд</p>
            <p className="mt-0.5 text-xs text-text-tertiary">
              Так оголошення побачать люди
            </p>
          </div>
          <span className="rounded-full bg-surface-success-subtle px-2.5 py-1 text-[11px] font-medium text-text-success">
            Перегляд
          </span>
        </div>

        <div className="relative aspect-[4/3] bg-[#f1f3f6]">
          {previews[0] ? (
            <Image
              src={previews[0]}
              alt="Попередній перегляд товару"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-tertiary">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white">
                <ImagePlus aria-hidden="true" className="size-6" />
              </div>
              <span className="text-xs">Фото товару</span>
            </div>
          )}
          {previews.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-lg bg-black/55 px-2.5 py-1.5 text-xs font-medium text-white">
              +{previews.length - 1} фото
            </span>
          )}
        </div>

        <div className="p-5">
          <p className="min-h-6 line-clamp-2 font-medium">
            {draft.title || <span className="text-text-placeholder">Назва вашого товару</span>}
          </p>
          <p className="mt-2 text-xl font-semibold">
            {formatProductPrice(draft.price)} <span className="text-base">₴</span>
          </p>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-text-secondary">
            {draft.description || (
              <span className="text-text-placeholder">
                Короткий опис допоможе покупцеві зрозуміти, що ви продаєте.
              </span>
            )}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-stroke-secondary pt-3 text-xs text-text-tertiary">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5" />
              {draft.city || "Ваше місто"}
            </span>
            <span>{draft.condition === "new" ? "Новий" : "Вживаний"}</span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-[#dce8ff] bg-gradient-to-br from-[#f2f7ff] via-white to-[#f7f4ff] p-5">
        <div className="absolute -right-7 -top-7 size-24 rounded-full bg-[#e8efff] blur-2xl" />
        <div className="relative flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-text-brand shadow-sm">
            <WandSparkles aria-hidden="true" className="size-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">Створити ще простіше</p>
              <span className="rounded-full border border-[#d9def9] bg-white/80 px-2 py-0.5 text-[10px] font-medium text-[#7562c7]">
                Незабаром
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-text-secondary">
              Додамо ШІ-помічника, який запропонує назву, опис і характеристики за фото.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7562c7]">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Зараз усе під вашим контролем
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
