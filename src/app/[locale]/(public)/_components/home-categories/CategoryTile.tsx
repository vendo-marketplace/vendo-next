import Image from "next/image";
import type { ReactNode } from "react";

import { getCategoryHref } from "@/features/categories/components/category-header/CategoryHeader";
import type { CategoryOption } from "@/features/categories/types/category";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import { CategoryIconByTitle } from "./category-icon-by-title";
import { getCategoryPhotos } from "./category-photo";

// White, like the listing cards; the light-blue podium under the photo carries the brand colour.
export const TILE_CLASS =
  "group relative isolate flex flex-col gap-3 overflow-hidden rounded-lg border border-stroke-secondary bg-surface-primary p-4 text-left shadow-xs outline-offset-2 transition-[border-color,box-shadow] duration-200 hover:border-stroke-brand-subtle hover:shadow-md focus-visible:outline-2 focus-visible:outline-stroke-brand";

// A little sticker stage under the name: a light-blue card turned one way, and a dashed outline turned
// the other. Whatever goes inside sits within the card, so nothing
// sticks out of it. On hover the card straightens and the outline swings further out.
export function TilePodium({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="absolute inset-x-4 top-[38%] bottom-3">
      <span className="absolute inset-0 -rotate-3 rounded-lg border-2 border-dashed border-stroke-brand-subtle transition-[rotate,scale] duration-300 ease-out group-hover:scale-[1.04] group-hover:-rotate-6" />
      <span className="absolute inset-0 rotate-2 rounded-lg bg-surface-brand-subtle transition-[rotate,background-color] duration-300 ease-out group-hover:rotate-0 group-hover:bg-[#dcebff]" />
      <span className="absolute inset-1 flex items-center justify-center gap-1 transition-transform duration-300 ease-out group-hover:scale-105">
        {children}
      </span>
    </span>
  );
}

// A category tile: the name at the top and a product photo on a light-blue sticker stage below
// it. Categories without a photo show a line icon. Root categories have no page of their own, so
// the tile opens the first subcategory.
export function CategoryTile({
  category,
  className,
}: {
  category: CategoryOption;
  className?: string;
}) {
  const firstChild = category.children[0];
  const href = firstChild
    ? getCategoryHref(category.slug, firstChild.slug)
    : "/search";
  const photos = getCategoryPhotos(category.title);

  return (
    <Link href={href} className={cn(TILE_CLASS, className)}>
      <span className="font-heading text-sm leading-snug font-semibold text-text-primary group-hover:text-text-brand">
        {/* A word joiner after "/" keeps pairs like "Продаж/оренда" on one line. */}
        {category.title.replaceAll("/", "/⁠")}
      </span>
      <TilePodium>
        {photos.length > 0 ? (
          // Every photo fits the same box, so the pairs read as one size.
          photos.map((photo) => (
            <Image
              key={photo.src}
              src={photo}
              alt=""
              sizes="160px"
              className="h-full w-auto max-w-full min-w-0 object-contain"
            />
          ))
        ) : (
          <CategoryIconByTitle
            title={category.title}
            className="size-8 text-text-brand"
            strokeWidth={1.75}
          />
        )}
      </TilePodium>
    </Link>
  );
}
