"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";

import type { CropArea } from "../lib/photo-file";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const CORNERS: Corner[] = ["top-left", "top-right", "bottom-left", "bottom-right"];
const MIN_SIZE = 0.15;

const CORNER_LABELS: Record<Corner, string> = {
  "top-left": "Верхній лівий кут рамки",
  "top-right": "Верхній правий кут рамки",
  "bottom-left": "Нижній лівий кут рамки",
  "bottom-right": "Нижній правий кут рамки",
};

// White L-shaped marks on the frame's corners, as in Figma 5129-27063.
const CORNER_CLASSNAME: Record<Corner, string> = {
  "top-left": "-top-1 -left-1 cursor-nwse-resize border-t-4 border-l-4 rounded-tl-md",
  "top-right": "-top-1 -right-1 cursor-nesw-resize border-t-4 border-r-4 rounded-tr-md",
  "bottom-left": "-bottom-1 -left-1 cursor-nesw-resize border-b-4 border-l-4 rounded-bl-md",
  "bottom-right": "-bottom-1 -right-1 cursor-nwse-resize border-b-4 border-r-4 rounded-br-md",
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Moves one corner to a point (in fractions of the image), keeping the opposite corner put.
const moveCorner = (area: CropArea, corner: Corner, x: number, y: number): CropArea => {
  const left = area.x;
  const top = area.y;
  const right = area.x + area.width;
  const bottom = area.y + area.height;

  const nextLeft = corner.endsWith("left") ? clamp(x, 0, right - MIN_SIZE) : left;
  const nextRight = corner.endsWith("right") ? clamp(x, left + MIN_SIZE, 1) : right;
  const nextTop = corner.startsWith("top") ? clamp(y, 0, bottom - MIN_SIZE) : top;
  const nextBottom = corner.startsWith("bottom") ? clamp(y, top + MIN_SIZE, 1) : bottom;

  return { x: nextLeft, y: nextTop, width: nextRight - nextLeft, height: nextBottom - nextTop };
};

// Keyboard: arrows move the focused corner by 2% (10% with Shift).
const KEY_STEPS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function PhotoCropper({
  src,
  area,
  onChange,
}: {
  src: string;
  area: CropArea;
  onChange: (area: CropArea) => void;
}) {
  const imageBoxRef = useRef<HTMLDivElement>(null);

  const startDrag = (corner: Corner) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    const box = imageBoxRef.current?.getBoundingClientRect();
    if (!box) return;
    event.currentTarget.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      const x = (moveEvent.clientX - box.left) / box.width;
      const y = (moveEvent.clientY - box.top) / box.height;
      onChange(moveCorner(area, corner, x, y));
    };
    const target = event.currentTarget;
    const stop = () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", stop);
      target.removeEventListener("pointercancel", stop);
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", stop);
    target.addEventListener("pointercancel", stop);
  };

  return (
    <div className="flex justify-center">
      <div ref={imageBoxRef} className="relative overflow-hidden rounded-sm select-none">
        {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL, not a remote asset */}
        <img
          src={src}
          alt="Фото для пошуку"
          draggable={false}
          className="block max-h-80 w-auto max-w-full"
        />
        {/* The frame darkens everything outside it with a wide shadow. */}
        <div
          className="absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.43)]"
          style={{
            left: `${area.x * 100}%`,
            top: `${area.y * 100}%`,
            width: `${area.width * 100}%`,
            height: `${area.height * 100}%`,
          }}
        >
          {CORNERS.map((corner) => (
            <button
              key={corner}
              type="button"
              aria-label={CORNER_LABELS[corner]}
              onPointerDown={startDrag(corner)}
              onKeyDown={(event) => {
                const step = KEY_STEPS[event.key];
                if (!step) return;
                event.preventDefault();
                const delta = event.shiftKey ? 0.1 : 0.02;
                const x = corner.endsWith("left") ? area.x : area.x + area.width;
                const y = corner.startsWith("top") ? area.y : area.y + area.height;
                onChange(moveCorner(area, corner, x + step[0] * delta, y + step[1] * delta));
              }}
              className={`absolute size-6 touch-none border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-brand ${CORNER_CLASSNAME[corner]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
