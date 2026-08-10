import Image from "next/image";

import bg from "@/assets/auth/bg.svg";
import { AuthBackgroundIcon } from "@/components/ui/icons";

const AuthPoster = () => (
  <div className="relative hidden flex-1 xl:flex">
    <Image
      src={bg}
      alt="Background"
      fill
      className="rounded-lg object-cover"
    />
    <div className="absolute right-9 bottom-16 left-9 space-y-3 text-neutral-50">
      <AuthBackgroundIcon />
      <div className="space-y-2">
        <p className="text-[30px] font-semibold">
          Відкривай нові бренди та унікальні товари щодня
        </p>
        <p className="text-base font-normal">Все, що ти шукаєш.</p>
      </div>
    </div>
  </div>
);

export default AuthPoster;
