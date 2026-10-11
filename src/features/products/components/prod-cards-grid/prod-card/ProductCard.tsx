"use client";

import { AiIcon } from "@/assets/icons";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { PinIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { ProductCardType } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";
import { Heart } from "lucide-react";
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

  return (
    <article className="border-stroke-primary-subtle relative h-full w-full rounded-[8px] border bg-surface-primary p-4 pb-8 shadow-xs transition-shadow hover:shadow-md">
      <Link
        href={`/product/${card.id}?q=${encodeURIComponent(title)}`}
        className="flex h-full flex-col"
      >
        <div className="relative h-50 w-full shrink-0 overflow-hidden rounded-lg">
          <Image
            src={images[0]}
            alt={title}
            fill
            sizes="200px"
            loading={eager ? "eager" : "lazy"}
            className="object-contain"
          />
          <Badge
            size="sm"
            theme={isNew ? "brand" : "gray"}
            className="absolute top-1 left-1 rounded-full px-2!"
            leading={<AiIcon />}
          >
            {isNew ? "Новий" : "Вживаний"}
          </Badge>
        </div>

        <div className="flex w-full flex-1 flex-col pt-4">
          <div className="flex w-full flex-1 flex-col gap-2 pt-2">
            <h3 className="line-clamp-2 text-[14px] leading-5">{title}</h3>
            <span className="text-[20px] leading-7.5 font-semibold">
              {price} грн
            </span>
            <div className="border-stroke-secondary mt-auto flex gap-2 border-t pt-2 text-[12px] leading-4.5">
              <span className="flex min-w-0 flex-1 items-center gap-1.5">
                <PinIcon className="size-4 shrink-0 text-text-secondary" />
                <span className="truncate text-text-tertiary">{address.city}</span>
              </span>
              <span className="shrink-0 text-text-tertiary">
                {formatRelativeTime(createdAt)}
              </span>
            </div>
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
        className={`absolute top-5 right-5 z-10 size-8 rounded-full border border-stroke-primary-subtle bg-white/95 p-0 shadow-sm transition-transform hover:bg-white active:scale-90 ${favorite ? "text-text-error" : "text-text-secondary"}`}
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
