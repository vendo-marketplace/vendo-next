"use client";

import Image, { type StaticImageData } from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import mascotPoster from "@/assets/mascot/mascot-poster.png";
import photoArmchair from "@/assets/category-photos/home-garden.png";
import photoCar from "@/assets/category-photos/auto.png";
import photoClothes from "@/assets/category-photos/clothes.png";
import photoPhone from "@/assets/category-photos/electronics.png";
import { PhotoSearchIcon } from "@/assets/icons/NavIcons";
import { formatListingsCount } from "@/features/categories/components/category-filters/lib/filter-display";
import { AlphaVideo } from "@/features/mascot/components/AlphaVideo";
import { openPhotoSearch } from "@/features/photo-search/lib/photo-search-store";
import { useSearchProductsPage } from "@/features/products/hooks/use-products";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

// The grey the mascot clip was rendered on (sampled from the video).
const MASCOT_BACKDROP = [209, 211, 215] as const;
// One listing is enough to read the total from the response metadata.
const COUNT_QUERY = { page: 1, size: 1 };

// Where the sparkles sit on the blue banner, as offsets from its top-right corner.
const SPARKLES = [
  { top: "40%", right: "4%", size: 12, delay: "0.7s" },
  { top: "10%", right: "12%", size: 10, delay: "1.4s" },
] as const;

// The main banner, for sellers: brand blue with the mascot, which moves only while the banner is
// hovered. The button's ::after covers the banner, so the whole card is one link.
export function SellerBanner({ className }: { className?: string }) {
  return (
    <article
      data-hover-root
      className={cn(
        "group relative isolate flex overflow-hidden rounded-lg p-6 text-text-invert lg:p-8",
        className,
      )}
      style={{
        // A light bloom where the mascot sits, over a blue that lightens to sky blue at the far corner.
        background:
          "radial-gradient(55% 80% at 80% 70%, rgb(168 205 255 / 0.55) 0%, transparent 70%), linear-gradient(130deg, #105fff 0%, #2f7bff 45%, #4d95ff 80%, #6cb0ff 100%)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-16 -left-10 -z-10 size-56 rounded-full bg-white/15 blur-2xl"
      />
      {SPARKLES.map(({ top, right, size, delay }) => (
        <svg
          key={`${top}-${right}`}
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="absolute -z-10 fill-white motion-safe:animate-pulse"
          style={{
            top,
            right,
            width: size,
            height: size,
            animationDelay: delay,
          }}
        >
          <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
        </svg>
      ))}

      <div className="flex max-w-[60%] flex-col items-start gap-3 self-center sm:max-w-[55%]">
        <span className="rounded-sm bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
          ШІ-помічник · скоро
        </span>
        <h2 className="font-heading text-2xl leading-tight font-bold text-balance sm:text-3xl">
          Продайте за хвилину
        </h2>
        <p className="hidden text-md text-balance text-white/85 sm:block">
          Додайте фото й ціну — оголошення готове. Скоро ШІ підкаже назву й
          опис.
        </p>
        <Link
          href="/create"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-text-brand shadow-sm outline-offset-2 after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-white"
        >
          Створити оголошення
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Graphic lines around the mascot: a thin ring behind it. The mascot sits on top. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <span className="absolute top-1/2 right-[3%] hidden aspect-square h-[118%] -translate-y-[42%] rounded-full border-2 border-white/25 sm:block" />
        <InkSparkles items={[{ left: "60%", top: "14%", size: 14 }]} />
      </div>

      {/* Sized by the banner's height, so the mascot always fits whole, ears included. */}
      <div
        aria-hidden="true"
        className="absolute right-[2%] bottom-0 -z-10 aspect-square h-[72%] sm:right-[4%] sm:h-[94%]"
      >
        <AlphaVideo
          src="/media/mascot-404.mp4?v=2"
          poster={mascotPoster}
          backdrop={MASCOT_BACKDROP}
          frameSize={940}
          sizes="(min-width: 1024px) 256px, 40vw"
          playOnHover
        />
      </div>
    </article>
  );
}

// Outline colour of the sticker-style art on the side banner.
const INK = "#0b2e7a";
const SPARKLE_PATH =
  "M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z";
const SLIDE_INTERVAL_MS = 6000;

// A white card with an ink outline, slightly turned, like a sticker pinned to a board.
function Sticker({
  image,
  className,
}: {
  image: StaticImageData;
  className: string;
}) {
  return (
    <span
      className={cn(
        "absolute grid aspect-square place-items-center rounded-lg border-2 p-2 transition-transform duration-300 group-hover:rotate-0",
        className,
      )}
      style={{ borderColor: INK }}
    >
      <Image
        src={image}
        alt=""
        sizes="180px"
        className="max-h-full w-full object-contain"
      />
    </span>
  );
}

function InkSparkles({
  items,
}: {
  items: readonly ({ size: number } & CSSProperties)[];
}) {
  return items.map(({ size, ...position }) => (
    <svg
      key={Object.values(position).join("-")}
      viewBox="0 0 24 24"
      className="absolute fill-white motion-safe:animate-pulse"
      style={{ ...position, width: size, height: size }}
    >
      <path d={SPARKLE_PATH} stroke={INK} strokeWidth="1.5" />
    </svg>
  ));
}

function SlideBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-white px-2 py-0.5 text-xs font-semibold text-text-brand">
      {children}
    </span>
  );
}

