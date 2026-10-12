"use client";

import { Button } from "@/components/ui/button/button";
import { PinIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { ProductCardType } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";
import { CircleCheck, Heart, Recycle, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Props {
  card: ProductCardType;
  eager?: boolean;
  favorite: boolean;
  favoriteDisabled?: boolean;
  onToggleFavorite: () => void;
}

const ProductCard = ({
  card,
  eager = false,
  favorite,
  favoriteDisabled = false,
  onToggleFavorite,
}: Props) => {
  const { isNew, title, price, images, address, createdAt } = card;
  const t = useTranslations("Favorites");
  const attributeValues = card.attributes
    .flatMap((attribute) => attribute.values ?? [])
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 2);

  return (
    <article className="relative h-full w-full rounded-xl border border-stroke-primary-subtle bg-surface-primary p-3 shadow-xs transition-shadow hover:shadow-md">
      <Link
        href={`/product/${card.id}?q=${encodeURIComponent(title)}`}
        className="flex h-full flex-col"
      >
        <div className="relative aspect-[1.12/1] w-full shrink-0 overflow-hidden rounded-lg bg-surface-secondary">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              loading={eager ? "eager" : "lazy"}
              className="object-cover"
            />
          ) : (
            <span className="grid h-full place-items-center text-sm text-text-tertiary">
              Фото відсутнє
            </span>
          )}
        </div>

        <div className="flex w-full flex-1 flex-col px-2 pt-4">
          <h3 className="line-clamp-2 min-h-12 text-base leading-6 text-text-secondary">
            {title}
          </h3>
          <span className="mt-1 text-xl leading-7 font-semibold text-text-primary">
            {price} грн
          </span>

          <div className="mt-3 flex min-h-9 border-y border-stroke-secondary text-xs text-text-tertiary">
            <span
              className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 border-r border-stroke-secondary px-1.5 ${
                isNew ? "text-text-success" : "text-text-secondary"
              }`}
            >
              {isNew ? (
                <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
              ) : (
                <Recycle aria-hidden="true" className="size-4 shrink-0" />
              )}
              <span className="truncate">{isNew ? "Новий" : "Вживаний"}</span>
            </span>
            {attributeValues.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="flex min-w-0 flex-1 items-center justify-center gap-1 border-r border-stroke-secondary px-1.5 last:border-r-0"
              >
                <Sparkles aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">{value}</span>
              </span>
            ))}
          </div>

          <div className="mt-auto flex min-w-0 items-center gap-2 pt-3 text-xs leading-4 text-text-tertiary sm:text-sm">
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <PinIcon className="size-4 shrink-0 text-text-secondary" />
              <span className="truncate">{address.city}</span>
            </span>
            <span className="shrink-0">{formatRelativeTime(createdAt)}</span>
          </div>
        </div>
      </Link>

      <Button
        variant="none"
        size="none"
        disabled={favoriteDisabled}
        aria-label={t(favorite ? "removeLabel" : "addLabel")}
        aria-pressed={favorite}
        onClick={onToggleFavorite}
        className={`absolute top-3 right-3 z-10 size-10 rounded-full border border-stroke-primary-subtle bg-white/95 p-0 shadow-sm transition-transform hover:bg-white active:scale-90 ${favorite ? "text-text-error" : "text-text-secondary"}`}
      >
        <Heart
          aria-hidden="true"
          className={`size-[18px] transition-colors ${favorite ? "fill-current" : "fill-transparent"}`}
          strokeWidth={2.25}
        />
      </Button>
    </article>
  );
};

export default ProductCard;
