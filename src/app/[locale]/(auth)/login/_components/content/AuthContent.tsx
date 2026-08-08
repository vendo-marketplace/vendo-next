"use client";

import FooterTopLogo from "@/app/[locale]/(public)/_components/footer/top/logo/FooterTopLogo";
import { Button } from "@/components/ui/button";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import AuthContentFooter from "./footer/AuthContentFooter";

const AuthContent = () => {
  const [asd, setAsd] = useState("");
  const qwe = () => setAsd("");
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
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" required>
                  Електронна пошта
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={asd}
                  onChange={(e) => setAsd(e.target.value)}
                  onClear={qwe}
                  placeholder="Введіть електронну пошту"
                  start={<MailIcon className="size-full " />}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" required>
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={asd}
                  onChange={(e) => setAsd(e.target.value)}
                  onClear={qwe}
                  placeholder="Створіть пароль"
                  start={<LockIcon className="size-full " />}
                />
                <Link href={"/"}>Забули пароль?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthContentFooter />
    </div>
  );
};

export default AuthContent;
