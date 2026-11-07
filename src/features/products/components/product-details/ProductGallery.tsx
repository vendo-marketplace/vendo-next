import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge/badge";
import type { ProductCardType } from "@/types/product";

type Props = {
  product: ProductCardType;
  activeImage: number;
  onSelectImage: (index: number) => void;
};

export default function ProductGallery({
  product,
  activeImage,
  onSelectImage,
}: Props) {
  const images = product.images.filter(Boolean);
  const image = images[activeImage] ?? images[0];

  return (
    <div className="min-w-0">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-stroke-secondary bg-surface-primary shadow-[0_2px_12px_rgba(20,31,54,0.04)] sm:aspect-[16/11]">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-contain p-3 sm:p-6"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-text-tertiary">
            Фото товару відсутнє
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge theme={product.isNew ? "brand" : "gray"} size="lg">
            {product.isNew ? "Новий" : "Вживаний"}
          </Badge>
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Попереднє фото"
              onClick={() =>
                onSelectImage((activeImage - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-stroke-secondary bg-white/90 text-text-primary shadow-sm transition hover:bg-white"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Наступне фото"
              onClick={() => onSelectImage((activeImage + 1) % images.length)}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-stroke-secondary bg-white/90 text-text-primary shadow-sm transition hover:bg-white"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
            <span className="absolute bottom-4 right-4 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
              {activeImage + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              aria-label={`Показати фото ${index + 1}`}
              aria-pressed={activeImage === index}
              onClick={() => onSelectImage(index)}
              className={`relative size-20 shrink-0 overflow-hidden rounded-xl border bg-surface-primary transition ${
                activeImage === index
                  ? "border-2 border-stroke-brand"
                  : "border-stroke-secondary hover:border-stroke-brand"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
