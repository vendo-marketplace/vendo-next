"use client";

import { useSyncExternalStore } from "react";

// A tiny client store shared by the header (camera button, photo chip), the photo search
// dialog and the search page. The photo lives only in this tab's memory as a blob URL.
type PhotoSearchState = {
  isDialogOpen: boolean;
  // The cropped photo being searched for, shown as a chip in the search field.
  photoUrl: string | null;
};

let state: PhotoSearchState = { isDialogOpen: false, photoUrl: null };
const listeners = new Set<() => void>();

const setState = (next: Partial<PhotoSearchState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const SERVER_STATE: PhotoSearchState = { isDialogOpen: false, photoUrl: null };

export const usePhotoSearch = () =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );

export const openPhotoSearch = () => setState({ isDialogOpen: true });

export const closePhotoSearch = () => setState({ isDialogOpen: false });

export const setSearchPhoto = (photoUrl: string) => {
  if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
  setState({ photoUrl, isDialogOpen: false });
};

export const clearSearchPhoto = () => {
  if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
  setState({ photoUrl: null });
};
