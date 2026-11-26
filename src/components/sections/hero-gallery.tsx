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

// Community fieldwork from Connected Development's Flickr (© CODE, many by
// KC Nwakalor): one or two photos from each of many events (Zamfara,
// Bagega, Niger, Shikira, Delta, Bauchi, Kano, Kaduna, Sokoto, Abuja) so
// the collage never repeats a scene. Ordered so neighbours come from
// different events. Every photo appears in at most one diamond at a time
// (see HeroGallery). `position` keeps the people inside a small diamond.
const photos = [
  { src: "/images/community/zamfara-roofless-classroom.jpg", position: "50% 50%" },
  { src: "/images/community/bagega-well.jpg", position: "70% 45%" },
  { src: "/images/community/bauchi-community-meeting.jpg", position: "50% 55%" },
  { src: "/images/community/shikira-water-point.jpg", position: "30% 55%" },
  { src: "/images/community/delta-village-walk.jpg", position: "45% 55%" },
  { src: "/images/community/niger-site-workers.jpg", position: "65% 45%" },
  { src: "/images/community/school-classroom.jpg", position: "42% 40%" },
  { src: "/images/community/kano-tracker.jpg", position: "45% 40%" },
  { src: "/images/community/bauchi-schoolgirls.jpg", position: "50% 45%" },
  { src: "/images/community/village-women.jpg", position: "40% 40%" },
  { src: "/images/community/sokoto-leaders-meeting.jpg", position: "50% 55%" },
  { src: "/images/community/bagega-girl.jpg", position: "50% 40%" },
  { src: "/images/community/phc-schedule-check.jpg", position: "35% 45%" },
  { src: "/images/community/zamfara-schoolchildren.jpg", position: "50% 60%" },
  { src: "/images/community/monitoring-team-training.jpg", position: "45% 45%" },
  { src: "/images/community/delta-elder.jpg", position: "50% 45%" },
  { src: "/images/community/niger-site-visit.jpg", position: "55% 55%" },
  { src: "/images/community/bauchi-officer-interview.jpg", position: "50% 40%" },
  { src: "/images/community/shikira-portrait.jpg", position: "50% 40%" },
  { src: "/images/community/site-inspection-elders.jpg", position: "40% 45%" },
  { src: "/images/community/tracker-field.jpg", position: "50% 30%" },
  { src: "/images/community/kaduna-advocates-meeting.jpg", position: "50% 45%" },
  { src: "/images/community/abuja-school-visit.jpg", position: "55% 55%" },
  { src: "/images/community/bauchi-women-talk.jpg", position: "40% 35%" },
  { src: "/images/community/kano-young-trackers.jpg", position: "50% 35%" },
  { src: "/images/community/sokoto-community-meeting.jpg", position: "50% 55%" },
  { src: "/images/community/monitoring-training-notes.jpg", position: "45% 40%" },
  { src: "/images/community/abuja-health-dialogue.jpg", position: "40% 50%" },
];

const MIN_N = 13; // smallest lattice; it grows to cover wider screens
const WIPES = ["up", "right", "down", "left"] as const;

/** The diagonal: fraction of the width at the top and at the bottom. */
const LINE = { top: 0.53, bottom: 0.58 };
/** Where the logo diamond goes (fraction of width / height). */
const LOGO_AT = { x: 0.74, y: 0.52 };

/** A few diamonds in the body of the collage are plain red accents. */
const isRed = (r: number, c: number) => (r * 5 + c * 2) % 19 === 0;

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

  // Diamonds that show a photo (not red, not the logo), in grid order.
  const photoCells = cells
    .filter((c) => c.kind === "photo" && c.i !== logo && !isRed(c.r, c.c))
    .map((c) => c.i);
  const layoutKey = photoCells.join(",");

  // Which photo each diamond shows. Every photo is used at most once; if a
  // very wide screen has more diamonds than photos, the rest stay plain.
  const [assign, setAssign] = useState<Record<number, number>>({});
  const [assignKey, setAssignKey] = useState("");
  if (assignKey !== layoutKey) {
    const next: Record<number, number> = {};
    photoCells.forEach((cell, k) => {
      if (k < photos.length) next[cell] = k;
    });
    setAssignKey(layoutKey);
    setAssign(next);
  }

  // Every so often one diamond swaps to a photo that is not on screen, so
  // the collage keeps changing without ever showing a photo twice.
  useEffect(() => {
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const every = box.cut ? 1400 : 1800;
    let last = -1;
    const id = setInterval(() => {
      setAssign((cur) => {
        const shown = Object.keys(cur).map(Number);
        const used = new Set(Object.values(cur));
        const free = photos.map((_, k) => k).filter((k) => !used.has(k));
        if (shown.length === 0 || free.length === 0) return cur;
        let cell = shown[Math.floor(Math.random() * shown.length)];
        if (cell === last && shown.length > 1) cell = shown[(shown.indexOf(cell) + 1) % shown.length];
        last = cell;
        return { ...cur, [cell]: free[Math.floor(Math.random() * free.length)] };
      });
    }, every);
    return () => clearInterval(id);
  }, [box, layoutKey]);

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
          const red = kind === "red" || (kind === "photo" && i !== logo && isRed(r, c));
          const photo = assign[i];
          return (
            <div
              key={i}
              data-diamond
              className={cn(
                "group/tile relative overflow-hidden",
                tileClass,
                kind === "hidden" && "invisible",
                red ? "bg-primary-hover" : i === logo ? "bg-white" : "bg-neutral-100",
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
                // The official logo mark, as large as fits upright in the diamond.
                <div className="absolute inset-[15%] -rotate-45">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/ftm-mark.png" alt="" className="size-full object-contain" />
                </div>
              ) : photo === undefined ? null : (
                <div className="absolute inset-[-21%] -rotate-45">
                  <Tile photo={photo} index={i} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** One photo diamond; when its photo changes, the new one wipes in. */
function Tile({ photo, index }: { photo: number; index: number }) {
  const [[current, previous], setPair] = useState<[number, number | null]>([photo, null]);
  // The parent picked a new photo: keep the old one underneath for the wipe.
  if (photo !== current) setPair([photo, current]);

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
