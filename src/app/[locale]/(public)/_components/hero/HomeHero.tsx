"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import banner from "@/assets/home/banner.png";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

import { Button } from "@/components/ui/button/button";

const heroSlides = [banner, banner, banner];

const firstRealSlideIndex = 1;
const lastRealSlideIndex = heroSlides.length;

const sliderSlides = [
  heroSlides[heroSlides.length - 1],
  ...heroSlides,
  heroSlides[0],
];

export default function HomeHero() {
  const [trackIndex, setTrackIndex] = useState(firstRealSlideIndex);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePreviousSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsTransitionEnabled(true);
    setTrackIndex((index) => index - 1);
  };

  const goToNextSlide = () => {
    setIsAnimating(true);
    setIsTransitionEnabled(true);
    setTrackIndex((index) => index + 1);
  };

  const handleNextSlide = () => {
    if (isAnimating) return;

    goToNextSlide();
  };

  const handleTransitionEnd = () => {
    const firstCloneIndex = 0;
    const lastCloneIndex = heroSlides.length + 1;

    if (trackIndex === firstCloneIndex) {
      setIsTransitionEnabled(false);
      setTrackIndex(lastRealSlideIndex);
    }

    if (trackIndex === lastCloneIndex) {
      setIsTransitionEnabled(false);
      setTrackIndex(firstRealSlideIndex);
    }

    setIsAnimating(false);
  };

  useEffect(() => {
    if (isAnimating) return;

    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [isAnimating]);

  return (
    <section className="page-container pt-4 pb-2 sm:pt-6 sm:pb-4 lg:mt-4 lg:py-6">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={[
            "flex",
            isTransitionEnabled &&
              "transition-transform duration-1200 ease-in-out",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translateX(-${trackIndex * 100}%)` }}
        >
          {sliderSlides.map((image, index) => (
            <div
              key={index}
              className="relative h-40 w-full shrink-0 sm:h-56 md:h-68 lg:h-83"
            >
              <Image
                src={image}
                alt="Slide"
                fill
                sizes="(max-width: 1320px) 100vw, 1320px"
                loading={index === firstRealSlideIndex ? "eager" : "lazy"}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="none"
          aria-label="Попередній слайд"
          className="absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-full p-0 sm:left-3 sm:size-10"
          onClick={handlePreviousSlide}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="none"
          aria-label="Наступний слайд"
          className="absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-full p-0 sm:right-3 sm:size-10"
          onClick={handleNextSlide}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </section>
  );
}
