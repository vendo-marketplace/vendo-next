"use client";

import { DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { CategoryOption } from "../../types/category";

interface CategoryDropdownClientProps {
  categories: CategoryOption[];
  unavailable?: boolean;
}

const menuContentClassName =
  "z-50 min-w-72 max-h-96 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-xl outline-none";

const menuItemClassName =
  "flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-700 outline-none select-none data-[highlighted]:bg-neutral-100 data-[highlighted]:text-neutral-950";

function CategoryMenuItem({ category }: { category: CategoryOption }) {
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
              <CategoryMenuItem key={child.id} category={child} />
            ))}
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>
    );
  }

  return (
    <DropdownMenu.Item asChild textValue={category.title}>
      <Link
        href={{
          pathname: "/search",
          query: { category: category.slug },
        }}
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
  const isDisabled = unavailable || categories.length === 0;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          className="group shrink-0"
          title={isDisabled ? "Catalog is currently unavailable" : undefined}
        >
          Catalog
          <ChevronDownIcon
            aria-hidden="true"
            className="ml-2 size-4 transition-transform group-data-[state=open]:rotate-180"
          />
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
            Categories
          </DropdownMenu.Label>
          {unavailable && <span>Failed to fetch categories</span>}

          {categories.map((category) => (
            <CategoryMenuItem key={category.id} category={category} />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
