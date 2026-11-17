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
  className?: string;
};

// A looping, muted, see-through video of the mascot. It plays only while on screen.
export function AlphaVideo({ src, poster, backdrop, frameSize, sizes, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const renderer = createAlphaVideoRenderer(canvas, backdrop);
    if (!renderer) return;

    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    let frame = 0;
    let hasFrame = false;
    const render = () => {
      if (video.readyState >= 2) {
        renderer.draw(video);
        if (!hasFrame) {
          hasFrame = true;
          setIsPlaying(true);
        }
      }
      frame = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        video.play().catch(() => {});
        frame = requestAnimationFrame(render);
      } else {
        video.pause();
        cancelAnimationFrame(frame);
      }
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, backdrop]);

  return (
    <div aria-hidden="true" className={cn("relative", className)} style={{ aspectRatio: "1 / 1" }}>
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes={sizes}
        className={cn("transition-opacity duration-300", isPlaying && "opacity-0")}
      />
      <canvas
        ref={canvasRef}
        width={frameSize}
        height={frameSize}
        className={cn("absolute inset-0 size-full opacity-0 transition-opacity duration-300", isPlaying && "opacity-100")}
      />
    </div>
  );
}
