import banner1 from "@/assets/home/hero-banner.jpg";
import banner2 from "@/assets/home/hero-banner(2).jpg";
import banner3 from "@/assets/home/hero-banner(3).jpg";
import { StaticImageData } from "next/image";

export interface HeroSlide {
  id: number;
  image: StaticImageData;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: banner1,
  },
  {
    id: 2,
    image: banner2,
  },
  {
    id: 3,
    image: banner3,
  },
];
