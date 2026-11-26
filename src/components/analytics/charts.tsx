"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Campaign } from "@/lib/analytics/data";
import { money, pct } from "@/lib/analytics/format";
import { cn } from "@/lib/utils";

/*
 * Charts for the Analytics page, drawn in plain HTML/SVG in the analytics
 * palette (blue: campaigns and budgets, green: money spent, amber: money
 * not yet accounted for; checked for colour-blind separation), following the site's data-viz
 * rules: thin bars (≤ 24px) with 4px rounded data-ends, hairline axes,
 * values in text colours (never the bar colour), selective labels, and the full
 * numbers in the campaigns table.
 * Bars grow in when they first scroll into view (skipped with reduced
 * motion); each chart is re-keyed per country, so they grow again on a
 * change of country.
 */

/** True once the element has scrolled into view (with reduced motion the bars just appear: no transition). */
function useGrown<T extends Element>() {
  const ref = useRef<T>(null);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, grown] as const;
}

const grow =
  "transition-[width,height] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/** A titled card that holds one chart. */
export function ChartCard({
  title,
  note,
  className,
  children,
}: {
  title: string;
  note?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[0.3125rem] border border-t-[3px] border-foreground/15 border-t-primary bg-white p-5 sm:p-6",
        className,
      )}
    >
      <h3 className="[font-family:Cambria,Georgia,serif] text-[1.25rem]/tight font-medium text-black">
        {title}
      </h3>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * Budget and spending per campaign: a meter per row (light track = the
 * budget, red fill = what has been spent), with the figures beside it.
 */
export function BudgetMeters({
  campaigns,
  currency,
}: {
  campaigns: Campaign[];
  currency: string;
}) {
  const [ref, grown] = useGrown<HTMLUListElement>();
  const rows = campaigns
    .filter((c) => c.hasBudget && c.budget > 0)
    .sort((a, b) => b.budget - a.budget);
  if (!rows.length) {
    return (
      <p className="text-sm text-muted">
        None of these campaigns has a budget on record yet.
      </p>
    );
  }
  return (
    <ul ref={ref} className="space-y-5">
      {rows.map((c) => {
        const share = pct(c.spent, c.budget);
        return (
          <li key={c.id}>
            <div className="flex items-baseline justify-between gap-4">
              <a
                href={c.link}
                target="_blank"
                rel="noreferrer"
                className="line-clamp-1 text-[0.9375rem] font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {c.title}
              </a>
              <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
                {share}%
              </span>
            </div>
            <div
              role="img"
              aria-label={`${money(c.spent, currency)} spent of a ${money(c.budget, currency)} budget (${share}%)`}
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#d3f2e6]"
            >
              <div
                className={cn("h-full rounded-full bg-[#1baf7a]", grow)}
                style={{
                  width: grown
                    ? `${Math.max(share, c.spent > 0 ? 1.5 : 0)}%`
                    : 0,
                }}
              />
            </div>
            <p className="mt-1.5 text-[0.8125rem] text-muted tabular-nums">
              {money(c.spent, currency)} spent of {money(c.budget, currency)}
              {c.state && <> · {c.state}</>}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/** Campaigns per state (or region), ranked, top 7 plus "Other". */
export function StateBars({ campaigns }: { campaigns: Campaign[] }) {
  const [ref, grown] = useGrown<HTMLUListElement>();
  const rows = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of campaigns)
      m.set(c.state ?? "Not given", (m.get(c.state ?? "Not given") ?? 0) + 1);
    const all = [...m.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
    if (all.length <= 8) return all;
    const other = all.slice(7).reduce((n, [, v]) => n + v, 0);
    return [...all.slice(0, 7), ["Other", other] as [string, number]];
  }, [campaigns]);
  const max = Math.max(1, ...rows.map(([, v]) => v));
  return (
    <ul ref={ref} className="space-y-3">
      {rows.map(([name, v]) => (
        <li
          key={name}
          className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3"
        >
          <span className="truncate text-sm text-foreground">{name}</span>
          <span
            className="h-3.5"
            role="img"
            aria-label={`${name}: ${v} campaign${v === 1 ? "" : "s"}`}
          >
            <span
              className={cn("block h-full rounded-r-[4px] bg-[#2a78d6]", grow)}
              style={{ width: grown ? `${(v / max) * 100}%` : 0 }}
            />
          </span>
          <span className="w-6 text-right text-sm font-semibold text-foreground tabular-nums">
            {v}
          </span>
        </li>
      ))}
    </ul>
  );
}
