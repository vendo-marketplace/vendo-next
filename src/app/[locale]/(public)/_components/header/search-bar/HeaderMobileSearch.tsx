"use client";

import { useEffect, useState } from "react";

import { NavBackIcon, NavSearchIcon } from "@/assets/icons/NavIcons";

import SearchBar from "./SearchBar";

// Phones (Figma 5083-17684): a search icon in the header row; it opens a search row over
// the header with a back arrow, as in the "Search" header variant.
export default function HeaderMobileSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Пошук товарів"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        // The icon is 24px as in Figma; the hit area reaches 28×40px without touching the heart.
        className="relative flex size-6 items-center justify-center rounded-sm text-text-secondary transition-colors after:absolute after:-inset-x-0.5 after:-inset-y-2 after:content-[''] hover:text-text-brand md:hidden"
      >
        <NavSearchIcon size={24} />
      </button>

      {isOpen && (
        // The "Search" header variant (Figma): 56px tall like the header, with a 36px field.
        <div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center gap-3 border-b border-stroke-secondary bg-surface-primary px-4 md:hidden [&_form]:h-9">
          <button
            type="button"
            aria-label="Закрити пошук"
            onClick={() => setIsOpen(false)}
            className="relative flex size-6 shrink-0 items-center justify-center rounded-sm text-text-secondary transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-text-primary"
          >
            <NavBackIcon size={24} />
          </button>
          <div className="min-w-0 flex-1">
            <SearchBar autoFocus onSearch={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
