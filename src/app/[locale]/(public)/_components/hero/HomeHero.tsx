"use client";

import { useEffect, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

import HomeHeroSlide from "./slides/HomeHeroSlide";
import { Button } from "@/components/ui/button";
import { heroSlides } from "./slides/slides";

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
    <section className="py-6 mt-4">
      <div className="relative overflow-hidden rounded-2xl mx-auto w-full max-w-330">
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
          {sliderSlides.map((slide, index) => (
            <HomeHeroSlide key={`${slide.id} - ${index}`} image={slide.image} />
          ))}
        </div>

        <Button
          variant="secondary"
          size="none"
          aria-label="Попередній слайд"
          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full size-10 p-0 "
          onClick={handlePreviousSlide}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="none"
          aria-label="Наступний слайд"
          className="absolute top-1/2 right-3 -translate-y-1/2 size-10 p-0 rounded-full "
          onClick={handleNextSlide}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </section>
  );
}
