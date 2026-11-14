"use client";

import { useTranslations } from "next-intl";
import { AlertDialog } from "radix-ui";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button/button";

export type ConfirmCopy = {
  title: string;
  text: string;
  actionLabel: string;
};

type Props = {
  copy: ConfirmCopy;
  onConfirm: () => void;
  destructive?: boolean;
  // The trigger, rendered as-is.
  children: ReactNode;
};

export const ConfirmDialog = ({ copy, onConfirm, destructive = false, children }: Props) => {
  const t = useTranslations("Admin");

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stroke-secondary bg-surface-primary p-6 shadow-2xl outline-none">
          <AlertDialog.Title className="text-lg font-semibold text-text-primary">
            {copy.title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-6 text-text-secondary">
            {copy.text}
          </AlertDialog.Description>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant={destructive ? "error" : "brand"} onClick={onConfirm}>
                {copy.actionLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
