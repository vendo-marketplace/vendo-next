"use client";

import type { ReactNode } from "react";

import {
  NavCatalogIcon,
  NavChatIcon,
  NavHomeIcon,
  NavPlusIcon,
  NavUserIcon,
} from "@/assets/icons/NavIcons";
import { useMe } from "@/features/auth/hooks/use-me";
import { OPEN_CATALOG_EVENT } from "@/features/categories/components/category-dropdown/CategoryDropdownClient";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import AccountMenu, { needsProfileAttention } from "../header/auth/AccountMenu";

// The bar's shape, as in the reference: one continuous top edge with 24px outer corners and,
// in the middle, a cradle for the "+": the edge rounds smoothly down into a half circle of 36px
// radius around the 56px button (8px gap), then rises back to the flat edge.
const CRADLE_WIDTH = 120;

function BarShape() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex">
      <div className="flex-1 rounded-tl-3xl bg-surface-primary" />
      <div className="-mx-px flex shrink-0 flex-col" style={{ width: CRADLE_WIDTH + 2 }}>
        <svg viewBox="0 0 122 64" className="block h-16 w-full">
          <path
            d="M0 0H7C19 0 25 2 25 10A36 36 0 0 0 97 10C97 2 103 0 115 0H122V64H0Z"
            className="fill-surface-primary"
          />
        </svg>
        <div className="flex-1 bg-surface-primary" />
      </div>
      <div className="flex-1 rounded-tr-3xl bg-surface-primary" />
    </div>
  );
}

const itemClassName =
  "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md text-xs transition-colors";

const itemStateClassName = (isActive: boolean) =>
  isActive ? "text-text-brand" : "text-text-secondary hover:text-text-primary";

function ItemContent({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <>
      {icon}
      <span className="truncate">{label}</span>
    </>
  );
}

// Phones only: a full-width bar at the bottom with the main sections and a raised round "+"
// sitting in a notch, so the header can stay a single row. Tablets and desktop use the header.
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const isHome = pathname === "/";
  const isChats = pathname.startsWith("/chats");

  return (
    <nav
      aria-label="Основне меню"
      className="fixed inset-x-0 bottom-0 z-40 drop-shadow-[0_-2px_8px_rgba(29,41,61,0.08)] md:hidden"
    >
      <BarShape />
      <ul className="relative grid grid-cols-[1fr_1fr_120px_1fr_1fr] items-end px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <li className="flex min-w-0">
          <Link
            href="/"
            aria-current={isHome ? "page" : undefined}
            className={cn(itemClassName, itemStateClassName(isHome))}
          >
            <ItemContent icon={<NavHomeIcon />} label="Головна" />
          </Link>
        </li>
        <li className="flex min-w-0">
          <button
            type="button"
            data-catalog-trigger
            aria-haspopup="dialog"
            onClick={() => window.dispatchEvent(new Event(OPEN_CATALOG_EVENT))}
            className={cn(itemClassName, itemStateClassName(false))}
          >
            <ItemContent icon={<NavCatalogIcon />} label="Каталог" />
          </button>
        </li>
        {/* The "+" is centred 10px below the bar's edge, in the middle of the cradle. */}
        <li className="relative self-stretch">
          <Link
            href="/create"
            aria-label="Додати оголошення"
            className="absolute -top-6.5 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-surface-brand text-text-invert shadow-lg transition-colors hover:bg-surface-brand-hover"
          >
            <NavPlusIcon size={26} />
          </Link>
        </li>
        <li className="flex min-w-0">
          <Link
            href="/chats"
            aria-current={isChats ? "page" : undefined}
            className={cn(itemClassName, itemStateClassName(isChats))}
          >
            <ItemContent icon={<NavChatIcon />} label="Чат" />
          </Link>
        </li>
        <li className="flex min-w-0">
          {user ? (
            <AccountMenu
              user={user}
              side="top"
              trigger={
                <button
                  type="button"
                  aria-label={
                    needsProfileAttention(user)
                      ? "Відкрити меню акаунта, потрібна дія в профілі"
                      : "Відкрити меню акаунта"
                  }
                  className={cn(itemClassName, itemStateClassName(false))}
                >
                  <span className="relative">
                    <NavUserIcon />
                    {needsProfileAttention(user) && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-0.5 -right-0.5 size-2 rounded-full border border-surface-primary bg-surface-warning"
                      />
                    )}
                  </span>
                  <span className="truncate">Профіль</span>
                </button>
              }
            />
          ) : (
            <Link href="/sign-in" className={cn(itemClassName, itemStateClassName(false))}>
              <ItemContent icon={<NavUserIcon />} label="Увійти" />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
