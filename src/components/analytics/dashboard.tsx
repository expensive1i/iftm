"use client";

import {
  ArrowUpRight,
  Eye,
  Heart,
  LoaderCircle,
  MessageCircle,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { AfricaMap, MAP_STEPS } from "@/components/analytics/africa-map";
import { Flag as FlagsIcon, Map as MapIcon } from "lucide-react";
import {
  BudgetMeters,
  ChartCard,
  StateBars,
} from "@/components/analytics/charts";
import { FlagRail } from "@/components/analytics/flag-rail";
import { CampaignTimeline, MoneyFlow } from "@/components/analytics/visuals";
import { Container } from "@/components/ui/container";
import { WriteOn } from "@/components/ui/write-on";
import { countries, countryById } from "@/lib/analytics/countries";
import type { CountryAnalytics, Overview } from "@/lib/analytics/data";
import { count, day, money } from "@/lib/analytics/format";
import { cn } from "@/lib/utils";

type Status = "ready" | "loading" | "error";

/** "just now", "4 min ago", "2 h ago" */
function ago(iso: string, now: number) {
  const m = Math.round((now - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  return `${Math.round(m / 60)} h ago`;
}

/**
 * The Analytics dashboard, all on white. Pick a country from the row of
 * round flags or on the map (the choice is kept in the address, e.g.
 * ?country=KE, so it can be shared); its figures load from
 * /api/analytics/:id and are remembered for the visit. Shows the country's
 * headline figures, the money flow (budget → spent / not yet accounted
 * for), every campaign on a timeline, budget vs spending per campaign,
 * campaigns by state, and a table of every campaign (the accessible view
 * of all the chart data).
 */
export function AnalyticsDashboard({
  overview,
  initial,
}: {
  overview: Overview | null;
  initial: CountryAnalytics | null;
}) {
  const counts = overview?.counts ?? {};
  const busiest = Number(
    Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 1,
  );
  const [id, setId] = useState(initial?.countryId ?? busiest);
  const [status, setStatus] = useState<Status>(initial ? "ready" : "loading");
  const cache = useRef(
    new Map<number, CountryAnalytics>(
      initial ? [[initial.countryId, initial]] : [],
    ),
  );
  const [data, setData] = useState<CountryAnalytics | null>(initial);
  // Starts at the data's own time so the server and browser render the
  // same; switched to the real clock once mounted
  const [now, setNow] = useState(() =>
    new Date(overview?.fetchedAt ?? initial?.fetchedAt ?? 0).getTime(),
  );
  const panel = useRef<HTMLDivElement>(null);
  // How to pick a country: the row of flags or the full map
  const [view, setView] = useState<"flags" | "map">("flags");

  const load = useCallback(async (next: number) => {
    const hit = cache.current.get(next);
    if (hit) {
      setData(hit);
      setStatus("ready");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`/api/analytics/${next}`);
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as CountryAnalytics;
      cache.current.set(next, json);
      setData((d) => (json.countryId === next ? json : d));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  const select = useCallback(
    (next: number, scroll = false) => {
      setId(next);
      const c = countryById.get(next);
      if (c) {
        const url = new URL(window.location.href);
        url.searchParams.set("country", c.iso2);
        window.history.replaceState(null, "", url);
      }
      void load(next);
      if (scroll) {
        // Bring the chosen country's results into view
        window.setTimeout(
          () =>
            panel.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            }),
          60,
        );
      }
    },
    [load],
  );

  // A shared link (?country=KE) opens on that country
  useEffect(() => {
    const code = new URLSearchParams(window.location.search)
      .get("country")
      ?.toUpperCase();
    const c = code
      ? countries.find((k) => k.iso2 === code || k.iso3 === code)
      : undefined;
    // (deferred a tick so the first paint is the server-rendered country)
    queueMicrotask(() => {
      setNow(Date.now());
      if (c && c.id !== id) select(c.id);
      else if (!initial) void load(id);
    });
    const t = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(t);
    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const country = countryById.get(id)!;
  const shown = data && data.countryId === id ? data : null;
  const s = shown?.summary;
  const campaigns = shown?.campaigns ?? [];
  const cur = country.currency;
  const empty = shown && s && s.campaigns === 0 && campaigns.length === 0;
  const withData = countries
    .filter((c) => counts[c.id])
    .sort((a, b) => counts[b.id] - counts[a.id]);
  const activeCountries = withData.length;

  const views = campaigns.reduce((n, c) => n + c.views, 0);
  const likes = campaigns.reduce((n, c) => n + c.likes, 0);
  const comments = campaigns.reduce((n, c) => n + c.comments, 0);

  return (
    <section
      aria-labelledby="analytics-title"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Quarter gear in the corner, as on the About page */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-[9rem] -rotate-90 opacity-60 sm:size-[20rem] sm:opacity-70"
      />

      <Container className="py-16 sm:py-20 lg:max-w-[80rem] lg:py-24">
        {/* Heading */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-primary" />
              </span>
              Live analytics
            </p>
            <WriteOn
              id="analytics-title"
              className="mt-4 [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
              text="What citizens are tracking, country by country."
            />
          </div>
          <p className="max-w-xl text-base/7 text-muted sm:text-lg/8">
            Live figures from campaigns on iFollowTheMoney: how many there are,
            the public money they follow and how much of it has been spent.
          </p>
        </div>

        {/* Africa-wide figures */}
        {overview && (
          <dl className="mt-10 grid grid-cols-3 border-y border-foreground/10 sm:mt-12">
            {[
              // [short label for phones, full label, value]
              ["Campaigns", "Campaigns across Africa", count(overview.total)],
              ["Countries", "Countries with campaigns", `${activeCountries} / 54`],
              ["Updated", "Last updated", ago(overview.fetchedAt, now)],
            ].map(([short, full, v], i) => (
              <div
                key={full}
                className={cn(
                  "min-w-0 py-4 sm:py-7",
                  i > 0 && "border-l border-foreground/10 pl-3 sm:pl-8",
                )}
              >
                <dt className="truncate text-[0.625rem] font-semibold tracking-[0.12em] text-muted uppercase sm:text-xs sm:tracking-[0.14em]">
                  <span className="sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{full}</span>
                </dt>
                <dd className="mt-1.5 [font-family:Cambria,Georgia,serif] text-[1.25rem]/none font-medium whitespace-nowrap text-black sm:mt-2 sm:text-[2.75rem]/none">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* ── Pick a country: flags or map (tabs) ─────────── */}
        <div className="mt-10 sm:mt-12">
          <div
            role="tablist"
            aria-label="Choose how to pick a country"
            className="inline-flex rounded-full border border-foreground/15 bg-white p-1"
          >
            {(
              [
                ["flags", "Flags", FlagsIcon],
                ["map", "Map", MapIcon],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                role="tab"
                id={`pick-tab-${key}`}
                aria-selected={view === key}
                aria-controls={`pick-panel-${key}`}
                onClick={() => setView(key)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors",
                  view === key
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <Icon aria-hidden className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {view === "flags" ? (
              <div
                role="tabpanel"
                id="pick-panel-flags"
                aria-labelledby="pick-tab-flags"
              >
                <FlagRail
                  selected={id}
                  counts={counts}
                  onSelect={(n) => select(n, true)}
                />
              </div>
            ) : (
              <div
                role="tabpanel"
                id="pick-panel-map"
                aria-labelledby="pick-tab-map"
                className="grid gap-8 rounded-[0.3125rem] border border-t-[3px] border-foreground/15 border-t-primary bg-white p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12"
              >
                <div className="lg:pt-4">
                  <h3 className="[font-family:Cambria,Georgia,serif] text-[1.5rem]/tight font-medium text-black sm:text-[1.875rem]/tight">
                    Across the continent
                  </h3>
                  <p className="mt-2 text-[0.9375rem]/7 text-muted">
                    Each country is shaded by how many campaigns it has. Click
                    one to see its figures.
                  </p>
                  <ul
                    className="mt-6 space-y-2.5"
                    aria-label="Map key: campaigns per country"
                  >
                    {MAP_STEPS.map((st) => (
                      <li
                        key={st.label}
                        className="flex items-center gap-2.5 text-sm text-foreground"
                      >
                        <span
                          aria-hidden
                          className="size-4 rounded-full"
                          style={{ background: st.color }}
                        />
                        {st.label === "None yet"
                          ? "No campaigns yet"
                          : `${st.label} campaigns`}
                      </li>
                    ))}
                  </ul>
                  {withData.length > 0 && (
                    <div className="mt-8">
                      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase">
                        Countries with campaigns
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {withData.map((c) => (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => select(c.id, true)}
                              className={cn(
                                "inline-flex h-9 items-center gap-2 rounded-full border pr-3.5 pl-1.5 text-sm font-medium transition-colors",
                                c.id === id
                                  ? "border-primary bg-primary text-white"
                                  : "border-foreground/15 text-foreground hover:border-primary",
                              )}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`/flags/${c.iso2.toLowerCase()}.svg`}
                                alt=""
                                className="size-6 rounded-full object-cover"
                              />
                              {c.name}
                              <span className="text-xs opacity-80">
                                {counts[c.id]}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mx-auto w-full max-w-[40rem]">
                  <AfricaMap
                    counts={counts}
                    selected={id}
                    onSelect={(n) => select(n, true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── The chosen country ──────────────────────────── */}
        <div
          ref={panel}
          className="mt-8 scroll-mt-28 border-t border-foreground/10 pt-10 sm:mt-10 sm:pt-12"
          aria-live="polite"
          aria-busy={status === "loading"}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={country.iso2}
                src={`/flags/${country.iso2.toLowerCase()}.svg`}
                alt=""
                width={80}
                height={80}
                className="size-16 shrink-0 rounded-full object-cover shadow-[0_0_0_3px_#fff,0_0_0_6px_var(--primary)] sm:size-20"
              />
              <div className="min-w-0">
                <h2 className="flex items-center gap-3 [font-family:Cambria,Georgia,serif] text-[2rem]/tight font-medium text-black sm:text-[2.75rem]/tight">
                  {country.name}
                  {status === "loading" && (
                    <LoaderCircle
                      aria-label="Loading"
                      className="size-5 shrink-0 animate-spin text-primary"
                    />
                  )}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Capital {country.capital} · Currency {country.currency}
                </p>
              </div>
            </div>

            {shown && s && !empty && (
              <ul className="flex flex-wrap gap-2">
                {[
                  [
                    null,
                    `${count(s.campaigns)} campaign${s.campaigns === 1 ? "" : "s"}`,
                  ],
                  [null, `${s.withBudget} with a budget`],
                  [Eye, `${count(views)} views`],
                  [Heart, `${count(likes)} likes`],
                  [MessageCircle, `${count(comments)} comments`],
                ].map(([Icon, label], i) => {
                  const I = Icon as typeof Eye | null;
                  return (
                    <li
                      key={i}
                      className={cn(
                        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium",
                        i === 0
                          ? "border-primary bg-primary text-white"
                          : "border-foreground/15 text-foreground",
                      )}
                    >
                      {I && <I aria-hidden className="size-4 text-primary" />}
                      {label as string}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {country.caption && (
            <p className="mt-5 max-w-3xl text-[0.9375rem]/7 text-muted">
              {country.caption}
            </p>
          )}

          {status === "error" && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[0.3125rem] border border-primary/30 px-4 py-3 text-sm text-accent-foreground">
              The figures for {country.name} could not be loaded just now.
              <button
                type="button"
                onClick={() => void load(id)}
                className="inline-flex items-center gap-1.5 font-semibold text-primary"
              >
                <RotateCw aria-hidden className="size-4" /> Try again
              </button>
            </div>
          )}

          {/* Money flow (or the empty state), full width */}
          <div
            className={cn(
              "mt-8 transition-opacity",
              status === "loading" && "opacity-50",
            )}
          >
            {!shown && status !== "error" ? (
              <div className="min-h-80 animate-pulse rounded-[0.3125rem] bg-accent" />
            ) : shown && s && !empty ? (
              <ChartCard
                key={id}
                title="Where the tracked money stands"
                note="The budget on record, split into what has been spent and what is still to be accounted for"
              >
                <MoneyFlow budget={s.budget} spent={s.spent} currency={cur} />
              </ChartCard>
            ) : empty ? (
              <div className="relative overflow-hidden rounded-[0.3125rem] border border-foreground/15 bg-white p-6 shadow-[5px_6px_0_var(--foreground)] sm:p-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flags/${country.iso2.toLowerCase()}.svg`}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 size-44 rounded-full object-cover opacity-[0.12]"
                />
                <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-primary uppercase">
                  Be the first
                </p>
                <p className="mt-3 [font-family:Cambria,Georgia,serif] text-[1.75rem]/tight font-medium text-black sm:text-[2.25rem]/tight">
                  No campaigns in {country.name} yet.
                </p>
                <p className="mt-3 max-w-md text-[0.9375rem]/7 text-muted">
                  Is there a school, clinic or road in your community that was
                  promised and never finished? Start the first campaign and its
                  figures will show here.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="btn-sweep inline-flex h-12 items-center rounded-[0.3125rem] bg-primary px-6 text-sm font-semibold text-primary-foreground"
                  >
                    Start a campaign
                  </Link>
                  {withData[0] && withData[0].id !== id && (
                    <button
                      type="button"
                      onClick={() => select(withData[0].id)}
                      className="inline-flex h-12 items-center gap-2 rounded-[0.3125rem] border border-foreground/15 bg-white px-5 text-sm font-semibold text-foreground hover:border-foreground/40"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/flags/${withData[0].iso2.toLowerCase()}.svg`}
                        alt=""
                        className="size-5 rounded-full object-cover"
                      />
                      See {withData[0].name}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Charts and table (countries with campaigns) ── */}
          {shown && campaigns.length > 0 && (
            <div
              key={id}
              className={cn(
                "mt-6 transition-opacity lg:mt-8",
                status === "loading" && "opacity-50",
              )}
            >
              <ChartCard
                title="Every campaign, by the day it started"
                note="Hover a dot for its details; click to open it"
              >
                <CampaignTimeline campaigns={campaigns} currency={cur} now={now} />
              </ChartCard>

              <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-3 lg:items-start lg:gap-8">
                <ChartCard
                  title="Budget and spending by campaign"
                  note="Light bar: the budget. Red: what has been spent."
                  className="lg:col-span-2"
                >
                  <BudgetMeters campaigns={campaigns} currency={cur} />
                </ChartCard>
                <ChartCard
                  title="Campaigns by state"
                  note="Where the campaigns are"
                >
                  <StateBars campaigns={campaigns} />
                </ChartCard>
              </div>

              {/* Every campaign: the table view of the data above */}
              <section className="mt-6 overflow-hidden rounded-[0.3125rem] border border-t-[3px] border-foreground/15 border-t-primary bg-white lg:mt-8">
                <h3 className="border-b border-foreground/10 px-5 py-4 [font-family:Cambria,Georgia,serif] text-[1.25rem]/tight font-medium text-black sm:px-6">
                  All campaigns in {country.name}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[44rem] text-left text-sm">
                    <thead className="text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
                      <tr className="border-b border-foreground/10">
                        <th className="px-5 py-3 font-medium sm:px-6">
                          Campaign
                        </th>
                        <th className="px-3 py-3 font-medium">State</th>
                        <th className="px-3 py-3 font-medium">Started</th>
                        <th className="px-3 py-3 text-right font-medium">
                          Budget
                        </th>
                        <th className="px-3 py-3 text-right font-medium">
                          Spent
                        </th>
                        <th className="px-5 py-3 text-right font-medium sm:px-6">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/[0.06]">
                      {campaigns.map((c) => (
                        <tr key={c.id} className="align-top">
                          <td className="max-w-[22rem] px-5 py-3.5 sm:px-6">
                            <a
                              href={c.link}
                              target="_blank"
                              rel="noreferrer"
                              className="group inline-flex items-start gap-1 font-medium text-foreground hover:text-primary"
                            >
                              <span className="line-clamp-2">{c.title}</span>
                              <ArrowUpRight
                                aria-hidden
                                className="mt-0.5 size-3.5 shrink-0 text-muted group-hover:text-primary"
                              />
                              <span className="sr-only">
                                (opens on ifollowthemoney.org)
                              </span>
                            </a>
                          </td>
                          <td className="px-3 py-3.5 text-muted">
                            {c.state ?? "—"}
                          </td>
                          <td className="px-3 py-3.5 whitespace-nowrap text-muted">
                            {day(c.createdAt)}
                          </td>
                          <td className="px-3 py-3.5 text-right whitespace-nowrap text-foreground tabular-nums">
                            {c.hasBudget ? money(c.budget, cur) : "—"}
                          </td>
                          <td className="px-3 py-3.5 text-right whitespace-nowrap text-foreground tabular-nums">
                            {c.hasBudget ? money(c.spent, cur) : "—"}
                          </td>
                          <td className="px-5 py-3.5 text-right text-foreground tabular-nums sm:px-6">
                            {count(c.views)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <p className="mt-3 text-xs text-muted">
                Source: campaigns on ifollowthemoney.org, updated{" "}
                {ago(shown.fetchedAt, now)}. Figures are as reported by campaign
                creators.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
