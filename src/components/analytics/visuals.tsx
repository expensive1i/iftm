"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import type { Campaign } from "@/lib/analytics/data";
import { day, money, pct } from "@/lib/analytics/format";

/*
 * The two signature visuals on the Analytics page, in the analytics palette
 * (blue: budget and campaigns, green: spent, amber: not yet accounted for):
 *
 * MoneyFlow: the budget being tracked as one bar on the left that flows
 * into two on the right: what has been spent (green) and what is not yet
 * accounted for (amber, with fine stripes). The band widths are to
 * scale. It draws itself in from left to right when it scrolls into view.
 *
 * CampaignTimeline: every campaign as a dot on a time line, placed by the
 * day it started and sized by how many people have viewed it; solid red if
 * it has a budget on record, an outline if not (blue). Dots that would overlap are
 * stacked. Hover or focus a dot for its details; click to open it.
 */

/** True once the element has scrolled into view. */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** Width of an element, kept up to date. */
function useWidth<T extends Element>(initial: number) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setW(Math.round(e.contentRect.width)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function MoneyFlow({
  budget,
  spent,
  currency,
}: {
  budget: number;
  spent: number;
  currency: string;
}) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const stripes = useId().replace(/:/g, "");
  const share = pct(spent, budget);
  const rest = Math.max(0, budget - spent);

  if (budget <= 0) {
    return (
      <p className="text-sm text-muted">
        No budget is on record for these campaigns yet.
      </p>
    );
  }

  // Geometry (viewBox units)
  const W = 640;
  const H = 240;
  const bar = 16;
  const gap = 10;
  const top = 8;
  const full = H - top * 2;
  const spentH = Math.max(spent > 0 ? 6 : 0, (full - gap) * (spent / budget));
  const restH = full - gap - spentH;
  const xL = 0;
  const xR = W - bar;
  const curve = (
    x0: number,
    y0a: number,
    y0b: number,
    x1: number,
    y1a: number,
    y1b: number,
  ) => {
    const m = (x0 + x1) / 2;
    return `M${x0},${y0a} C${m},${y0a} ${m},${y1a} ${x1},${y1a} L${x1},${y1b} C${m},${y1b} ${m},${y0b} ${x0},${y0b} Z`;
  };
  // Left bar is split in the same proportion so each band leaves from its share
  const lSpentEnd = top + full * (spent / budget);

  return (
    <div ref={ref}>
      <div className="grid grid-cols-[auto_1fr_auto] items-stretch gap-3 sm:gap-5">
        {/* Left label */}
        <div className="flex w-[6.5rem] flex-col justify-center sm:w-36">
          <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
            <span aria-hidden className="mr-1.5 inline-block size-2 rounded-full bg-[#2a78d6]" />
            Budget tracked
          </p>
          <p className="mt-1 text-[1.75rem]/none font-semibold text-foreground sm:text-[2.25rem]/none">
            {money(budget, currency)}
          </p>
        </div>

        {/* The flow */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-44 w-full sm:h-56"
          role="img"
          aria-label={`${money(budget, currency)} tracked: ${money(spent, currency)} spent (${share}%), ${money(rest, currency)} not yet accounted for`}
        >
          <defs>
            <pattern
              id={stripes}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="6" height="6" fill="#FDF1D6" />
              <rect width="2" height="6" fill="#F5CF7A" />
            </pattern>
            <clipPath id={`${stripes}-clip`}>
              <rect
                x="0"
                y="0"
                height={H}
                width={seen ? W : 0}
                className="transition-[width] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#${stripes}-clip)`}>
            {/* Bands */}
            <path
              d={curve(xL + bar, top, lSpentEnd, xR, top, top + spentH)}
              fill="#1baf7a"
              opacity={0.9}
            />
            <path
              d={curve(
                xL + bar,
                lSpentEnd,
                top + full,
                xR,
                top + spentH + gap,
                top + full,
              )}
              fill={`url(#${stripes})`}
            />
            {/* Bars */}
            <rect
              x={xL}
              y={top}
              width={bar}
              height={full}
              rx={4}
              fill="#2a78d6"
            />
            <rect
              x={xR}
              y={top}
              width={bar}
              height={spentH}
              rx={4}
              fill="#199e70"
            />
            <rect
              x={xR}
              y={top + spentH + gap}
              width={bar}
              height={restH}
              rx={4}
              fill="#eda100"
            />
          </g>
        </svg>

        {/* Right labels, lined up with their bars */}
        <div className="relative w-[6.5rem] sm:w-40">
          <div
            className="absolute inset-x-0 flex flex-col justify-center"
            style={{
              top: 0,
              height: `${((top + spentH) / H) * 100}%`,
              minHeight: "3.25rem",
            }}
          >
            <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
              <span aria-hidden className="size-2 rounded-full bg-[#1baf7a]" />{" "}
              Spent
            </p>
            <p className="mt-0.5 text-xl/tight font-semibold text-foreground sm:text-2xl/tight">
              {money(spent, currency)}
            </p>
            <p className="text-xs text-muted">{share}% of the budget</p>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col justify-center"
            style={{
              height: `${((restH + top) / H) * 100}%`,
              minHeight: "3.25rem",
            }}
          >
            <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
              <span aria-hidden className="size-2 rounded-full bg-[#eda100]" />{" "}
              Not yet accounted for
            </p>
            <p className="mt-0.5 text-xl/tight font-semibold text-foreground sm:text-2xl/tight">
              {money(rest, currency)}
            </p>
            <p className="text-xs text-muted">{100 - share}% of the budget</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignTimeline({
  campaigns,
  currency,
}: {
  campaigns: Campaign[];
  currency: string;
}) {
  const [box, width] = useWidth<HTMLDivElement>(0);
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  // "Today" for the time line, read once when the chart mounts
  const [now] = useState(() => Date.now());

  const H = 220;
  const axisY = H - 28;
  const pad = 28;

  const { dots, ticks, nowX } = useMemo(() => {
    const times = campaigns.map((c) => new Date(c.createdAt).getTime());
    const min = Math.min(...times, now);
    const span = Math.max(now - min, 1000 * 60 * 60 * 24 * 90);
    const t0 = min - span * 0.04;
    const t1 = now + span * 0.02;
    const x = (t: number) => pad + ((t - t0) / (t1 - t0)) * (width - pad * 2);
    const maxViews = Math.max(1, ...campaigns.map((c) => c.views));
    const placed: { x: number; y: number; r: number }[] = [];
    const out = [...campaigns]
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((c) => {
        const r = 7 + Math.sqrt(c.views / maxViews) * 13;
        const cx = x(new Date(c.createdAt).getTime());
        // Stack upwards until it no longer overlaps an earlier dot
        let cy = axisY - 14 - r;
        for (let i = 0; i < 40; i++) {
          const hit = placed.find(
            (p) => Math.hypot(p.x - cx, p.y - cy) < p.r + r + 3,
          );
          if (!hit) break;
          cy = hit.y - hit.r - r - 3;
        }
        placed.push({ x: cx, y: cy, r });
        return { c, cx, cy, r };
      });
    // Year (or month, for short spans) ticks
    const tk: { x: number; label: string }[] = [];
    const startD = new Date(t0);
    const months = (t1 - t0) / (1000 * 60 * 60 * 24 * 30);
    const step = months > 30 ? 12 : months > 10 ? 3 : 1;
    for (
      let d = new Date(startD.getFullYear(), startD.getMonth() + 1, 1);
      d.getTime() <= t1;
      d = new Date(d.getFullYear(), d.getMonth() + step, 1)
    ) {
      if (step === 12 && d.getMonth() !== 0) {
        d = new Date(d.getFullYear() + 1, 0, 1);
        if (d.getTime() > t1) break;
      }
      tk.push({
        x: x(d.getTime()),
        label: d.toLocaleDateString(
          "en-US",
          step === 12
            ? { year: "numeric" }
            : { month: "short", year: "2-digit" },
        ),
      });
    }
    return { dots: out, ticks: tk, nowX: x(now) };
  }, [campaigns, width, axisY, now]);

  const active = hover !== null ? dots.find((d) => d.c.id === hover) : null;

  return (
    <div ref={box}>
      <div ref={ref} className="relative">
        {/* Drawn in the browser once its width is known (no server/client mismatch) */}
        {width > 0 ? (
          <svg
            width="100%"
            height={H}
            viewBox={`0 0 ${width} ${H}`}
            role="group"
            aria-label="Campaigns by start date"
          >
            {/* Axis */}
            <line
              x1={pad / 2}
              x2={width - pad / 2}
              y1={axisY}
              y2={axisY}
              stroke="#1c1c1c"
              strokeOpacity={0.15}
            />
            {ticks.map((t) => (
              <g key={`${t.x}-${t.label}`}>
                <line
                  x1={t.x}
                  x2={t.x}
                  y1={axisY}
                  y2={axisY + 5}
                  stroke="#1c1c1c"
                  strokeOpacity={0.25}
                />
                <text
                  x={t.x}
                  y={axisY + 19}
                  textAnchor="middle"
                  className="fill-[#5e5e5e] text-[11px]"
                >
                  {t.label}
                </text>
              </g>
            ))}
            {/* "Today" marker */}
            <line
              x1={nowX}
              x2={nowX}
              y1={16}
              y2={axisY}
              stroke="#1c1c1c"
              strokeOpacity={0.3}
              strokeDasharray="0"
            />
            <text
              x={nowX}
              y={11}
              textAnchor="end"
              className="fill-[#1c1c1c] text-[10px] font-semibold tracking-wider uppercase"
            >
              Today
            </text>
            {/* Dots, each with a stem to the axis */}
            {dots.map(({ c, cx, cy, r }, i) => (
              <g
                key={c.id}
                tabIndex={0}
                role="link"
                aria-label={`${c.title}, started ${day(c.createdAt)}${c.state ? `, ${c.state}` : ""}, ${c.views} views${c.hasBudget ? `, budget ${money(c.budget, currency)}` : ""}`}
                onMouseEnter={() => setHover(c.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(c.id)}
                onBlur={() => setHover(null)}
                onClick={() => window.open(c.link, "_blank", "noopener")}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    window.open(c.link, "_blank", "noopener");
                }}
                className="cursor-pointer outline-none"
                style={{
                  opacity: seen ? 1 : 0,
                  transform: seen ? "none" : "translateY(14px)",
                  transition: `opacity .6s ${i * 0.09}s, transform .8s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s`,
                }}
              >
                <line
                  x1={cx}
                  x2={cx}
                  y1={cy + r}
                  y2={axisY}
                  stroke="#2a78d6"
                  strokeOpacity={0.3}
                />
                <circle cx={cx} cy={axisY} r={2.5} fill="#2a78d6" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={hover === c.id ? r + 2 : r}
                  fill={c.hasBudget ? "#2a78d6" : "#ffffff"}
                  stroke={c.hasBudget ? "#ffffff" : "#2a78d6"}
                  strokeWidth={c.hasBudget ? 2 : 2.5}
                  style={{ transition: "r .2s" }}
                />
              </g>
            ))}
          </svg>
        ) : (
          <div style={{ height: H }} />
        )}

        {active && (
          <div
            className="pointer-events-none absolute z-10 w-60 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-[0.3125rem] bg-foreground p-3 text-white shadow-xl"
            style={{
              left: Math.min(Math.max(active.cx, 124), width - 124),
              top: active.cy - active.r,
            }}
          >
            <p className="line-clamp-2 text-[0.8125rem]/5 font-semibold">
              {active.c.title}
            </p>
            <p className="mt-1 text-xs text-white/70">
              {day(active.c.createdAt)}
              {active.c.state && <> · {active.c.state}</>}
            </p>
            <p className="mt-2 flex justify-between text-xs">
              <span>{active.c.views} views</span>
              <span>
                {active.c.hasBudget
                  ? money(active.c.budget, currency)
                  : "No budget on record"}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Key */}
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-full bg-[#2a78d6]" /> Has a
          budget on record
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-3 rounded-full border-2 border-[#2a78d6] bg-white"
          />{" "}
          No budget yet
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="flex items-end gap-0.5">
            <span className="size-1.5 rounded-full bg-foreground/30" />
            <span className="size-2.5 rounded-full bg-foreground/30" />
          </span>
          Bigger dot: more views
        </li>
      </ul>
    </div>
  );
}
