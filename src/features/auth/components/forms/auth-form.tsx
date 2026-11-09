"use client";

import { Tabs } from "radix-ui";

import { GoogleLoginButton } from "@/components/ui/google-login-button";
import { Link } from "@/i18n/navigation";

import { AuthContentHeader } from "../auth-content-header";
import { SignIn } from "../sign-in";
import { SignUp } from "../sign-up";

export type AuthTab = "sign-in" | "sign-up";

type AuthFormProps = {
  activeTab: AuthTab;
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

const tabClassName =
  "-mb-px flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent pb-2.5 text-md font-semibold rounded-t-sm text-text-secondary outline-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 hover:text-text-primary focus-visible:text-text-brand data-[state=active]:border-stroke-brand data-[state=active]:text-text-brand";

export function AuthForm({ activeTab }: AuthFormProps) {
  const content = authContent[activeTab];

  return (
    <Tabs.Root className="flex w-full flex-col space-y-6" value={activeTab}>
      <AuthContentHeader
        title={content.title}
        description={content.description}
      />

      <Tabs.List
        className="flex items-center border-b border-stroke-secondary"
        aria-label="Авторизація"
      >
        <Tabs.Trigger value="sign-in" asChild>
          <Link href="/sign-in" className={tabClassName}>
            Вхід
          </Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="sign-up" asChild>
          <Link href="/sign-up" className={tabClassName}>
            Реєстрація
          </Link>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="sign-in" tabIndex={-1}>
        <SignIn />
      </Tabs.Content>
      <Tabs.Content value="sign-up" tabIndex={-1}>
        <SignUp />
      </Tabs.Content>

      <div className="flex items-center justify-between gap-4">
        <div className="h-px w-full bg-stroke-secondary" />
        <span className="text-sm font-medium text-text-secondary">або</span>
        <div className="h-px w-full bg-stroke-secondary" />
      </div>
      <GoogleLoginButton label={content.googleLabel} />
    </Tabs.Root>
  );
}
