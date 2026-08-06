import Image, { StaticImageData } from "next/image";

type Props = {
  image: StaticImageData;
};

const HomeHeroSlide = ({ image }: Props) => {
  return (
    <div className="w-full shrink-0 relative h-83">
      <Image
        src={image}
        alt="Slide"
        fill
        className="block w-full object-cover"
      />
    </div>
  );
};

export default HomeHeroSlide;
