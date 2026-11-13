"use client";

import { useSyncExternalStore } from "react";

import { CloseIcon, PhotoSearchIcon } from "@/assets/icons/NavIcons";
import { openPhotoSearch } from "@/features/photo-search/lib/photo-search-store";

// Bump the key when the message changes, so people who closed the old one see the new one.
const DISMISSED_KEY = "vendo:announcement-dismissed:photo-search";
const CHANGE_EVENT = "vendo:announcement-change";

const readDismissed = () => {
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

const dismiss = () => {
  try {
    window.localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Private mode: the bar simply comes back next time.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

// Thin light streaks that fade out towards the middle, so the message sits in a clear spotlight.
const STREAKS_STYLE = {
  backgroundImage:
    "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.14) 0 2px, transparent 2px 9px, rgb(255 255 255 / 0.07) 9px 13px, transparent 13px 26px)",
  maskImage:
    "linear-gradient(90deg, black 0%, transparent 38%, transparent 62%, black 100%)",
};

// A slim, graphic bar above the header that announces something new. The whole bar opens photo
// search. People can close it, and it stays closed on this device. The server renders it hidden,
// so a visitor who dismissed it never sees it flash.
export default function AnnouncementBar() {
  const isDismissed = useSyncExternalStore(
    subscribe,
    readDismissed,
    () => true,
  );

  if (isDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Оголошення Vendo"
      className="group relative isolate overflow-hidden text-text-invert"
      style={{
        background:
          "radial-gradient(40% 160% at 50% 50%, #2f7bff 0%, transparent 100%), linear-gradient(90deg, #0636a3 0%, #0a47c9 30%, #0a47c9 70%, #0636a3 100%)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={STREAKS_STYLE}
      />
      <button
        type="button"
        onClick={openPhotoSearch}
        className="page-container flex h-12 w-full cursor-pointer items-center justify-center gap-3 pr-12 -outline-offset-4 focus-visible:outline-2 focus-visible:outline-white md:gap-4"
      >
        <span className="inline-flex shrink-0 -rotate-2 items-center gap-1.5 rounded-full bg-white px-2 py-1 font-heading text-sm font-bold text-text-brand shadow-md sm:px-3.5 transition-transform group-hover:rotate-0 md:text-md">
          <PhotoSearchIcon size={16} />
          <span className="sr-only sm:not-sr-only">Новинка</span>
        </span>
        <span className="truncate font-heading text-sm font-bold tracking-wide uppercase md:text-lg">
          Шукайте <span className="hidden sm:inline">товари </span>
          <span className="text-stroke-brand-subtle">за фото</span>
        </span>
        <span className="hidden shrink-0 text-sm font-semibold text-white/80 underline-offset-4 group-hover:text-white group-hover:underline md:inline">
          Спробувати →
        </span>
      </button>
      <button
        type="button"
        aria-label="Закрити оголошення"
        onClick={dismiss}
        className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
