import { Button } from "@/components/ui/button/button";
import { ChatBubbleIcon, PinIcon } from "@/components/ui/icons";
import type { ProductCardType } from "@/types/product";
import { formatRelativeTime } from "@/utils/format-relative-time";
import Image from "next/image";

interface Props {
  card: ProductCardType;
}

const ProductCard = ({ card }: Props) => {
  const { isNew, title, price, images, address, createdAt } = card;

  return (
    <div className="border-border-base w-105.25 rounded-lg border bg-neutral-50 p-6 shadow-[0_1px_0.5px_0.05px_#1D293D05]">
      <div className="relative w-full h-73.25 overflow-hidden rounded-lg">
        <Image
          src={images[0]}
          alt={title}
          fill
          unoptimized
          sizes="371px"
          className="object-contain"
        />
      </div>
      <div className="w-full space-y-7 pt-6">
        <div className="space-y-4">
          <span
            className={`block w-fit rounded-lg ${isNew ? "bg-brand-50" : "bg-[#F3F4F6]"} px-3 py-2 text-base font-medium`}
          >
            {isNew ? "Новий" : "Б/у"}
          </span>
          <h3 className="mt-4 text-base font-semibold">{title}</h3>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-neutral-600">
          <div className="flex min-w-0 items-end gap-2">
            <PinIcon className="size-4 shrink-0" />
            <span className="truncate">{address.city}</span>
          </div>
          <span className="shrink-0 text-neutral-400">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 ">
          <strong className="text-2xl font-bold">{price} грн</strong>
          <div className="flex items-center gap-3">
            <Button type="button" className="size-9 min-w-32.25">
              Купити
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              aria-label="Написати продавцю"
              className="size-9 p-0"
            >
              <ChatBubbleIcon className="size-4 " />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
