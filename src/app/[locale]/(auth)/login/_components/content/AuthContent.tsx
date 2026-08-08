"use client";

import FooterTopLogo from "@/app/[locale]/(public)/_components/footer/top/logo/FooterTopLogo";
import { Button } from "@/components/ui/button";
import { SignIn } from "@/features/auth/components/sign-in";
import AuthContentFooter from "./footer/AuthContentFooter";
import { GoogleIcon } from "@/components/ui/icons";

const AuthContent = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex  flex-1 items-center justify-center">
        <div className="w-120 space-y-6">
          <FooterTopLogo />
          <div className="flex flex-col w-full space-y-6">
            <div className="space-y-1">
              <p className="text-neutral-950 font-semibold text-[24px] leading-7.5">
                Ласкаво просимо назад
              </p>
              <p className="text-neutral-400 font-normal text-[16px] leading-6">
                Увійдіть у свій аккаунт
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Button className="flex-1">Вхід</Button>
              <Button className="flex-1">Реєстрація</Button>
            </div>
            <SignIn />
            <div className="flex items-center justify-between gap-4">
              <div className="h-px bg-neutral-100 w-full" />
              <span className="text-neutral-600 font-medium">або</span>
              <div className="h-px bg-neutral-100 w-full" />
            </div>
            <Button
              variant="secondary"
              className="w-full text-[14px] leading-5"
            >
              <GoogleIcon className="size-4" />
              <span>Увійти за допомогою Гугл</span>
            </Button>
          </div>
        </div>
      </div>
      <AuthContentFooter />
    </div>
  );
};

export default AuthContent;
