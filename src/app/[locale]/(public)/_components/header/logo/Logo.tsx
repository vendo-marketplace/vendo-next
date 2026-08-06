import logoUrl from "@/assets/icons/logo.svg";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <Link href={"/"} className="relative size-9">
      <Image
        src={logoUrl}
        sizes="36px"
        fill
        alt="Vendo logo"
        className={className}
      />
    </Link>
  );
};

export default Logo;
