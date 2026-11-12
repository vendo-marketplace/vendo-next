"use client";

import Image from "next/image";
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
import { formatListingDate, formatListingDateShort } from "./lib/format-listing-date";
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

const SPEC_ICONS: Record<SpecKind, (props: { className?: string }) => React.ReactNode> = {
  storage: StorageIcon,
  battery: BatteryIcon,
  warranty: WarrantyIcon,
  other: InfoIcon,
};

// The card follows its own width (Figma: mobile 168, tablet 243, desktop 311). On desktop the
// condition opens the specs row; on smaller cards it sits on the photo, and phone cells get
// smaller icons and padding so the values fit.
const badgeClassName =
  "flex min-w-0 items-center gap-1 border-stroke-primary-subtle pt-2 pr-0.5 pb-1.5 pl-1 not-last:border-r @card-tablet:gap-1.5 @card-tablet:pr-2 @card-tablet:pl-2 @card-desktop:py-2";

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

// Sample listings have no product page yet, so they are not links.
function CardLink({ card, children }: { card: ProductCardType; children: React.ReactNode }) {
  if (isSampleProduct(card.id)) return <div className={cardLinkClassName}>{children}</div>;
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
    <article className="@container relative flex h-full w-full flex-col rounded-lg border border-stroke-primary-subtle bg-surface-primary px-2 pt-2 pb-1 shadow-xs transition-shadow hover:shadow-md">
      <CardLink card={card}>
        <div className="relative aspect-[152/160] w-full @card-tablet:aspect-[227/220] @card-desktop:aspect-[295/264] shrink-0 overflow-hidden rounded-sm bg-surface-secondary">
          {image ? (
            <Image
              src={image}
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
          <span
            className={cn(
              "absolute top-1 left-2 flex max-w-[calc(100%-3.5rem)] items-center gap-1 rounded-sm bg-surface-primary px-1 py-px text-xs font-semibold @card-tablet:py-0.5 @card-tablet:pr-1.5 @card-desktop:hidden",
              CONDITIONS[condition].className,
            )}
          >
            <ConditionLabel condition={condition} />
          </span>
        </div>

        <div className="flex flex-col gap-1 pt-4 @card-tablet:gap-1.5 @card-desktop:px-2">
          <h3 className="line-clamp-2 h-10 font-sans text-sm font-normal text-text-primary @card-tablet:h-auto @card-tablet:truncate @card-desktop:text-md">
            {title}
          </h3>
          <p className="font-heading text-lg leading-6 font-semibold text-text-primary @card-tablet:leading-7 @card-desktop:text-xl">
            {formatPrice(price)}
          </p>
        </div>

        <ul
          className={cn(
            "mt-3.5 mb-1 grid @card-tablet:mt-4 grid-cols-2 border-y @card-desktop:grid-cols-3 border-stroke-primary-subtle text-xs",
            // No specs: below desktop the row has nothing to show, so its lines hide while it keeps
            // its height and the city and date stay level with the neighbouring cards.
            specs.length === 0 && "border-transparent @card-desktop:border-stroke-primary-subtle",
          )}
        >
          {specs.length === 0 && (
            <li aria-hidden="true" className={cn(badgeClassName, "invisible @card-desktop:hidden")}>
              <span className="size-3.5 shrink-0 @card-tablet:size-4" />
              <span>&nbsp;</span>
            </li>
          )}
          <li
            className={cn(
              badgeClassName,
              "hidden font-semibold @card-desktop:flex",
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
                className={cn(badgeClassName, "text-text-secondary")}
              >
                <Icon className="size-3.5 shrink-0 @card-tablet:size-4" />
                <span className="truncate">{value}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex h-7 items-center gap-2 text-xs @card-desktop:px-2 text-text-secondary">
          <span className="flex min-w-0 flex-1 items-center gap-1">
            <LocationIcon className="size-4 shrink-0 @card-tablet:size-4.5" />
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

      <Button
        variant="none"
        size="none"
        disabled={favoriteDisabled || isSampleProduct(card.id)}
        aria-label={t(favorite ? "removeLabel" : "addLabel")}
        aria-pressed={favorite}
        onClick={onToggleFavorite}
        className={cn(
          "absolute top-3 right-4 z-10 size-8 rounded-full after:absolute after:-inset-1.5 after:content-[''] border border-surface-brand-subtle bg-surface-brand-subtle p-0 shadow-sm transition-[transform,color] active:scale-90",
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
