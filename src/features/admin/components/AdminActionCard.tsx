"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AlertDialog } from "radix-ui";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { getApiErrorMessage } from "@/utils/api-error";
import { cn } from "@/utils/utils";

type ActionMutation = Pick<
  UseMutationResult<unknown, unknown, void>,
  "mutate" | "isPending" | "isSuccess" | "isError" | "error"
>;

type ConfirmCopy = {
  title: string;
  text: string;
  actionLabel: string;
};

export type AdminActionCardProps = {
  mutation: ActionMutation;
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  pendingLabel: string;
  confirm: ConfirmCopy;
  errorFallback: string;
  getSuccessMessage: (finishedAt: string) => string;
};

const formatTime = (timestamp: number) =>
  new Intl.DateTimeFormat("uk-UA", { timeStyle: "short" }).format(timestamp);

export const AdminActionCard = ({
  mutation,
  icon: Icon,
  title,
  description,
  actionLabel,
  pendingLabel,
  confirm,
  errorFallback,
  getSuccessMessage,
}: AdminActionCardProps) => {
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const { mutate, isPending, isSuccess, isError, error } = mutation;

  const run = () => mutate(undefined, { onSuccess: () => setFinishedAt(Date.now()) });

  return (
    <article className="rounded-2xl border border-stroke-secondary bg-surface-primary p-5 sm:p-7">
      <div className="grid size-11 place-items-center rounded-xl bg-surface-secondary text-text-brand">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
        {description}
      </p>

      <ConfirmDialog copy={confirm} onConfirm={run}>
        <Button className="mt-6" disabled={isPending}>
          {isPending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
          {isPending ? pendingLabel : actionLabel}
        </Button>
      </ConfirmDialog>

      <div aria-live="polite" className="mt-4 empty:hidden">
        {isSuccess && finishedAt !== null && (
          <StatusMessage icon={CircleCheck} className="text-text-success">
            {getSuccessMessage(formatTime(finishedAt))}
          </StatusMessage>
        )}
        {isError && (
          <StatusMessage icon={CircleAlert} className="text-text-error" role="alert">
            {getApiErrorMessage(error, errorFallback)}
          </StatusMessage>
        )}
      </div>
    </article>
  );
};

type ConfirmDialogProps = {
  copy: ConfirmCopy;
  onConfirm: () => void;
  children: ReactNode;
};

const ConfirmDialog = ({ copy, onConfirm, children }: ConfirmDialogProps) => {
  const t = useTranslations("Admin.actionCard");

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
              <Button onClick={onConfirm}>{copy.actionLabel}</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

type StatusMessageProps = {
  icon: LucideIcon;
  className: string;
  role?: "alert";
  children: ReactNode;
};

const StatusMessage = ({ icon: Icon, className, role, children }: StatusMessageProps) => (
  <p role={role} className={cn("flex items-center gap-2 text-sm font-medium", className)}>
    <Icon aria-hidden="true" className="size-4 shrink-0" />
    {children}
  </p>
);
