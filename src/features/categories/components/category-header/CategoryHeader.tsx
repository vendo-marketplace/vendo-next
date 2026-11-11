import { LayoutGrid } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

import { AngleLeftIcon } from "@/assets/icons/AngleLeftIcon";
import { AngleRightIcon } from "@/assets/icons/AngleRightIcon";
import { HomeIcon } from "@/assets/icons/HomeIcon";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import type { Category } from "../../types/category";
import { ListingsCountNextToTitle } from "../category-page/ListingsCount";
import type { BrandTile } from "../category-filters/lib/mock-filter-attributes";

type Crumb = { label: string; href?: string };

type Tile = {
  key: string;
  title: string;
  href: string;
  image?: string | StaticImageData;
  isCurrent?: boolean;
};

export const getCategoryHref = (rootSlug: string, categorySlug: string) =>
  `/category/${rootSlug}/${categorySlug}`;

export const getBrandSlug = (brand: string) => brand.toLowerCase();

const HOME_CRUMB = { label: "Головна", href: "/" };

// Phones get one "‹ parent" link (the current page is the heading right below);
// tablets and desktop show the full trail.
function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const parent = crumbs.findLast((crumb) => crumb.href) ?? HOME_CRUMB;

  return (
    <nav aria-label="Хлібні крихти">
      <Link
        href={parent.href ?? HOME_CRUMB.href}
        aria-label={`Назад до: ${parent.label}`}
        className="-my-3 flex min-h-11 w-full min-w-0 items-center gap-1 rounded-sm text-sm font-medium text-text-secondary hover:text-text-primary md:hidden"
      >
        <AngleLeftIcon size={16} className="shrink-0" />
        <span className="truncate">{parent.label}</span>
      </Link>
      <ol className="hidden flex-wrap items-center gap-1.5 text-sm text-text-secondary md:flex">
        <li className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-1 rounded-sm hover:text-text-primary">
            <HomeIcon size={16} />
            Головна
          </Link>
          <AngleRightIcon size={14} />
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.label} className="flex items-center gap-1">
            {crumb.href ? (
              <>
                <Link href={crumb.href} className="rounded-sm hover:text-text-primary">
                  {crumb.label}
                </Link>
                <AngleRightIcon size={14} />
              </>
            ) : (
              <span aria-current="page" className="text-text-tertiary">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Tiles({ label, tiles }: { label: string; tiles: Tile[] }) {
  return (
    <ul
      aria-label={label}
      className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:gap-3 lg:mx-0 lg:grid lg:grid-cols-8 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {tiles.map((tile) => (
        <li key={tile.key} className="w-24 shrink-0 snap-start sm:w-32 lg:w-auto">
          <Link
            href={tile.href}
            aria-current={tile.isCurrent ? "page" : undefined}
            className={cn(
              "flex h-full flex-col items-center gap-1 rounded-lg border bg-surface-primary p-2 transition-shadow hover:shadow-md",
              tile.isCurrent ? "border-stroke-brand shadow-focus-brand" : "border-stroke-secondary",
            )}
          >
            <span className="relative flex aspect-[131/125] w-full items-center justify-center overflow-hidden rounded-md bg-surface-secondary text-text-tertiary">
              {tile.image ? (
                <Image src={tile.image} alt="" fill sizes="150px" className="object-cover" />
              ) : (
                <LayoutGrid aria-hidden="true" className="size-8" />
              )}
            </span>
            <span className="px-1 text-center text-sm font-semibold text-text-primary sm:px-2 sm:text-md">
              {tile.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CategoryHeader({
  category,
  trail,
  brandTiles,
  currentBrand,
}: {
  category: Category;
  trail: Category[];
  brandTiles?: BrandTile[];
  currentBrand?: string;
}) {
  const path = trail.length ? trail : [category];
  const rootSlug = path[0].slug;
  const categoryHref = getCategoryHref(rootSlug, category.slug);

  const crumbs: Crumb[] = [
    ...path.map((item, index) => ({
      label: item.title,
      // The last category is the current page, unless a brand page sits below it.
      href:
        index < path.length - 1 || currentBrand
          ? getCategoryHref(rootSlug, item.slug)
          : undefined,
    })),
    ...(currentBrand ? [{ label: currentBrand }] : []),
  ];

  const tiles: Tile[] | undefined = brandTiles
    ? brandTiles.map(({ name, image }) => ({
        key: name,
        title: name,
        image,
        isCurrent: name === currentBrand,
        // The current brand tile leads back to the whole category.
        href:
          name === currentBrand
            ? categoryHref
            : `${categoryHref}/brand/${getBrandSlug(name)}`,
      }))
    : category.children.length
      ? category.children.map((child) => ({
          key: child.id,
          title: child.title,
          image: child.image?.url,
          href: getCategoryHref(rootSlug, child.slug),
        }))
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs crumbs={crumbs} />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h1 className="text-display-xs font-semibold text-text-primary sm:text-display-sm">
          {currentBrand ? `${category.title} ${currentBrand}` : category.title}
        </h1>
        <ListingsCountNextToTitle />
      </div>
      {tiles && <Tiles label={brandTiles ? "Бренди" : "Підкатегорії"} tiles={tiles} />}
    </div>
  );
}
