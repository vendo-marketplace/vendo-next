"use client";

import { Tabs } from "radix-ui";

import { Button, getButtonClassName } from "@/components/ui/button/button";
import { GoogleLoginButton } from "@/components/ui/google-login-button";
import { GoogleIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/utils";

import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

export type AuthTab = "sign-in" | "sign-up";

type AuthFormProps = {
  activeTab: AuthTab;
  onSignUpSuccess?: (email: string) => void;
};

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

export function AuthForm({ activeTab, onSignUpSuccess }: AuthFormProps) {
  const content = authContent[activeTab];

  return (
    <Tabs.Root className="flex w-full flex-col space-y-6" value={activeTab}>
      <div className="space-y-1">
        <h1 className="text-[24px] leading-7.5 font-semibold text-neutral-950">
          {content.title}
        </h1>
        <p className="text-[16px] leading-6 font-normal text-neutral-400">
          {content.description}
        </p>
      </div>

      <Tabs.List
        className="flex items-center justify-center gap-2 bg-brand-50"
        aria-label="Авторизація"
      >
        <Tabs.Trigger value="sign-in" asChild>
          <Link
            href="/sign-in"
            className={cn(
              getButtonClassName({
                className: "flex-1 border-0",
                variant: activeTab === "sign-in" ? "brand" : "secondary",
              }),
              activeTab === "sign-up" && "bg-transparent",
            )}
          >
            Вхід
          </Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="sign-up" asChild>
          <Link
            href="/sign-up"
            className={cn(
              getButtonClassName({
                className: "flex-1 border-0",
                variant: activeTab === "sign-up" ? "brand" : "secondary",
              }),
              activeTab === "sign-in" && "bg-transparent",
            )}
          >
            Реєстрація
          </Link>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="sign-in" tabIndex={-1}>
        <SignIn />
      </Tabs.Content>
      <Tabs.Content value="sign-up" tabIndex={-1}>
        <SignUp onSuccess={onSignUpSuccess} />
      </Tabs.Content>

      <div className="flex items-center justify-between gap-4">
        <div className="h-px w-full bg-neutral-100" />
        <span className="font-medium text-neutral-600">або</span>
        <div className="h-px w-full bg-neutral-100" />
      </div>
      <GoogleLoginButton />
      <Button variant="secondary" className="w-full text-[14px] leading-5">
        <GoogleIcon className="size-4" />
        <span>{content.googleLabel}</span>
      </Button>
    </Tabs.Root>
  );
}
