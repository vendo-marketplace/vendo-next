"use client";

import { useRef, useState } from "react";
import { Popover } from "radix-ui";

import { InfoMarkIcon } from "@/assets/icons/InfoMarkIcon";

export type FilterHintContent = {
  title: string;
  items: { term: string; description: string }[];
};

const SIDE_GAP = 4;
// Keeps the popover clear of the sticky header (76px from tablets up, 56px on phones); with no room
// above, it flips below the icon.
const COLLISION_PADDING = { top: 92, right: 16, bottom: 16, left: 16 };

type Placement = { alignOffset: number; width?: number };

// As in Figma (Tooltip 5488:18873): the hint sits inside the filters panel, as wide as its
// content, above the icon with the arrow pointing down at it. The panel's left edge is
// measured on open, so the popover lines up with the section titles.
const measurePlacement = (trigger: HTMLElement): Placement => {
  const panel = trigger.closest("aside");
  if (!panel) return { alignOffset: 0 };
  const style = getComputedStyle(panel);
  const panelBox = panel.getBoundingClientRect();
  const contentLeft = panelBox.left + parseFloat(style.paddingLeft);
  const contentWidth = panel.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  return {
    alignOffset: contentLeft - trigger.getBoundingClientRect().left,
    width: contentWidth,
  };
};

// Opens on click/Enter, not hover, so it also works on touch screens and from the keyboard.
export function FilterHint({ label, hint }: { label: string; hint: FilterHintContent }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [placement, setPlacement] = useState<Placement>({ alignOffset: 0 });

  const updatePlacement = (open: boolean) => {
    if (open && triggerRef.current) setPlacement(measurePlacement(triggerRef.current));
  };

  return (
    <Popover.Root onOpenChange={updatePlacement}>
      <Popover.Trigger
        ref={triggerRef}
        aria-label={`${hint.title}: ${label}`}
        className="-m-2.5 flex size-11 items-center justify-center rounded-full lg:m-0 lg:size-6 text-text-secondary transition-colors hover:text-text-brand focus-visible:shadow-focus-brand focus-visible:outline-none data-[state=open]:text-text-brand"
      >
        <InfoMarkIcon size={16} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          alignOffset={placement.alignOffset}
          sideOffset={SIDE_GAP}
          collisionPadding={COLLISION_PADDING}
          style={{ width: placement.width }}
          className="z-[60] w-71 max-w-[calc(100vw-2rem)] rounded-xl bg-surface-brand-subtle px-3 py-2 text-sm text-text-primary outline-none drop-shadow-md"
        >
          <p className="mb-3.5 font-semibold">{hint.title}</p>
          <ul className="flex list-disc flex-col gap-5 pl-5 font-medium">
            {hint.items.map((item) => (
              <li key={item.term}>
                <span className="font-semibold">{item.term}</span>
                {" — "}
                <span className="text-text-secondary">{item.description}</span>
              </li>
            ))}
          </ul>
          <Popover.Arrow width={16} height={8} className="fill-surface-brand-subtle" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
