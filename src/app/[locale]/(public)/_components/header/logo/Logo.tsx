import logoUrl from "@/assets/icons/logo-vendo.svg";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";
import Image from "next/image";

interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <Link href="/" aria-label="Vendo — на головну" className={cn("block w-fit", className)}>
      <Image src={logoUrl} alt="" priority className="h-7 w-auto md:h-9 lg:h-11" />
    </Link>
  );
};

export default Logo;
