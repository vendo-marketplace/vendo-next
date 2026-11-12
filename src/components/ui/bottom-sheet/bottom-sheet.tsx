"use client";

import { useRef, useState, useSyncExternalStore, type PointerEvent } from "react";

// The sm breakpoint: below it, panels such as filters and sorting open as sheets from the bottom.
const PHONE_QUERY = "(max-width: 39.99rem)";

const subscribeToPhone = (onChange: () => void) => {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export const useIsPhone = () =>
  useSyncExternalStore(
    subscribeToPhone,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );

// Pulling a sheet's top bar down this far closes it.
const CLOSE_DRAG_DISTANCE = 96;

// Lets a bottom sheet be dragged down by its top bar (the grab handle and the title row).
// Spread `handlers` on that bar and move the sheet by `style`.
export const useSheetDrag = (onClose: () => void) => {
  const startY = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    // Buttons in the bar, such as the close button, keep their own click.
    if (event.target instanceof Element && event.target.closest("button")) return;
    startY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (startY.current === null) return;
    setOffset(Math.max(0, event.clientY - startY.current));
  };
  const onPointerEnd = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (offset > CLOSE_DRAG_DISTANCE) onClose();
    setOffset(0);
  };

  return {
    style: offset ? { transform: `translateY(${offset}px)` } : undefined,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
};

// The grab handle on top of a bottom sheet: 12px from the sheet's edge. Screen readers get the
// sheet's close button instead.
export function SheetHandle(props: ReturnType<typeof useSheetDrag>["handlers"]) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className="flex shrink-0 cursor-grab touch-none justify-center pt-3 active:cursor-grabbing"
    >
      <span className="h-1 w-10 rounded-full bg-stroke-primary" />
    </div>
  );
}
