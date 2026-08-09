"use client";

import { useState } from "react";
import { Tabs } from "radix-ui";

import FooterTopLogo from "@/app/[locale]/(public)/_components/footer/top/logo/FooterTopLogo";
import { Button } from "@/components/ui/button/button";
import { GoogleIcon } from "@/components/ui/icons";
import { SignIn } from "@/features/auth/components/sign-in";
import { SignUp } from "@/features/auth/components/sign-up";

import AuthContentFooter from "./footer/AuthContentFooter";
import { cn } from "@/utils/utils";

type AuthTab = "sign-in" | "sign-up";

const authContent = {
  "sign-in": {
    title: "Раді бачити вас знову",
    description: "Увійдіть, щоб продовжити роботу з Vendo",
    googleLabel: "Увійти за допомогою Google",
  },
  "sign-up": {
    title: "Створіть свій акаунт",
    description: "Приєднуйтесь до Vendo та насолоджуйтесь зручними покупками.",
    googleLabel: "Продовжити з Google",
  },
} as const;

const AuthContent = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("sign-in");
  const content = authContent[activeTab];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-120 space-y-6">
          <FooterTopLogo />
          <Tabs.Root
            className="flex w-full flex-col space-y-6"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as AuthTab)}
          >
            <div className="space-y-1">
              <h1 className="text-neutral-950 text-[24px] leading-7.5 font-semibold">
                {content.title}
              </h1>
              <p className="text-neutral-400 text-[16px] leading-6 font-normal">
                {content.description}
              </p>
            </div>

            <Tabs.List
              className="flex items-center justify-center gap-2 bg-brand-50"
              aria-label="Авторизація"
            >
              <Tabs.Trigger value="sign-in" asChild>
                <Button
                  className={cn(
                    "flex-1 border-0",
                    activeTab === "sign-up" && "bg-transparent",
                  )}
                  variant={activeTab === "sign-in" ? "brand" : "secondary"}
                >
                  Вхід
                </Button>
              </Tabs.Trigger>
              <Tabs.Trigger value="sign-up" asChild>
                <Button
                  className={cn(
                    "flex-1 border-0",
                    activeTab === "sign-in" && "bg-transparent",
                  )}
                  variant={activeTab === "sign-up" ? "brand" : "secondary"}
                >
                  Реєстрація
                </Button>
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="sign-in" tabIndex={-1}>
              <SignIn />
            </Tabs.Content>
            <Tabs.Content value="sign-up" tabIndex={-1}>
              <SignUp onSuccess={() => setActiveTab("sign-in")} />
            </Tabs.Content>

            <div className="flex items-center justify-between gap-4">
              <div className="h-px w-full bg-neutral-100" />
              <span className="text-neutral-600 font-medium">або</span>
              <div className="h-px w-full bg-neutral-100" />
            </div>
            <Button
              variant="secondary"
              className="w-full text-[14px] leading-5"
            >
              <GoogleIcon className="size-4" />
              <span>{content.googleLabel}</span>
            </Button>
          </Tabs.Root>
        </div>
      </div>
      <AuthContentFooter />
    </div>
  );
};

export default AuthContent;
