import Image from "next/image";
import { ArrowRightIcon, BellIcon } from "lucide-react";

import photoArmchair from "@/assets/category-photos/home-garden.png";
import photoPhone from "@/assets/category-photos/electronics.png";
import mascotPoster from "@/assets/mascot/mascot-poster.png";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

// Outline colour of the sticker-style art, the same as on the homepage banners.
const INK = "#0b2e7a";
const SPARKLE_PATH =
  "M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z";

// Sparkles around the art, as offsets inside the art box.
const SPARKLES = [
  { left: "-6%", top: "4%", size: 12 },
  { right: "-4%", top: "46%", size: 14 },
  { left: "40%", bottom: "-4%", size: 10 },
] as const;

const STICKERS = [
  {
    image: photoPhone,
    className: "bottom-0 left-0 w-[50%] -rotate-6 bg-white",
  },
  {
    image: photoArmchair,
    className: "right-0 bottom-[6%] w-[44%] rotate-6 border-dashed bg-white/50",
  },
] as const;

// A pause in the feed, two columns wide: an invitation to save a search, so new listings come to
// you. Two groups, each centred in the card's height, so the card holds together however tall
// the row is: the pitch with a sample notification and the button on the left, the mascot in a
// circle with fresh listings pinned under it on the right (phones show just the circle, tucked in the top corner). The
// whole card is one link.
export function SavedSearchCard() {
  return (
    <Link
      href="/auto-search"
      className="group relative isolate col-span-2 flex h-full items-center gap-4 overflow-hidden rounded-lg p-5 outline-offset-2 focus-visible:outline-2 focus-visible:outline-stroke-brand sm:gap-6 sm:p-6"
      style={{ background: "#cfe3ff" }}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <span className="rounded-sm bg-white px-2 py-0.5 text-xs font-semibold text-text-brand">
          Автопошук
        </span>
        <h2 className="font-heading text-xl leading-tight font-bold text-balance text-text-brand-dark max-sm:max-w-[62%]">
          Нове оголошення — одразу вам
        </h2>
        <p className="text-sm text-balance text-text-secondary max-sm:max-w-[62%]">
          Збережіть пошук, і ми повідомимо, щойно з’явиться потрібне.
        </p>

        {/* What the notification looks like, as a sticker. */}
        <span
          aria-hidden="true"
          className="mt-1 flex max-w-full -rotate-2 items-center gap-2.5 rounded-lg border-2 bg-white p-2.5 transition-transform duration-300 group-hover:rotate-0"
          style={{ borderColor: INK }}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-brand text-text-invert">
            <BellIcon className="size-4" strokeWidth={2.25} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-xs text-text-secondary">
              За вашим пошуком
            </span>
            <span className="truncate text-sm font-semibold text-text-brand-dark">
              iPhone 15 · 32 900 грн
            </span>
          </span>
        </span>

        <span
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border-2 whitespace-nowrap bg-white px-4 py-2 text-sm font-semibold text-text-brand-dark transition-colors group-hover:bg-surface-brand-subtle"
          style={{ borderColor: INK }}
        >
          Стежити за пошуком
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      {/* The art: one box with a fixed shape, so its parts never drift apart. */}
      <div
        aria-hidden="true"
        className="relative aspect-square w-[42%] max-w-72 shrink-0 max-sm:absolute max-sm:top-5 max-sm:right-5 max-sm:w-24 sm:aspect-[1/1.15]"
      >
        <span
          className="absolute top-0 left-1/2 aspect-square w-full -translate-x-1/2 overflow-hidden rounded-full border-2 bg-surface-brand transition-transform duration-300 group-hover:-rotate-3 sm:w-[78%]"
          style={{ borderColor: INK }}
        >
          <Image
            src={mascotPoster}
            alt=""
            sizes="200px"
            className="absolute -bottom-[14%] left-1/2 w-[118%] max-w-none -translate-x-1/2"
          />
        </span>

        {/* Fresh listings, pinned under the circle like stickers. */}
        {STICKERS.map(({ image, className }) => (
          <span
            key={image.src}
            className={cn(
              "absolute hidden aspect-square place-items-center rounded-lg border-2 p-2 transition-transform duration-300 group-hover:rotate-0 sm:grid",
              className,
            )}
            style={{ borderColor: INK }}
          >
            <Image
              src={image}
              alt=""
              sizes="140px"
              className="max-h-full w-full object-contain"
            />
          </span>
        ))}
        <span
          className="absolute bottom-[40%] left-[-6%] hidden -rotate-6 rounded-full border-2 bg-white px-2.5 py-0.5 text-xs font-bold text-text-brand sm:block"
          style={{ borderColor: INK }}
        >
          Нове
        </span>

        {SPARKLES.map(({ size, ...position }) => (
          <svg
            key={Object.values(position).join("-")}
            viewBox="0 0 24 24"
            className="absolute fill-white motion-safe:animate-pulse"
            style={{ ...position, width: size, height: size }}
          >
            <path d={SPARKLE_PATH} stroke={INK} strokeWidth="1.5" />
          </svg>
        ))}
      </div>
    </Link>
  );
}
