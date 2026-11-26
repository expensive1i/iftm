"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import { countries } from "@/lib/analytics/countries";
import { cn } from "@/lib/utils";

/*
 * Every country as a round flag in one full-width row that scrolls
 * sideways (drag, swipe, the arrows or the keyboard). Click a flag to see
 * that country's figures. Countries with campaigns come first and carry a
 * red badge with their count; the chosen one gets a red ring and lifts.
 * Flags: the MIT-licensed flag-icons set, served from /public/flags.
 */
export function FlagRail({
  selected,
  counts,
  onSelect,
}: {
  selected: number;
  counts: Record<number, number>;
  onSelect: (id: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () =>
      [...countries].sort(
        (a, b) =>
          (counts[b.id] ?? 0) - (counts[a.id] ?? 0) ||
          a.name.localeCompare(b.name),
      ),
    [counts],
  );

  // Keep the chosen flag in view
  useEffect(() => {
    const el = track.current?.querySelector<HTMLElement>(
      `[data-id="${selected}"]`,
    );
    const t = track.current;
    if (!el || !t) return;
    const left = el.offsetLeft - t.clientWidth / 2 + el.offsetWidth / 2;
    t.scrollTo({ left, behavior: "smooth" });
  }, [selected]);

  const page = (dir: 1 | -1) => {
    const t = track.current;
    if (t) t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">54 countries.</span>{" "}
          Tap a flag to see its figures.
        </p>
        <div className="flex shrink-0 gap-2">
          {(
            [
              [-1, "Previous countries", ChevronLeft],
              [1, "More countries", ChevronRight],
            ] as const
          ).map(([dir, label, Icon]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => page(dir)}
              className="grid size-10 place-items-center rounded-full border border-foreground/15 bg-white text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white"
            >
              <Icon aria-hidden className="size-[1.125rem]" />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        role="listbox"
        aria-label="Countries"
        className="-mx-1 mt-4 flex snap-x [scrollbar-width:none] gap-2 overflow-x-auto scroll-smooth [mask-image:linear-gradient(90deg,transparent,#000_2.5rem,#000_calc(100%-2.5rem),transparent)] px-1 pt-2 pb-3 sm:gap-3 [&::-webkit-scrollbar]:hidden"
      >
        {list.map((c) => {
          const n = counts[c.id] ?? 0;
          const isSel = c.id === selected;
          return (
            <button
              key={c.id}
              type="button"
              role="option"
              aria-selected={isSel}
              data-id={c.id}
              onClick={() => onSelect(c.id)}
              title={`${c.name}${n ? `: ${n} campaign${n === 1 ? "" : "s"}` : ""}`}
              className="group flex w-[4.5rem] shrink-0 snap-start flex-col items-center first:ml-8 last:mr-8 sm:w-20"
            >
              <span
                className={cn(
                  "relative block size-14 rounded-full transition-[transform,box-shadow] duration-300 sm:size-16",
                  isSel
                    ? "-translate-y-1 shadow-[0_0_0_3px_#fff,0_0_0_6px_var(--primary),0_14px_24px_-10px_rgb(211_0_15/0.6)]"
                    : "shadow-[0_0_0_1px_rgb(0_0_0/0.08)] group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_3px_#fff,0_0_0_5px_rgb(0_0_0/0.15)]",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flags/${c.iso2.toLowerCase()}.svg`}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  className="size-full rounded-full object-cover"
                />
                {n > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-bold text-white ring-2 ring-white">
                    {n}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "mt-2 line-clamp-2 text-center text-[0.6875rem]/[0.95rem] sm:text-xs/4",
                  isSel
                    ? "font-semibold text-foreground"
                    : "text-muted group-hover:text-foreground",
                )}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
