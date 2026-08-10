"use client";

import { Tabs } from "radix-ui";

import { Button, getButtonClassName } from "@/components/ui/button/button";
import { GoogleIcon } from "@/components/ui/icons";
import { AccountCreated } from "@/features/auth/components/account-created";
import { SignIn } from "@/features/auth/components/sign-in";
import { SignUp } from "@/features/auth/components/sign-up";
import { VerifyCode } from "@/features/auth/components/verify-code";
import { Link } from "@/i18n/navigation";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/utils/utils";
import AuthContentFooter from "./footer/AuthContentFooter";
import { GoogleLoginButton } from "@/components/ui/google-login-button";

export type AuthTab = "sign-in" | "sign-up";
export type SignUpStep = "form" | "verify-code" | "success";

type AuthContentProps = {
  activeTab: AuthTab;
  signUpStep?: SignUpStep;
  signUpEmail?: string;
  onSignUpSuccess?: (email: string) => void;
  onVerifySuccess?: () => void;
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

const AuthContent = ({
  activeTab,
  signUpStep = "form",
  signUpEmail = "",
  onSignUpSuccess,
  onVerifySuccess,
}: AuthContentProps) => {
  const content = authContent[activeTab];

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex px-15 py-6">
        <Logo size="sm" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-120 space-y-6">
          {activeTab === "sign-up" && signUpStep === "verify-code" ? (
            <VerifyCode
              email={signUpEmail}
              onSuccess={() => onVerifySuccess?.()}
            />
          ) : activeTab === "sign-up" && signUpStep === "success" ? (
            <AccountCreated />
          ) : (
            <Tabs.Root
              className="flex w-full flex-col space-y-6"
              value={activeTab}
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
                  <Link
                    href="/sign-in"
                    className={cn(
                      getButtonClassName({
                        className: "flex-1 border-0",
                        variant:
                          activeTab === "sign-in" ? "brand" : "secondary",
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
                        variant:
                          activeTab === "sign-up" ? "brand" : "secondary",
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
                <span className="text-neutral-600 font-medium">або</span>
                <div className="h-px w-full bg-neutral-100" />
              </div>
              <GoogleLoginButton />
              <Button
                variant="secondary"
                className="w-full text-[14px] leading-5"
              >
                <GoogleIcon className="size-4" />
                <span>{content.googleLabel}</span>
              </Button>
            </Tabs.Root>
          )}
        </div>
      </div>
      <AuthContentFooter />
    </div>
  );
};

export default AuthContent;
