"use client";

import { useSyncExternalStore } from "react";

// The last searches typed on this device, newest first, shown when the search field is
// focused (Figma 5343-22761). It lives in localStorage, so it survives reloads and is
// shared between tabs, but never leaves the browser.
const STORAGE_KEY = "vendo:search-history";
const MAX_ITEMS = 5;
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();

const normalize = (query: string) => query.trim().toLocaleLowerCase("uk");

const read = (): string[] => {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_ITEMS)
      : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
};

const write = (items: string[]) => {
  cache = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private mode or a full storage: the history still works for this page view.
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // Another tab changed the history.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const useSearchHistory = () => useSyncExternalStore(subscribe, read, () => EMPTY);

export const addToSearchHistory = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return;
  const key = normalize(trimmed);
  write([trimmed, ...read().filter((item) => normalize(item) !== key)].slice(0, MAX_ITEMS));
};

export const removeFromSearchHistory = (query: string) => {
  const key = normalize(query);
  write(read().filter((item) => normalize(item) !== key));
};

export const clearSearchHistory = () => write([]);
