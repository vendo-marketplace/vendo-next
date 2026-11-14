import { FolderTree, ListTree, Search, type LucideIcon } from "lucide-react";

export type AdminSection = {
  id: string;
  href: `/admin/${string}`;
  icon: LucideIcon;
};

// A new section also needs a label under `Admin.sections` and a route under `admin/`.
export const ADMIN_SECTIONS = [
  { id: "categories", href: "/admin/categories", icon: FolderTree },
  { id: "attributes", href: "/admin/attributes", icon: ListTree },
  { id: "search", href: "/admin/search", icon: Search },
] as const satisfies readonly [AdminSection, ...AdminSection[]];

export const DEFAULT_ADMIN_SECTION = ADMIN_SECTIONS[0];