const SLIDE_CLASS =
  "group relative isolate flex h-full w-full shrink-0 flex-col items-start gap-2 p-6";
const TITLE_CLASS =
  "max-w-[60%] font-heading text-2xl leading-tight font-bold text-balance text-text-brand-dark";
const TITLE_ACTION_CLASS =
  "cursor-pointer text-left outline-offset-2 after:absolute after:inset-0 after:content-[''] group-hover:text-text-brand focus-visible:outline-2 focus-visible:outline-stroke-brand";

// Slide 1: things people sell nearby, with a live count of listings and the mascot in a circle.
function NearbySlide({ count }: { count?: number }) {
  return (
    <div className={SLIDE_CLASS} style={{ background: "#cfe3ff" }}>
      <SlideBadge>
        {count
          ? `${formatListingsCount(count)} по всій Україні`
          : "Оголошення по всій Україні"}
      </SlideBadge>
      <h2 className={TITLE_CLASS}>
        <Link href="/search" className={TITLE_ACTION_CLASS}>
          Знайдіть потрібне поруч
          <ArrowRightIcon className="ml-1.5 inline size-5 align-[-0.15em] transition-transform group-hover:translate-x-0.5" />
        </Link>
      </h2>

      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <svg
          viewBox="0 0 120 60"
          fill="none"
          className="absolute top-[44%] right-[4%] w-[26%]"
        >
          <path
            d="M2 50 C 30 10, 70 60, 92 22 S 112 8, 118 14"
            stroke={INK}
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute top-[6%] right-[5%] aspect-square w-[30%] overflow-hidden rounded-full border-2 bg-surface-brand transition-transform duration-300 group-hover:-rotate-3"
          style={{ borderColor: INK }}
        >
          <Image
            src={mascotPoster}
            alt=""
            sizes="160px"
            className="absolute -bottom-[14%] left-1/2 w-[118%] max-w-none -translate-x-1/2"
          />
        </span>
        <Sticker
          image={photoPhone}
          className="bottom-[13%] left-[5%] w-[24%] -rotate-6 bg-white"
        />
        <Sticker
          image={photoCar}
          className="bottom-[9%] left-[33%] w-[32%] rotate-3 border-dashed bg-white/35"
        />
        <Sticker
          image={photoArmchair}
          className="right-[5%] bottom-[13%] w-[24%] rotate-6 bg-white"
        />
        <span
          className="absolute top-[24%] right-[34%] grid size-9 -rotate-6 place-items-center rounded-md border-2 bg-white"
          style={{ borderColor: INK }}
        >
          <svg viewBox="0 0 24 24" className="size-5 fill-surface-brand">
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" />
          </svg>
        </span>
        <InkSparkles
          items={[
            { left: "28%", bottom: "46%", size: 16 },
            { right: "36%", top: "9%", size: 11 },
            { right: "2%", bottom: "48%", size: 13 },
          ]}
        />
      </div>
    </div>
  );
}

