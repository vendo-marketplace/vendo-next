import bg from "@/assets/auth/bg.svg";
import { AuthBackgroundIcon } from "@/components/ui/icons";
import Image from "next/image";

import React from "react";

const AuthPoster = () => {
  return (
    <div className="flex flex-1 relative">
      <Image
        src={bg}
        alt="Background"
        fill
        className="rounded-lg object-cover"
      />
      <div className="absolute left-9 right-9 bottom-16 space-y-3 text-neutral-50">
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
};

export default AuthPoster;
