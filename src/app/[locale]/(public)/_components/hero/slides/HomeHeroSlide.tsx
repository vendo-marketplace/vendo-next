import Image, { StaticImageData } from "next/image";

type Props = {
  image: StaticImageData;
  eager?: boolean;
};

const HomeHeroSlide = ({ image, eager = false }: Props) => {
  return (
    <div className="w-full shrink-0 relative h-83">
      <Image
        src={image}
        alt="Slide"
        fill
        sizes="(max-width: 1320px) 100vw, 1320px"
        loading={eager ? "eager" : "lazy"}
        className="object-cover"
      />
    </div>
  );
};

export default HomeHeroSlide;
