"use client";

import { DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button/button";
import { ChevronRightIcon, GridIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { CategoryOption } from "../../types/category";

interface CategoryDropdownClientProps {
  categories: CategoryOption[];
  unavailable?: boolean;
}

const menuContentClassName =
  "z-50 min-w-72 max-h-screen overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-xl outline-none";

const menuItemClassName =
  "flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 outline-none select-none data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-950";

interface CategoryMenuItemProps {
  category: CategoryOption;
  parentSlug: string;
}

function CategoryMenuItem({ category, parentSlug }: CategoryMenuItemProps) {
  if (category.children.length > 0) {
    return (
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger className={menuItemClassName}>
          <span className="truncate">{category.title}</span>
          <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0" />
        </DropdownMenu.SubTrigger>

        <DropdownMenu.Portal>
          <DropdownMenu.SubContent
            className={menuContentClassName}
            sideOffset={6}
            collisionPadding={12}
          >
            <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-neutral-500">
              {category.title}
            </DropdownMenu.Label>

            {category.children.map((child) => (
              <CategoryMenuItem
                key={child.id}
                category={child}
                parentSlug={parentSlug}
              />
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>
    );
  }

  return (
    <DropdownMenu.Item asChild textValue={category.title}>
      <Link
        href={`/category/${encodeURIComponent(parentSlug)}/${encodeURIComponent(category.slug)}`}
        className={menuItemClassName}
      >
        <span className="truncate">{category.title}</span>
      </Link>
    </DropdownMenu.Item>
  );
}

export default function CategoryDropdownClient({
  categories,
  unavailable = false,
}: CategoryDropdownClientProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" title={"Catalog"}>
          <GridIcon width={16} height={16} />
          <span className="">Каталог</span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          aria-label="Product categories"
          align="start"
          sideOffset={12}
          collisionPadding={12}
          loop
          className={menuContentClassName}
        >
          <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-neutral-500">
            Категорії
          </DropdownMenu.Label>
          {unavailable && <span>Failed to fetch categories</span>}

          {categories.map((category) => (
            <CategoryMenuItem
              key={category.id}
              category={category}
              parentSlug={category.slug}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
