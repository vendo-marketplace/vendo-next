"use client";

import Image from "next/image";
import { MessageCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { InfoMarkIcon } from "@/assets/icons/InfoMarkIcon";
import { Button } from "@/components/ui/button/button";
import { toUkrainianCityName } from "@/features/products/lib/city-name";
import { Link } from "@/i18n/navigation";
import type { ProductCardType } from "@/types/product";
import { cn } from "@/utils/utils";

import {
  BatteryIcon,
  HeartIcon,
  LikeNewIcon,
  LocationIcon,
  NewTagIcon,
  StorageIcon,
  UsedIcon,
  WarrantyIcon,
} from "./ProductCardIcons";
import {
  getCardCondition,
  getCardImage,
  getCardSpecs,
  getCardTitle,
  type CardCondition,
  type SpecKind,
} from "./lib/card-specs";
import {
  formatListingDate,
  formatListingDateShort,
} from "./lib/format-listing-date";
import { isSampleProduct } from "./lib/sample-smartphones";

interface Props {
  card: ProductCardType;
  eager?: boolean;
  favorite: boolean;
  favoriteDisabled?: boolean;
  onToggleFavorite: () => void;
}

const formatPrice = (price: number) => `${price.toLocaleString("uk-UA")} грн`;

const InfoIcon = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className={className}>
    <InfoMarkIcon size={16} />
  </span>
);

const SPEC_ICONS: Record<
  SpecKind,
  (props: { className?: string }) => React.ReactNode
> = {
  storage: StorageIcon,
  battery: BatteryIcon,
  warranty: WarrantyIcon,
  other: InfoIcon,
};

// The card follows its own width (Figma: mobile 168, tablet 243, desktop 311). On desktop the
// condition opens the specs row; on smaller cards it sits on the photo, and phone cells get
// smaller icons and padding so the values fit.
const badgeClassName =
  "flex min-w-0 flex-auto items-center gap-1 border-stroke-primary-subtle not-first:justify-center pt-2 pr-0.5 pb-1.5 pl-1 not-last:border-r @card-tablet:px-1 @card-desktop:py-2 @[17.5rem]:gap-1.5 @[17.5rem]:px-2";

const CONDITIONS: Record<
  CardCondition,
  {
    label: string;
    Icon: (props: { className?: string }) => React.ReactNode;
    className: string;
  }
> = {
  new: { label: "Новий", Icon: NewTagIcon, className: "text-text-brand" },
  "like-new": {
    label: "Як новий",
    Icon: LikeNewIcon,
    className: "text-text-success",
  },
  used: { label: "Вживаний", Icon: UsedIcon, className: "text-text-primary" },
};

function ConditionLabel({ condition }: { condition: CardCondition }) {
  const { label, Icon } = CONDITIONS[condition];
  return (
    <>
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </>
  );
}

const cardLinkClassName = "flex h-full flex-col rounded-lg";

const WRITE_BUTTON_CLASS =
  "flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-surface-brand-subtle bg-surface-brand-subtle text-sm font-semibold text-text-brand transition-colors hover:border-stroke-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-brand";

// Sample listings have no product page yet, so they are not links.
function CardLink({
  card,
  children,
}: {
  card: ProductCardType;
  children: React.ReactNode;
}) {
  if (isSampleProduct(card.id))
    return <div className={cardLinkClassName}>{children}</div>;
  return (
    <Link
      href={`/product/${card.id}?q=${encodeURIComponent(card.title)}`}
      className={cardLinkClassName}
    >
      {children}
    </Link>
  );
}

