"use client";

import { useEffect } from "react";

// Icons above this size are illustrations, not UI icons, and don't need snapping.
const MAX_ICON_SIZE = 48;

type Snap = { x: number; y: number; animation: Animation };

// The offset is applied with a Web Animation instead of inline styles or data
// attributes: React hydrates some icons later (inside Suspense boundaries), and
// any attribute changed on them before that would be a hydration mismatch.
const snaps = new WeakMap<SVGSVGElement, Snap>();

const toDevicePixel = (value: number, ratio: number) =>
  (Math.round(value * ratio) - value * ratio) / ratio;

const isOwnAnimation = (icon: SVGSVGElement, animation: Animation) =>
  snaps.get(icon)?.animation === animation;

// Icons that are spinning or mid-transition change their box every frame, so
// they are skipped; a transitionend triggers another pass once they settle.
const isMoving = (icon: SVGSVGElement) =>
  icon
    .getAnimations()
    .some((animation) => !isOwnAnimation(icon, animation) && animation.playState === "running");

const applySnap = (icon: SVGSVGElement, x: number, y: number) => {
  const current = snaps.get(icon);

  if (!x && !y) {
    current?.animation.cancel();
    snaps.delete(icon);
    return;
  }

  if (current?.x === x && current.y === y) return;

  const keyframe = { transform: `translate(${x}px, ${y}px)` };
  current?.animation.cancel();
  const animation = icon.animate([keyframe, keyframe], { fill: "forwards" });
  snaps.set(icon, { x, y, animation });
};

// Fluid layouts (fr columns, centring, text widths) often put icons at
// fractional pixels, and on 100%-scale monitors the browser then smears their
// thin strokes across two pixels. Shift each icon by that fraction so it lands
// on the device pixel grid.
const snapIcons = () => {
  const ratio = window.devicePixelRatio || 1;
  const icons = [...document.querySelectorAll<SVGSVGElement>("svg")].filter(
    (icon) => !icon.ownerSVGElement && !isMoving(icon),
  );

  // All reads happen before any write to avoid layout thrashing.
  const offsets = icons.map((icon) => {
    const rect = icon.getBoundingClientRect();
    if (!rect.width || rect.width > MAX_ICON_SIZE || rect.height > MAX_ICON_SIZE) return null;

    const applied = snaps.get(icon);
    return {
      x: toDevicePixel(rect.left - (applied?.x ?? 0), ratio),
      y: toDevicePixel(rect.top - (applied?.y ?? 0), ratio),
    };
  });

  icons.forEach((icon, index) => {
    const offset = offsets[index];
    if (offset) applySnap(icon, offset.x, offset.y);
  });
};

export default function IconPixelSnap() {
  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(snapIcons);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("transitionend", schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", schedule);
      document.removeEventListener("transitionend", schedule);
      document.fonts.removeEventListener("loadingdone", schedule);
    };
  }, []);

  return null;
}
