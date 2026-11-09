"use client";

import { useLayoutEffect, useRef } from "react";

// Grows the textarea with its text; a CSS max-height caps it and turns on inner scrolling.
export const useAutoResizeTextarea = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return textareaRef;
};