// Slide 2: photo search. A photo of sneakers inside a phone's scanner frame, and the matches it
// found pinned beside it. The title opens the photo search dialog.
function PhotoSearchSlide() {
  return (
    <div className={SLIDE_CLASS} style={{ background: "#d6efff" }}>
      <SlideBadge>Новинка</SlideBadge>
      <h2 className={TITLE_CLASS}>
        <button
          type="button"
          onClick={openPhotoSearch}
          className={TITLE_ACTION_CLASS}
        >
          Шукайте товари за фото
          <ArrowRightIcon className="ml-1.5 inline size-5 align-[-0.15em] transition-transform group-hover:translate-x-0.5" />
        </button>
      </h2>
      <p className="max-w-[54%] text-sm text-balance text-text-secondary">
        Сфотографуйте річ — покажемо схожі оголошення.
      </p>

      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {/* The phone, with a dashed scanner frame around the photo. */}
        <span
          className="absolute top-[8%] right-[6%] h-[80%] w-[32%] rotate-3 rounded-[18px] border-[3px] bg-surface-brand p-2 transition-transform duration-300 group-hover:rotate-0"
          style={{ borderColor: INK }}
        >
          <span className="relative grid h-full place-items-center rounded-[10px] bg-white">
            <Image
              src={photoClothes}
              alt=""
              sizes="160px"
              className="w-[78%] object-contain"
            />
            <span className="absolute inset-[12%] rounded-md border-2 border-dashed border-surface-brand" />
          </span>
        </span>
        {/* The camera button. */}
        <span
          className="absolute top-[5%] right-[33%] grid size-11 -rotate-6 place-items-center rounded-full border-2 bg-white text-text-brand"
          style={{ borderColor: INK }}
        >
          <PhotoSearchIcon size={20} />
        </span>
        {/* The matches it found. */}
        <Sticker
          image={photoClothes}
          className="bottom-[12%] left-[6%] w-[22%] -rotate-6 bg-white"
        />
        <span
          className="absolute bottom-[20%] left-[30%] -rotate-3 rounded-full border-2 bg-white px-2.5 py-1 text-xs font-bold text-text-brand-dark"
          style={{ borderColor: INK }}
        >
          Схожі товари
        </span>
        <svg
          viewBox="0 0 120 60"
          fill="none"
          className="absolute right-[38%] bottom-[30%] w-[18%] -scale-x-100"
        >
          <path
            d="M2 50 C 30 10, 70 60, 92 22 S 112 8, 118 14"
            stroke={INK}
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />
        </svg>
        <InkSparkles
          items={[
            { left: "32%", bottom: "14%", size: 15 },
            { right: "2%", top: "12%", size: 12 },
            { right: "44%", top: "30%", size: 10 },
          ]}
        />
      </div>
    </div>
  );
}

const SLIDE_COUNT = 2;

// The side banner for buyers: a small carousel of sticker-style slides. It slides on every few
// seconds, pauses while hovered or focused (and never auto-advances with reduced motion), and the
// dots and arrows switch slides by hand. Hidden slides are inert, so Tab skips them.
export function BuyerBanner({ className }: { className?: string }) {
  const { data } = useSearchProductsPage("", COUNT_QUERY);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % SLIDE_COUNT),
      SLIDE_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const slides = [
    <NearbySlide key="nearby" count={data?.metadata.totalElements} />,
    <PhotoSearchSlide key="photo" />,
  ];

  return (
    <section
      aria-roledescription="карусель"
      aria-label="Можливості Vendo"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "group/carousel relative isolate overflow-hidden rounded-lg text-text-primary",
        className,
      )}
    >
      <div
        className="flex h-full transition-[translate] duration-500 ease-out motion-reduce:transition-none"
        style={{ translate: `${-100 * active}% 0` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            role="group"
            aria-roledescription="слайд"
            aria-label={`${index + 1} з ${SLIDE_COUNT}`}
            aria-hidden={index !== active}
            inert={index !== active}
            className="flex h-full w-full shrink-0"
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/70 px-2 py-1.5 backdrop-blur-sm">
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            aria-label={`Слайд ${index + 1}`}
            aria-current={index === active}
            onClick={() => setActive(index)}
            className={cn(
              "relative h-2 cursor-pointer rounded-full transition-[width,background-color] duration-300 after:absolute after:-inset-2 after:content-['']",
              index === active
                ? "w-5 bg-surface-brand"
                : "w-2 bg-stroke-brand-subtle hover:bg-stroke-brand-light",
            )}
          />
        ))}
      </div>
    </section>
  );
}
