"use client";

import FooterTopLogo from "@/app/[locale]/(public)/_components/footer/top/logo/FooterTopLogo";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form/form-field";
import { LockIcon, MailIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input/input";
import Link from "next/link";
import { useState } from "react";
import AuthContentFooter from "./footer/AuthContentFooter";

const AuthContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
              <FormField label="Електронна пошта" required id="email">
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onClear={() => setEmail("")}
                    placeholder="Введіть електронну пошту"
                    start={<MailIcon className="size-full" />}
                  />
                )}
              </FormField>
              <div className="flex flex-col gap-3">
                <FormField label="Пароль" required id="password">
                  {(fieldProps) => (
                    <Input
                      {...fieldProps}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onClear={() => setPassword("")}
                      placeholder="Створіть пароль"
                      start={<LockIcon className="size-full" />}
                    />
                  )}
                </FormField>
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
