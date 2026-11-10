"use client";

import { CircleCheck, Heart, MapPin, Recycle, Tag } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button/button";
import { Link } from "@/i18n/navigation";
import type { ProductCardType } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";
import { cn } from "@/utils/utils";

interface Props {
  card: ProductCardType;
  eager?: boolean;
  favorite: boolean;
  favoriteDisabled?: boolean;
  onToggleFavorite: () => void;
}

const MAX_ATTRIBUTE_BADGES = 2;

const formatPrice = (price: number) => `${price.toLocaleString("uk-UA")} грн`;

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
    .slice(0, MAX_ATTRIBUTE_BADGES);

  return (
    <article className="relative flex h-full w-full flex-col rounded-lg border border-stroke-primary-subtle bg-surface-primary px-2 pt-2 pb-1 shadow-xs transition-shadow hover:shadow-md">
      <Link
        href={`/product/${card.id}?q=${encodeURIComponent(title)}`}
        className="flex h-full flex-col rounded-lg"
      >
        <div className="relative aspect-[295/264] w-full shrink-0 overflow-hidden rounded-sm bg-surface-secondary">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 311px"
              loading={eager ? "eager" : "lazy"}
              className="object-cover"
            />
          ) : (
            <span className="grid h-full place-items-center text-sm text-text-tertiary">
              Фото відсутнє
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 px-2 pt-4">
          <h3 className="truncate font-sans text-md font-normal text-text-primary">{title}</h3>
          <p className="font-heading text-xl font-semibold text-text-primary">
            {formatPrice(price)}
          </p>
        </div>

        <ul className="mt-5 mb-1 flex border-y border-stroke-primary-subtle text-xs">
          <li
            className={cn(
              "flex min-w-0 flex-1 items-center gap-1.5 border-r border-stroke-primary-subtle py-2 pr-3 pl-2 last:border-r-0",
              isNew ? "font-medium text-text-success" : "text-text-secondary",
            )}
          >
            {isNew ? (
              <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
            ) : (
              <Recycle aria-hidden="true" className="size-4 shrink-0" />
            )}
            <span className="truncate">{isNew ? "Новий" : "Вживаний"}</span>
          </li>
          {attributeValues.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="flex min-w-0 flex-1 items-center gap-1.5 border-r border-stroke-primary-subtle py-2 pr-3 pl-2 text-text-secondary last:border-r-0"
            >
              <Tag aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex h-7 items-center gap-2 px-2 text-xs text-text-secondary">
          <span className="flex min-w-0 flex-1 items-center gap-1">
            <MapPin aria-hidden="true" className="size-4.5 shrink-0" />
            <span className="truncate">{address.city}</span>
          </span>
          <span className="shrink-0">{formatRelativeTime(createdAt)}</span>
        </div>
      </Link>

      <Button
        variant="none"
        size="none"
        disabled={favoriteDisabled}
        aria-label={t(favorite ? "removeLabel" : "addLabel")}
        aria-pressed={favorite}
        onClick={onToggleFavorite}
        className="absolute top-3 right-4 z-10 size-8 rounded-full border border-surface-brand-subtle bg-surface-brand-subtle p-0 text-text-brand shadow-sm transition-transform active:scale-90"
      >
        <Heart
          aria-hidden="true"
          className={cn("size-4 transition-colors", favorite ? "fill-current" : "fill-transparent")}
          strokeWidth={2.25}
        />
      </Button>
    </article>
  );
};

export default ProductCard;
