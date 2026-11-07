"use client";

import { Image as ImageIcon, Plus, Send, Smile } from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";

import { useAutoResizeTextarea } from "@/features/chats/hooks/use-auto-resize-textarea";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSending: boolean;
  disabled: boolean;
};

export default function MessageComposer({
  value,
  onChange,
  onSubmit,
  isSending,
  disabled,
}: Props) {
  const textareaRef = useAutoResizeTextarea(value);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-t border-stroke-primary-subtle bg-white p-3 sm:px-5 sm:py-4"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-stroke-primary-subtle bg-surface-secondary p-2 focus-within:border-stroke-brand-light focus-within:bg-white">
        <button
          type="button"
          aria-label="Додати вкладення"
          className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary"
        >
          <Plus aria-hidden="true" className="size-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={4000}
          placeholder="Напишіть повідомлення…"
          className="max-h-28 min-h-9 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent py-2 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
        />
        <button
          type="button"
          aria-label="Емодзі"
          className="mb-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary sm:flex"
        >
          <Smile aria-hidden="true" className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Додати фото"
          className="mb-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary hover:bg-surface-tertiary sm:flex"
        >
          <ImageIcon aria-hidden="true" className="size-5" />
        </button>
        <button
          type="submit"
          disabled={!value.trim() || isSending || disabled}
          aria-label="Надіслати повідомлення"
          className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-brand text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send aria-hidden="true" className="size-4" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-text-tertiary">
        Не надсилайте коди підтвердження або платіжні дані в чаті.
      </p>
    </form>
  );
}
