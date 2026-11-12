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
import { IndicatorDot } from "@/features/notifications/components/IndicatorDot";
import {
  getAccountMenuLabel,
  getChatsLabel,
  useUnreadIndicators,
} from "@/features/notifications/hooks/use-unread-indicators";
import { OPEN_CATALOG_EVENT } from "@/features/categories/components/category-dropdown/CategoryDropdownClient";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import AccountMenu from "../header/auth/AccountMenu";

// The bar's shape, as in the reference: one continuous top edge, 16px rounded corners and,
// in the middle, a cradle for the "+": the edge rounds smoothly down into a half circle of 36px
// radius around the 56px button (8px gap), then rises back to the flat edge.
const CRADLE_WIDTH = 120;

function BarShape() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex">
      <div className="flex-1 rounded-l-2xl bg-surface-primary" />
      <div
        className="-mx-px flex shrink-0 flex-col"
        style={{ width: CRADLE_WIDTH + 2 }}
      >
        <svg viewBox="0 0 122 64" className="block h-16 w-full">
          <path
            d="M0 0H7C19 0 25 2 25 10A36 36 0 0 0 97 10C97 2 103 0 115 0H122V64H0Z"
            className="fill-surface-primary"
          />
        </svg>
        <div className="flex-1 bg-surface-primary" />
      </div>
      <div className="flex-1 rounded-r-2xl bg-surface-primary" />
    </div>
  );
}

const itemClassName =
  "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md text-xs transition-colors md:text-sm";

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

// Phones and tablets: a floating panel near the bottom with the main sections and a raised
// round "+" sitting in a notch, so the header stays light. It is 12px off the screen edges on
// phones and a centred 640px panel on tablets. Desktop uses the header.
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const { hasUnreadChats, accountTone } = useUnreadIndicators(user);
  const isHome = pathname === "/";
  const isChats = pathname.startsWith("/chats");

  return (
    <>
      {/* Cards fade out into the page background before they reach the menu and its notch. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[calc(6.5rem+env(safe-area-inset-bottom))] bg-linear-to-t from-surface-secondary from-40% to-transparent md:h-[calc(7rem+env(safe-area-inset-bottom))] lg:hidden"
      />
      <nav
        aria-label="Основне меню"
        className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 px-3 drop-shadow-[0_4px_16px_rgba(29,41,61,0.12)] md:bottom-[max(1rem,env(safe-area-inset-bottom))] md:px-6 lg:hidden"
      >
        <div className="relative mx-auto max-w-120 md:max-w-160">
          <BarShape />
          <ul className="relative grid grid-cols-[1fr_1fr_96px_1fr_1fr] items-end px-2 py-2 md:grid-cols-[1fr_1fr_120px_1fr_1fr] md:px-4">
            <li className="flex min-w-0">
              <Link
                href="/"
                aria-current={isHome ? "page" : undefined}
                className={cn(itemClassName, itemStateClassName(isHome))}
              >
                <ItemContent icon={<NavHomeIcon size={24} />} label="Головна" />
              </Link>
            </li>
            <li className="flex min-w-0">
              <button
                type="button"
                data-catalog-trigger
                aria-haspopup="dialog"
                onClick={() =>
                  window.dispatchEvent(new Event(OPEN_CATALOG_EVENT))
                }
                className={cn(itemClassName, itemStateClassName(false))}
              >
                <ItemContent
                  icon={<NavCatalogIcon size={24} />}
                  label="Каталог"
                />
              </button>
            </li>
            {/* The "+" is centred 10px below the bar's edge, in the middle of the cradle. */}
            <li className="relative self-stretch">
              <Link
                href="/create"
                aria-label="Додати оголошення"
                className="absolute -top-6.5 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-surface-brand text-text-invert shadow-[0_6px_16px_-2px] shadow-surface-brand/45 transition-colors hover:bg-surface-brand-hover"
              >
                <NavPlusIcon size={26} />
              </Link>
            </li>
            <li className="flex min-w-0">
              <Link
                href="/chats"
                aria-current={isChats ? "page" : undefined}
                aria-label={
                  hasUnreadChats ? getChatsLabel(true, "Чат") : undefined
                }
                className={cn(itemClassName, itemStateClassName(isChats))}
              >
                <ItemContent
                  icon={
                    <span className="relative">
                      <NavChatIcon size={24} />
                      {hasUnreadChats && <IndicatorDot tone="error" />}
                    </span>
                  }
                  label="Чат"
                />
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
                      aria-label={getAccountMenuLabel(accountTone)}
                      className={cn(itemClassName, itemStateClassName(false))}
                    >
                      <span className="relative">
                        <NavUserIcon size={24} />
                        {accountTone && <IndicatorDot tone={accountTone} />}
                      </span>
                      <span className="truncate">Профіль</span>
                    </button>
                  }
                />
              ) : (
                <Link
                  href="/sign-in"
                  className={cn(itemClassName, itemStateClassName(false))}
                >
                  <ItemContent
                    icon={<NavUserIcon size={24} />}
                    label="Увійти"
                  />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
