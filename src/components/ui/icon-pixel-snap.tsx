"use client";

import { useEffect } from "react";

// Icons above this size are illustrations, not UI icons, and don't need snapping.
const MAX_ICON_SIZE = 48;

const toDevicePixel = (value: number, ratio: number) =>
  (Math.round(value * ratio) - value * ratio) / ratio;

// Fluid layouts (fr columns, centring, text widths) often put icons at
// fractional pixels, and on 100%-scale monitors the browser then smears their
// thin strokes across two pixels. Shift each icon by that fraction so it lands
// on the device pixel grid.
const snapIcons = () => {
  const ratio = window.devicePixelRatio || 1;
  // Spinning icons change their box every frame, so they are left alone.
  const icons = [...document.querySelectorAll<SVGSVGElement>("svg")].filter(
    (icon) =>
      !icon.ownerSVGElement &&
      !icon.getAnimations().some((animation) => animation instanceof CSSAnimation),
  );

  // Without this, icons with transition-transform are measured (and moved)
  // mid-animation. Reads and writes are batched to avoid layout thrashing.
  const transitions = icons.map((icon) => icon.style.transition);
  icons.forEach((icon) => (icon.style.transition = "none"));

  const offsets = icons.map((icon) => {
    const rect = icon.getBoundingClientRect();
    if (!rect.width || rect.width > MAX_ICON_SIZE || rect.height > MAX_ICON_SIZE) return null;

    const appliedX = Number(icon.dataset.snapX ?? 0);
    const appliedY = Number(icon.dataset.snapY ?? 0);
    return {
      x: toDevicePixel(rect.left - appliedX, ratio),
      y: toDevicePixel(rect.top - appliedY, ratio),
    };
  });

  icons.forEach((icon, index) => {
    const offset = offsets[index];
    if (!offset) return;

    icon.dataset.snapX = String(offset.x);
    icon.dataset.snapY = String(offset.y);
    icon.style.transform =
      offset.x || offset.y ? `translate(${offset.x}px, ${offset.y}px)` : "";
  });

  void document.body.offsetWidth; // apply the new transforms before transitions come back
  icons.forEach((icon, index) => (icon.style.transition = transitions[index]));
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
    document.fonts.addEventListener("loadingdone", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", schedule);
      document.fonts.removeEventListener("loadingdone", schedule);
    };
  }, []);

  return null;
}
