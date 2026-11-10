import { LayoutGrid } from "lucide-react";
import Image from "next/image";

import { AngleRightIcon } from "@/assets/icons/AngleRightIcon";
import { HomeIcon } from "@/assets/icons/HomeIcon";
import { Link } from "@/i18n/navigation";

import type { Category } from "../../types/category";

const getCategoryHref = (rootSlug: string, category: Category) =>
  `/category/${rootSlug}/${category.slug}`;

function Breadcrumbs({ trail }: { trail: Category[] }) {
  const [root] = trail;

  return (
    <nav aria-label="Хлібні крихти">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-text-secondary">
        <li className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-1 rounded-sm hover:text-text-primary">
            <HomeIcon size={16} />
            Головна
          </Link>
          <AngleRightIcon size={14} />
        </li>
        {trail.map((category, index) => {
          const isCurrent = index === trail.length - 1;
          return (
            <li key={category.id} className="flex items-center gap-1">
              {isCurrent ? (
                <span aria-current="page" className="text-text-tertiary">
                  {category.title}
                </span>
              ) : (
                <>
                  <Link
                    href={getCategoryHref(root.slug, category)}
                    className="rounded-sm hover:text-text-primary"
                  >
                    {category.title}
                  </Link>
                  <AngleRightIcon size={14} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SubcategoryTile({ rootSlug, category }: { rootSlug: string; category: Category }) {
  return (
    <li className="w-36 shrink-0 lg:w-auto">
      <Link
        href={getCategoryHref(rootSlug, category)}
        className="flex h-full flex-col items-center gap-1 rounded-lg border border-stroke-secondary bg-surface-primary p-2 transition-shadow hover:shadow-md"
      >
        <span className="relative flex aspect-[131/125] w-full items-center justify-center overflow-hidden rounded-md bg-surface-secondary text-text-tertiary">
          {category.image ? (
            <Image
              src={category.image.url}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
            />
          ) : (
            <LayoutGrid aria-hidden="true" className="size-8" />
          )}
        </span>
        <span className="px-2 text-center text-md font-semibold text-text-primary">
          {category.title}
        </span>
      </Link>
    </li>
  );
}

export function CategoryHeader({
  category,
  trail,
}: {
  category: Category;
  trail: Category[];
}) {
  const rootSlug = trail[0]?.slug ?? category.slug;

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs trail={trail.length ? trail : [category]} />
      <h1 className="text-display-xs font-semibold text-text-primary sm:text-display-sm">
        {category.title}
      </h1>
      {category.children.length > 0 && (
        <ul
          aria-label="Підкатегорії"
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-8 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {category.children.map((child) => (
            <SubcategoryTile key={child.id} rootSlug={rootSlug} category={child} />
          ))}
        </ul>
      )}
    </div>
  );
}
