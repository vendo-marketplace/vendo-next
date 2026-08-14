import logoUrl from "@/assets/icons/logo.svg";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";
import Image from "next/image";

interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <Link href="/" className={cn("block h-9 w-auto", className)}>
      <Image
        src={logoUrl}
        alt="Vendo logo"
        className="h-9 w-auto"
      />
    </Link>
  );
};

export default Logo;
