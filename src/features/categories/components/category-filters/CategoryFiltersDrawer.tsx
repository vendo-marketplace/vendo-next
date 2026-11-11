"use client";

import { Dialog } from "radix-ui";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

import { BellIcon } from "@/assets/icons/BellIcon";
import { CrossIcon } from "@/assets/icons/CrossIcon";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import { SelectedFiltersBlock } from "./ActiveFilterChips";
import type { ActiveFilterChip } from "./lib/active-filter-chips";
import { formatListingsCount } from "./lib/filter-display";

const DESKTOP_QUERY = "(min-width: 64rem)";
// The sm breakpoint: below it the filters open as a sheet from the bottom.
const PHONE_QUERY = "(max-width: 39.99rem)";

const subscribeToPhone = (onChange: () => void) => {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const useIsPhone = () =>
  useSyncExternalStore(
    subscribeToPhone,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );

// Phones: a sheet that slides up from the bottom, with the buttons under the thumb.
// Tablets: a side panel from the left. Desktop has the sidebar instead.
// Filters apply as they change, so "Показати" only closes the panel.
export function CategoryFiltersDrawer({
  open,
  onOpenChange,
  totalElements,
  chips,
  onRemoveChip,
  onReset,
  autoSearchQuery,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalElements?: number;
  chips: ActiveFilterChip[];
  onRemoveChip: (chip: ActiveFilterChip) => void;
  onReset: () => void;
  // The phone toolbar has no room for "Стежити за пошуком", so on phones it lives here, next to
  // the filters it saves; tablets keep it in the toolbar.
  autoSearchQuery: Record<string, string>;
  children: ReactNode;
}) {
  const isPhone = useIsPhone();
  const hasFilters = chips.length > 0;

  // Growing past lg brings back the sidebar, so the panel closes.
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const close = () => desktop.matches && onOpenChange(false);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, [onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-surface-primary shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in motion-reduce:animate-none lg:hidden",
            isPhone
              ? "inset-x-0 bottom-0 h-[calc(100dvh-3rem)] rounded-t-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
              : "top-0 left-0 h-dvh w-[calc(100%-3rem)] max-w-sm rounded-r-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          )}
        >
          <div className="relative flex shrink-0 items-center justify-center border-b border-stroke-secondary px-14 py-2">
            <Dialog.Title className="font-heading text-xl leading-11 font-semibold text-text-primary">
              Фільтри
            </Dialog.Title>
            <Dialog.Close
              aria-label="Закрити фільтри"
              className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:shadow-focus-brand focus-visible:outline-none"
            >
              <CrossIcon size={20} />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <SelectedFiltersBlock chips={chips} onRemove={onRemoveChip} onClearAll={onReset} />
            {children}
          </div>

          <div className="flex shrink-0 flex-col gap-2 border-t border-stroke-secondary px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link
              href={{ pathname: "/auto-search", query: autoSearchQuery }}
              className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold text-text-brand hover:text-text-brand-dark sm:hidden"
            >
              <BellIcon size={16} />
              Стежити за цим пошуком
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="text"
                disabled={!hasFilters}
                onClick={onReset}
                className="h-11 shrink-0 px-4 text-text-brand disabled:text-text-tertiary"
              >
                Скинути
              </Button>
              <Dialog.Close asChild>
                <Button className="h-11 min-w-0 flex-1">
                  {totalElements === undefined
                    ? "Показати оголошення"
                    : `Показати ${formatListingsCount(totalElements)}`}
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
