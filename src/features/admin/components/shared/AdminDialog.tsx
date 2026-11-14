"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

// Modal shell for admin forms: header with a close button, the body scrolls.
export const AdminDialog = ({ open, onClose, title, children }: Props) => {
  const t = useTranslations("Admin");

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-stroke-secondary bg-surface-primary shadow-2xl outline-none"
        >
          <div className="flex items-start justify-between gap-4 border-b border-stroke-secondary px-6 py-4">
            <Dialog.Title className="text-lg font-semibold break-words text-text-primary">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("close")}
                className="grid size-8 shrink-0 place-items-center rounded-full text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// Footer cancel button for forms inside AdminDialog.
export const AdminDialogClose = Dialog.Close;
