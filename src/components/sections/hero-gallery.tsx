"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/*
 * A photo collage cut into diamonds, after the AANI sign-in page: a
 * square grid turned 45°, each diamond holding its own photo (turned
 * back upright). Every photo diamond swaps to another photo on its own
 * timer, so the collage keeps changing a little at a time.
 *
 * With `cut` on, only whole diamonds that sit right of a diagonal are
 * shown, so the edge steps along complete diamonds instead of slicing
 * through them. A few red diamonds break out just past the edge.
 */

// `position` keeps each subject's face inside a small diamond.
const photos = [
  { src: "/images/about-2.jpg", position: "60% 25%" },
  { src: "/images/banner-about.jpg", position: "75% 30%" },
  { src: "/images/about-1.jpg", position: "72% 30%" },
  { src: "/images/banner-home.jpeg", position: "50% 30%" },
  { src: "/images/about-3.jpg", position: "35% 40%" },
  { src: "/images/about-4.jpg", position: "58% 38%" },
  { src: "/images/campaign-kakulu.jpg", position: "45% 55%" },
];

const MIN_N = 13; // smallest lattice; it grows to cover wider screens
const WIPES = ["up", "right", "down", "left"] as const;

/** The diagonal: fraction of the width at the top and at the bottom. */
const LINE = { top: 0.53, bottom: 0.58 };
/** Where the logo diamond goes (fraction of width / height). */
const LOGO_AT = { x: 0.74, y: 0.52 };

type Box = { w: number; h: number; pitch: number; tile: number; cut: boolean };

