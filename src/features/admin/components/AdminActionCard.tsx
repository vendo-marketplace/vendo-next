"use client";

import type { UseMutationResult } from "@tanstack/react-query";
import {
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { getApiErrorMessage } from "@/utils/api-error";
import { cn } from "@/utils/utils";

import { type ConfirmCopy, ConfirmDialog } from "./shared/ConfirmDialog";

type ActionMutation = Pick<
  UseMutationResult<unknown, unknown, void>,
  "mutate" | "isPending" | "isSuccess" | "isError" | "error"
>;

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
