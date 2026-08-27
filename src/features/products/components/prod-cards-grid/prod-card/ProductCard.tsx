"use client";

import { AiIcon } from "@/assets/icons";
import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import { HeartIcon, PinIcon } from "@/components/ui/icons";
import type { ProductCardType } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
    <div className="border-stroke-primary-subtle relative flex h-full w-full flex-col rounded-[8px] border bg-surface-primary p-4 pb-8 shadow-xs hover:shadow-sm">
      <div className="relative h-50 w-full shrink-0 overflow-hidden rounded-lg">
        <Image
          src={images[0]}
          alt={title}
          fill
          sizes="200px"
          loading={eager ? "eager" : "lazy"}
          className="object-contain "
        />
        <Button
          variant="secondary"
          size="none"
          disabled={favoriteDisabled}
          aria-label={t(favorite ? "removeLabel" : "addLabel")}
          onClick={onToggleFavorite}
          className={`absolute top-2 right-2 size-9 rounded-full  ${
            favorite ? "text-text-error" : "text-text-secondary"
          }`}
        >
          <HeartIcon className="size-5" />
        </Button>
        <Badge
          size="sm"
          theme={isNew ? "brand" : "gray"}
          className="absolute rounded-full left-2.25 top-2.5 px-2!"
          leading={<AiIcon />}
        >
          {isNew ? "Новий" : "Вживаний"}
        </Badge>
      </div>

      <div className="flex w-full flex-1 flex-col pt-4">
        <div className="flex w-full flex-1 flex-col gap-2 pt-2">
          <h3 className="text-[14px] leading-5">{title}</h3>
          <span className="text-[20px] leading-7.5 font-semibold">
            {price} грн
          </span>
          <div className="border-t border-stroke-secondary mt-auto flex gap-2 pt-2 text-[12px] leading-4.5">
            <div className="flex items-center gap-1.5 flex-1">
              <PinIcon className="size-4 shrink-0 text-text-secondary" />
              <span className="truncate text-text-tertiary">
                {address.city}
              </span>
            </div>
            <span className="shrink-0 text-text-tertiary">
              {formatRelativeTime(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
