"use client";

import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";

import photoCar from "@/assets/category-photos/auto.png";
import photoClothes from "@/assets/category-photos/clothes.png";
import photoPhone from "@/assets/category-photos/electronics.png";
import { OPEN_CATALOG_EVENT } from "@/features/categories/components/category-dropdown/CategoryDropdownClient";
import { cn } from "@/utils/utils";

import { TILE_CLASS, TilePodium } from "../home-categories/CategoryTile";

// A small fan of cards on the podium, as if the rest of the catalogue were stacked behind it.
// It spreads out on hover.
const FAN = [
  {
    image: photoClothes,
    className:
      "-rotate-12 -translate-x-[66%] group-hover:-translate-x-[80%] group-hover:-rotate-[16deg]",
  },
  {
    image: photoCar,
    className:
      "rotate-12 translate-x-[66%] group-hover:translate-x-[80%] group-hover:rotate-[16deg]",
  },
  {
    image: photoPhone,
    className: "z-10 -translate-y-1 group-hover:-translate-y-2",
  },
] as const;

// The last tile in the category row, in the same shape as the others: opens the full catalog
// (the same one as the header button) and says how many more categories are there.
export function AllCategoriesTile({
  moreCount,
  className,
}: {
  moreCount: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CATALOG_EVENT))}
      className={cn(TILE_CLASS, "cursor-pointer", className)}
    >
      <span className="flex w-full items-start justify-between gap-2">
        <span className="flex flex-col">
          <span className="font-heading text-sm leading-snug font-semibold text-text-brand">
            Усі категорії
          </span>
          {moreCount > 0 && (
            <span className="text-xs text-text-secondary">ще +{moreCount}</span>
          )}
        </span>
        <ArrowRightIcon
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-text-brand transition-transform group-hover:translate-x-0.5"
        />
      </span>
      <TilePodium>
        <span className="grid">
          {FAN.map(({ image, className: cardClass }) => (
            <span
              key={image.src}
              className={cn(
                "col-start-1 row-start-1 grid size-12 place-items-center rounded-md border border-stroke-brand-subtle bg-surface-primary p-1.5 shadow-sm transition-[translate,rotate] duration-300 ease-out",
                cardClass,
              )}
            >
              <Image
                src={image}
                alt=""
                sizes="48px"
                className="max-h-full w-full object-contain"
              />
            </span>
          ))}
        </span>
      </TilePodium>
    </button>
  );
}
