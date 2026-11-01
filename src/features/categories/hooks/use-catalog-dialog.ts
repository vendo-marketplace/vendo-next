import { useEffect, useRef, type RefObject } from "react";

interface UseCatalogDialogParams {
  isOpen: boolean;
  onClose: () => void;
  dialogRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
}

export const useCatalogDialog = ({
  isOpen,
  onClose,
  dialogRef,
  triggerRef,
}: UseCatalogDialogParams) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const close = () => onCloseRef.current();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    // The trigger toggles the dialog itself, so clicks on it are ignored here.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isInside =
        dialogRef.current?.contains(target) ||
        trigger?.contains(target);

      if (!isInside) close();
    };

    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      trigger?.querySelector("button")?.focus();
    };
  }, [isOpen, dialogRef, triggerRef]);
};
