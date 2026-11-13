"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/utils";

import { createAlphaVideoRenderer } from "../lib/alpha-video-renderer";

type Props = {
  // A stacked-alpha video: picture on top, matte below (see alpha-video-renderer).
  src: string;
  // Shown until the first frame is drawn, and instead of the video when motion is reduced.
  poster: StaticImageData;
  // The flat colour the video was shot on, as 0–255 RGB.
  backdrop: readonly [number, number, number];
  // Width of one frame in pixels; frames are square.
  frameSize: number;
  sizes: string;
  // Stand still on the first frame and play only while the nearest `[data-hover-root]`, link or button is
  // hovered or focused, instead of looping whenever the clip is on screen.
  playOnHover?: boolean;
  className?: string;
};

// A muted, see-through video of the mascot. By default it loops while on screen; with
// `playOnHover` it moves only while the pointer (or keyboard focus) is on its card.
export function AlphaVideo({
  src,
  poster,
  backdrop,
  frameSize,
  sizes,
  playOnHover = false,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const renderer = createAlphaVideoRenderer(canvas, backdrop);
    if (!renderer) return;

    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    let frame = 0;
    const drawFrame = () => {
      if (video.readyState < 2) return;
      renderer.draw(video);
      setHasFrame(true);
    };
    const loop = () => {
      drawFrame();
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      video.play().catch(() => {});
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };
    const pause = () => {
      video.pause();
      cancelAnimationFrame(frame);
      drawFrame();
    };

    if (playOnHover) {
      // Still until hovered: show the first frame as soon as it is decoded.
      video.addEventListener("loadeddata", drawFrame, { once: true });
      const target =
        canvas.closest("[data-hover-root], a, button") ?? canvas.parentElement;
      if (!target) return;
      target.addEventListener("pointerenter", play);
      target.addEventListener("pointerleave", pause);
      target.addEventListener("focusin", play);
      target.addEventListener("focusout", pause);
      return () => {
        target.removeEventListener("pointerenter", play);
        target.removeEventListener("pointerleave", pause);
        target.removeEventListener("focusin", play);
        target.removeEventListener("focusout", pause);
        cancelAnimationFrame(frame);
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) play();
      else pause();
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, backdrop, playOnHover]);

  return (
    <div
      aria-hidden="true"
      className={cn("relative", className)}
      style={{ aspectRatio: "1 / 1" }}
    >
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes={sizes}
        className={cn(
          "transition-opacity duration-300",
          hasFrame && "opacity-0",
        )}
      />
      <canvas
        ref={canvasRef}
        width={frameSize}
        height={frameSize}
        className={cn(
          "absolute inset-0 size-full opacity-0 transition-opacity duration-300",
          hasFrame && "opacity-100",
        )}
      />
    </div>
  );
}
