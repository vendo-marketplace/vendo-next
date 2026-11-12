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
        // 28px icon (a touch larger than Figma for easier reading); the hit area reaches 32×44px.
        className="relative flex size-7 items-center justify-center rounded-sm text-text-secondary transition-colors after:absolute after:-inset-x-0.5 after:-inset-y-2 after:content-[''] hover:text-text-brand md:hidden"
      >
        <NavSearchIcon size={28} />
      </button>

      {isOpen && (
        // The "Search" header variant (Figma): 56px tall like the header, with a 40px field
        // and 16px typed text (iOS Safari zooms in on anything smaller), a 14px placeholder and 20px search and camera icons.
        <div className="absolute inset-x-0 top-0 z-10 flex h-14 items-center gap-3 border-b border-stroke-secondary bg-surface-primary px-4 md:hidden [&_form]:h-10 [&_input]:text-md [&_input]:placeholder:text-sm [&_[data-photo-trigger]]:size-5 [&_[data-photo-trigger]_svg]:size-5 [&_[data-search-submit]]:size-5 [&_[data-search-submit]_svg]:size-5">
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
