import Image from "next/image";

import propsLeft from "@/assets/mascot/props-left.png";
import propsRight from "@/assets/mascot/props-right.png";
import mascotPoster from "@/assets/mascot/mascot-poster.png";
import { Button } from "@/components/ui/button/button";
import { AlphaVideo } from "@/features/mascot/components/AlphaVideo";
import { Link } from "@/i18n/navigation";

// The grey the mascot clip was rendered on (sampled from the video).
const MASCOT_BACKDROP = [209, 211, 215] as const;
// The light floor colour the props were rendered on, so their soft floor shadows blend in.
const PAGE_BACKGROUND = "#eff5fe";
// Things people sell on Vendo, huddled right behind her and blurred like an out-of-focus
// background: a house and a car on the left, a bike, an armchair and parcels on the right.
const PROP_GROUPS = [
  { image: propsLeft, style: { left: "5%", bottom: "19%", width: "37%" } },
  { image: propsRight, style: { right: "1%", bottom: "19%", width: "44%" } },
] as const;

// The 404 page, staged like a little diorama: a big "404" far behind, things people sell on
// Vendo (a house, a car, a bike, an armchair…) in the middle, and our spitz up front.
// It sits in the public layout, so the header and footer stay around it.
export function NotFoundView() {
  return (
    <section
      className="relative flex flex-col items-center overflow-x-clip px-4 pb-16"
      // The page column stops at 1440px; the shadow carries the colour out to the window edges.
      style={{ backgroundColor: PAGE_BACKGROUND, boxShadow: `0 0 0 100vmax ${PAGE_BACKGROUND}`, clipPath: "inset(0 -100vmax)" }}
    >
      {/* Sized in container units, so the "404", the props and the dog keep their proportions.
          The stage is wider than a phone screen, so on phones its sides are simply cropped. */}
      <div
        className="relative shrink-0"
        style={{ width: "clamp(44rem, 100%, 70rem)", aspectRatio: "16 / 9", containerType: "inline-size" }}
      >
        <p
          aria-hidden="true"
          className="absolute inset-x-0 text-center font-heading leading-none font-bold tracking-tight select-none"
          // Sized to stay inside the stage with room to spare; the bottom fades away behind the props.
          style={{
            top: "-2%",
            fontSize: "34cqw",
            color: "rgb(16 95 255 / 0.12)",
            maskImage: "linear-gradient(to bottom, #000 35%, transparent 80%)",
          }}
        >
          404
        </p>
        {PROP_GROUPS.map(({ image, style }) => (
          <Image
            key={image.src}
            src={image}
            alt=""
            priority
            sizes="(min-width: 1120px) 540px, 48vw"
            className="absolute h-auto"
            style={{ ...style, filter: "blur(3px)" }}
          />
        ))}
        {/* She stands in front of the props: bigger, and lower than their floor line. */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ width: "46%", bottom: "-3%" }}>
          <AlphaVideo
            src="/media/mascot-404.mp4?v=2"
            poster={mascotPoster}
            backdrop={MASCOT_BACKDROP}
            frameSize={940}
            sizes="(min-width: 1120px) 520px, 46vw"
          />
        </div>
      </div>

      <div className="relative -mt-3 flex flex-col items-center gap-2 text-center">
        <h1
          className="font-heading leading-tight font-bold text-text-primary"
          style={{ fontSize: "clamp(1.75rem, 1rem + 2.6vw, 3rem)" }}
        >
          Ой, здається, ми заблукали
        </h1>
        <p className="leading-relaxed text-balance text-text-secondary" style={{ fontSize: "clamp(1rem, 0.85rem + 0.5vw, 1.25rem)" }}>
          Такої сторінки немає або її прибрали. Повернімось туди, де все знайоме.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/">На головну</Link>
        </Button>
      </div>
    </section>
  );
}