export function HeroGallery({
  tileClass,
  gapClass,
  className,
}: {
  tileClass: string;
  gapClass: string;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  // N × N diamonds: enough that the turned square covers the whole frame,
  // however wide the screen (or however far the page is zoomed out).
  const N = box
    ? Math.max(MIN_N, Math.ceil((box.w + box.h) / Math.SQRT2 / box.pitch) + 3)
    : MIN_N;

  // Measure the frame and diamond pitch so whole diamonds can be placed.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => {
      const tile = el.querySelector<HTMLElement>("[data-diamond]");
      const grid = tile?.parentElement;
      if (!tile || !grid) return;
      setBox({
        w: el.clientWidth,
        h: el.clientHeight,
        tile: tile.offsetWidth,
        pitch: tile.offsetWidth + parseFloat(getComputedStyle(grid).columnGap),
        cut: window.matchMedia("(min-width: 1024px)").matches,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const mid = (N - 1) / 2;
  const cells = Array.from({ length: N * N }, (_, i) => {
    const r = Math.floor(i / N);
    const c = i % N;
    if (!box) return { i, r, c, x: 0, y: 0, kind: "hidden" as const };
    // Centre of this diamond in frame pixels, after the 45° turn.
    const u = (c - mid) * box.pitch;
    const v = (r - mid) * box.pitch;
    const x = box.w / 2 + (u - v) / Math.SQRT2;
    const y = box.h / 2 + (u + v) / Math.SQRT2;
    const half = box.tile / Math.SQRT2; // centre to corner of the diamond
    // Skip diamonds entirely outside the frame.
    if (x + half < 0 || x - half > box.w || y + half < 0 || y - half > box.h) {
      return { i, r, c, x, y, kind: "hidden" as const };
    }
    // Phones: a band of whole diamonds only (no slivers along the top
    // and bottom), clipped just at the left and right screen edges.
    if (!box.cut) {
      const whole = y - half >= -2 && y + half <= box.h + 2;
      return { i, r, c, x, y, kind: whole ? ("photo" as const) : ("hidden" as const) };
    }
    const lineX = box.w * (LINE.top + (LINE.bottom - LINE.top) * (y / box.h));
    const left = x - half; // the diamond's left corner
    if (left >= lineX) return { i, r, c, x, y, kind: "photo" as const };
    // Below the text, a few diamonds break out past the edge as red accents.
    if (y > box.h * 0.78 && left >= lineX - box.pitch * 1.2 && (r * 7 + c * 3) % 6 === 0) {
      return { i, r, c, x, y, kind: "red" as const };
    }
    return { i, r, c, x, y, kind: "hidden" as const };
  });

  // Logo on the shown diamond nearest the chosen spot.
  let logo = -1;
  if (box) {
    let best = Infinity;
    for (const cell of cells) {
      if (cell.kind !== "photo") continue;
      // Large screens: right of centre; phones: dead centre of the band.
      const at = box.cut ? LOGO_AT : { x: 0.5, y: 0.5 };
      const d = Math.hypot(cell.x - box.w * at.x, cell.y - box.h * at.y);
      if (d < best) {
        best = d;
        logo = cell.i;
      }
    }
  }
  const logoR = Math.floor(logo / N);
  const logoC = logo % N;

  return (
    <div ref={frame} aria-hidden className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "absolute top-1/2 left-1/2 grid w-max -translate-x-1/2 -translate-y-1/2 rotate-45",
          gapClass,
        )}
        style={{ gridTemplateColumns: `repeat(${N}, auto)` }}
      >
        {cells.map(({ i, r, c, kind }) => {
          // Bloom out from the logo diamond.
          const ring = Math.max(Math.abs(r - logoR), Math.abs(c - logoC));
          // Every few diamonds in the body of the collage is red too.
          const red = kind === "red" || (kind === "photo" && i !== logo && (r * 5 + c * 2) % 19 === 0);
          return (
            <div
              key={i}
              data-diamond
              className={cn(
                "group/tile relative overflow-hidden",
                tileClass,
                kind === "hidden" && "invisible",
                red ? "bg-primary-hover" : i === logo ? "bg-white" : "bg-neutral-200",
              )}
              style={
                box && kind !== "hidden"
                  ? {
                      animation: `ftm-diamond-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${100 + ring * 120 + (i % 2) * 60}ms both`,
                    }
                  : undefined
              }
            >
              {kind === "hidden" || red ? null : i === logo ? (
                // The vector gear mark, as large as fits upright in the diamond.
                <div className="absolute inset-[15%] -rotate-45">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/motif-gear-red.svg" alt="" className="size-full" />
                </div>
              ) : (
                <div className="absolute inset-[-21%] -rotate-45">
                  {/* Neighbours never share a photo: step 3 across, 2 down. */}
                  <Tile first={(c * 3 + r * 2) % photos.length} index={i} ring={ring} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tile({ first, index, ring }: { first: number; index: number; ring: number }) {
  const [[current, previous], setPair] = useState<[number, number | null]>([first, null]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones show only a handful of diamonds, so they swap more often there
    // (and start sooner) to keep the band visibly alive.
    const small = !window.matchMedia("(min-width: 1024px)").matches;
    const every = small ? 3800 + ((index * 1370) % 3200) : 8000 + ((index * 1370) % 6000);
    const start = small ? 1400 + ((index * 530) % 2600) : 2000 + ring * 400 + ((index * 530) % 3000);
    let timer: ReturnType<typeof setInterval>;
    // Offset per tile so swaps ripple across the lattice, never all at once.
    const kickoff = setTimeout(() => {
      timer = setInterval(() => setPair(([c]) => [(c + 4) % photos.length, c]), every);
    }, start);
    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, [index, ring]);

  const ease = "cubic-bezier(0.76, 0, 0.24, 1)";
  return (
    <div className="relative size-full">
      {[previous, current].map((p, layer) => {
        if (p === null) return null;
        const swapping = previous !== null;
        return (
          <div
            key={`${layer}-${p}`}
            className="absolute inset-0 overflow-hidden"
            style={
              swapping && layer === 1
                ? { animation: `ftm-wipe-${WIPES[index % 4]} 1.3s ${ease} both` }
                : undefined
            }
          >
            <div
              className="absolute inset-0"
              style={
                swapping
                  ? {
                      animation:
                        layer === 1
                          ? `ftm-photo-settle 1.8s cubic-bezier(0.22, 1, 0.36, 1) both`
                          : `ftm-photo-leave 1.3s ${ease} both`,
                    }
                  : undefined
              }
            >
              <Image
                src={photos[p].src}
                alt=""
                fill
                sizes="260px"
                loading="eager"
                className="object-cover transition-transform duration-700 ease-out group-hover/tile:scale-110"
                style={{ objectPosition: photos[p].position }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
