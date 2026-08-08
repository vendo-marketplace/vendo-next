"use client";

import FooterTopLogo from "@/app/[locale]/(public)/_components/footer/top/logo/FooterTopLogo";
import { Button } from "@/components/ui/button";
import { SignInForm } from "@/features/auth/components/sign-in-form";
import AuthContentFooter from "./footer/AuthContentFooter";

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
            <SignInForm />
          </div>
        </div>
      </div>
      <AuthContentFooter />
    </div>
  );
};

export default AuthContent;
