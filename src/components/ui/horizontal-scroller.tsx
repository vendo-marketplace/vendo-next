"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/utils/utils";

type Props = {
  // An accessible name for the list, e.g. "Категорії".
  label: string;
  children: ReactNode;
  className?: string;
};

type Thumb = { size: number; offset: number; scrollable: boolean };

// A row that scrolls sideways: swipe or trackpad, and a thin bar underneath that shows how much is
// left and can be dragged or clicked with a mouse. The bar hides when everything fits.
export function HorizontalScroller({ label, children, className }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);
  const [thumb, setThumb] = useState<Thumb>({
    size: 1,
    offset: 0,
    scrollable: false,
  });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      const maxScroll = list.scrollWidth - list.clientWidth;
      const size = list.clientWidth / list.scrollWidth;
      setThumb({
        size,
        offset: maxScroll > 0 ? (list.scrollLeft / maxScroll) * (1 - size) : 0,
        scrollable: maxScroll > 4,
      });
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  // Dragging the thumb scrolls the row by the same share of its width.
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const list = listRef.current;
    if (!list) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    // Snapping would fight the drag, so it pauses until the thumb is let go.
    list.style.scrollSnapType = "none";
    dragRef.current = { startX: event.clientX, startScroll: list.scrollLeft };
  };

  const drag = (event: PointerEvent<HTMLDivElement>) => {
    const list = listRef.current;
    const track = trackRef.current;
    if (!list || !track || !dragRef.current) return;
    const ratio = list.scrollWidth / track.clientWidth;
    list.scrollLeft =
      dragRef.current.startScroll +
      (event.clientX - dragRef.current.startX) * ratio;
  };

  const endDrag = () => {
    dragRef.current = null;
    if (listRef.current) listRef.current.style.scrollSnapType = "";
  };

  // Clicking the track (outside the thumb) brings that part of the row into view.
  const jumpTo = (event: PointerEvent<HTMLDivElement>) => {
    const list = listRef.current;
    const track = trackRef.current;
    if (!list || !track || event.target !== track) return;
    const share =
      (event.clientX - track.getBoundingClientRect().left) / track.clientWidth;
    list.scrollTo({
      left: share * list.scrollWidth - list.clientWidth / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <ul
        ref={listRef}
        aria-label={label}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 py-2 md:mx-0 md:scroll-px-0 md:px-0",
          className,
        )}
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </ul>
      {thumb.scrollable && (
        <div
          ref={trackRef}
          aria-hidden="true"
          onPointerDown={jumpTo}
          className="relative hidden h-1 cursor-pointer rounded-full bg-stroke-secondary md:block"
        >
          <div
            onPointerDown={startDrag}
            onPointerMove={drag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="absolute inset-y-0 cursor-grab rounded-full bg-surface-brand transition-[height] after:absolute after:-inset-y-2 after:inset-x-0 after:content-[''] active:cursor-grabbing"
            style={{
              width: `${thumb.size * 100}%`,
              left: `${thumb.offset * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
