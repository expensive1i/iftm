"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

const STEP_MS = 3800;

/**
 * A one-row slider that moves on its own: every few seconds it steps to the
 * next card, looping back to the start at the end. It pauses while hovered
 * or focused. The title sits on the left with back and forward arrows on
 * the right. With reduced motion it never moves on its own.
 */
export function CampaignSlider({
  children,
  header,
  label,
}: {
  children: ReactNode;
  header: ReactNode;
  label: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState(false);

  // Move by one card (plus the gap), wrapping around at either end.
  const go = useCallback((dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const step = card.clientWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
    const max = el.scrollWidth - el.clientWidth;
    if (dir === 1 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior: "smooth" });
    else el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Reduced motion: never move on its own (the controls still work).
    if (hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), STEP_MS);
    return () => clearInterval(id);
  }, [hovered, go]);

  // Simple round outline buttons; they fill dark on hover.
  const ctrl =
    "grid size-11 place-items-center rounded-full border-[1.5px] border-foreground/15 bg-white text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-white focus-visible:border-primary focus-visible:outline-none";

  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {/* Header row: the title on the left, the controls on the right */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>{header}</div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="Previous campaign" onClick={() => go(-1)} className={ctrl}>
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" aria-label="Next campaign" onClick={() => go(1)} className={ctrl}>
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        aria-label={label}
        className="-mx-4 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pt-1 pb-4 lg:-mr-2 lg:pr-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  );
}