const ProductCard = ({
  card,
  eager = false,
  favorite,
  favoriteDisabled = false,
  onToggleFavorite,
}: Props) => {
  const { price, address, createdAt } = card;
  const city = toUkrainianCityName(address.city);
  const title = getCardTitle(card);
  const t = useTranslations("Favorites");
  const condition = getCardCondition(card);
  const specs = getCardSpecs(card);
  const image = getCardImage(card);

  return (
    // On hover (or keyboard focus) the card rises above its neighbours and a panel with "Написати"
    // slides out from its bottom edge over the card below, so the grid itself never shifts.
    <article className="group/card @container relative flex h-full w-full flex-col rounded-lg border border-stroke-secondary bg-surface-primary p-2 shadow-xs transition-[box-shadow,border-radius] duration-200 ease-out focus-within:z-20 focus-within:rounded-b-none focus-within:shadow-lg hover:z-20 hover:rounded-b-none hover:shadow-lg">
      <CardLink card={card}>
        {/* The photo runs edge to edge across the top of the card. */}
        <div className="relative -mx-2 -mt-2 aspect-square shrink-0 overflow-hidden rounded-t-lg bg-surface-secondary">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 311px"
              loading={eager ? "eager" : "lazy"}
              className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 motion-reduce:group-hover/card:scale-100"
            />
          ) : (
            <span className="grid h-full place-items-center text-sm text-text-tertiary">
              Фото відсутнє
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5 px-1 pt-3">
          {/* Up to two lines, and always two lines tall, so prices line up across a row. */}
          <h3 className="line-clamp-2 min-h-10 font-sans text-sm leading-5 font-normal text-text-primary transition-colors group-hover/card:text-text-brand">
            {title}
          </h3>
          <p className="font-heading text-lg leading-7 font-bold text-text-primary">
            {formatPrice(price)}
          </p>
        </div>

        <ul className="mt-3.5 mb-1 flex border-y border-stroke-primary-subtle text-xs @card-tablet:mt-4">
          <li
            className={cn(
              badgeClassName,
              "font-semibold",
              CONDITIONS[condition].className,
            )}
          >
            <ConditionLabel condition={condition} />
          </li>
          {specs.map(({ kind, value }, index) => {
            const Icon = SPEC_ICONS[kind];
            return (
              <li
                key={`${value}-${index}`}
                className={cn(
                  badgeClassName,
                  "text-text-secondary",
                  // A phone card has room for the condition and one spec.
                  index > 0 && "@max-card-tablet:hidden",
                  index === 0 && "@max-card-tablet:border-r-0",
                )}
              >
                {/* Below desktop the spec icons give their room to the values. */}
                <Icon className="hidden size-4 shrink-0 @card-desktop:block" />
                <span className="truncate">{value}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex items-center gap-2 px-1 pt-3 pb-1 text-xs text-text-tertiary">
          <span className="flex min-w-0 flex-1 items-center gap-1">
            <LocationIcon className="size-3.5 shrink-0" />
            <span className="truncate" title={city}>
              {city}
            </span>
          </span>
          {/* The phone card shows a short date so the city has room; the full one is kept for
              screen readers. */}
          <span className="shrink-0 @card-tablet:hidden" aria-hidden="true">
            {formatListingDateShort(createdAt)}
          </span>
          <span className="sr-only shrink-0 @card-tablet:not-sr-only">
            {formatListingDate(createdAt)}
          </span>
        </div>
      </CardLink>

      {/* The hover panel with "Написати". Sample listings have no chat, so their button is inert. */}
      <div className="invisible absolute inset-x-[-1px] top-full -mt-px rounded-b-lg border border-t-0 border-stroke-secondary bg-surface-primary px-3 pb-3 opacity-0 shadow-lg transition-opacity duration-200 [clip-path:inset(0_-24px_-24px_-24px)] group-focus-within/card:visible group-focus-within/card:opacity-100 group-hover/card:visible group-hover/card:opacity-100">
        {isSampleProduct(card.id) ? (
          <span aria-hidden="true" className={WRITE_BUTTON_CLASS}>
            <MessageCircleIcon className="size-4" />
            Написати
          </span>
        ) : (
          <Link
            href={`/chats?productId=${encodeURIComponent(card.id)}`}
            className={WRITE_BUTTON_CLASS}
          >
            <MessageCircleIcon aria-hidden="true" className="size-4" />
            Написати
          </Link>
        )}
      </div>

      <Button
        variant="none"
        size="none"
        disabled={favoriteDisabled || isSampleProduct(card.id)}
        aria-label={t(favorite ? "removeLabel" : "addLabel")}
        aria-pressed={favorite}
        onClick={onToggleFavorite}
        className={cn(
          "absolute top-2 right-2 z-10 size-8 rounded-full after:absolute after:-inset-1.5 after:content-[''] bg-surface-primary p-0 shadow-xs transition-[transform,color] active:scale-90",
          favorite
            ? "text-text-brand"
            : "text-text-secondary hover:text-text-brand",
        )}
      >
        <HeartIcon filled={favorite} className="size-4" />
      </Button>
    </article>
  );
};

export default ProductCard;
