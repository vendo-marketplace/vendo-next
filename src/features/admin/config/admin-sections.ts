import { Search, type LucideIcon } from "lucide-react";

export type AdminSection = {
  id: string;
  href: `/admin/${string}`;
  icon: LucideIcon;
};

// A new section also needs a label under `Admin.sections` and a route under `admin/`.
export const ADMIN_SECTIONS = [
  { id: "search", href: "/admin/search", icon: Search },
] as const satisfies readonly [AdminSection, ...AdminSection[]];

export const DEFAULT_ADMIN_SECTION = ADMIN_SECTIONS[0];
