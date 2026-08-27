"use client";

import { Button } from "@/components/ui/button/button";
import { ChatBubbleIcon, HeartIcon, PinIcon } from "@/components/ui/icons";
import type { ProductCardType } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";
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
    <div className="border-border-base relative w-full rounded-[8px] border bg-neutral-50 p-4 pb-8 shadow-sm">
      <div className="relative w-full h-50 overflow-hidden rounded-lg">
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
            favorite ? "text-red-500" : "text-neutral-600"
          }`}
        >
          <HeartIcon className="size-5" />
        </Button>
      </div>

      <div className="w-full space-y-7 pt-4">
        <div className="flex w-full flex-col gap-2 pt-2 ">
          <h3 className="text-[14px] leading-5">{title}</h3>
          <span className="text-[20px] leading-7.5 font-semibold">
            {price} грн
          </span>
          <div className="border-t border-neutral-100 flex gap-2 pt-2 text-[12px] leading-4.5">
            <div className="flex items-center gap-1.5 flex-1">
              <PinIcon className="size-4 shrink-0 text-neutral-600" />
              <span className="truncate text-neutral-400">{address.city}</span>
            </div>
            <span className="shrink-0 text-neutral-400">
              {formatRelativeTime(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
