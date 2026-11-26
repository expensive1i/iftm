"use client";

import { useRef, useState } from "react";

import map from "@/lib/analytics/africa-map.json";
import { countryById, countryByIso3 } from "@/lib/analytics/countries";

/*
 * A clickable map of Africa (pre-drawn from world-atlas, see
 * src/lib/analytics/africa-map.json). Countries are shaded by how many
 * campaigns they have, in blue (more campaigns, deeper blue); the
 * selected country gets a dark outline. Small island states get a dot so
 * they can be clicked too. Hover (or keyboard focus) shows a label with the
 * name and count. Every country can also be picked from the list, so the
 * map is never the only way in.
 */

// Sequential steps on white, one hue (blue): more campaigns, deeper blue
export const MAP_STEPS = [
  { label: "None yet", color: "#ECEAE5", min: 0 },
  { label: "1–2", color: "#86b6ef", min: 1 },
  { label: "3–9", color: "#2a78d6", min: 3 },
  { label: "10+", color: "#104281", min: 10 },
];

function shade(n: number) {
  let c = MAP_STEPS[0].color;
  for (const s of MAP_STEPS) if (n >= s.min) c = s.color;
  return c;
}

export function AfricaMap({
  counts,
  selected,
  onSelect,
}: {
  counts: Record<number, number>;
  selected: number;
  onSelect: (id: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{
    x: number;
    y: number;
    name: string;
    n: number;
  } | null>(null);

  const show = (
    e: React.PointerEvent | React.FocusEvent,
    id: number,
    cx: number,
    cy: number,
  ) => {
    const c = countryById.get(id);
    const el = box.current;
    if (!c || !el) return;
    const r = el.getBoundingClientRect();
    let x: number;
    let y: number;
    if ("clientX" in e) {
      x = e.clientX - r.left;
      y = e.clientY - r.top;
    } else {
      // Keyboard focus: place the label at the country's centre
      const [, , w, h] = map.viewBox.split(" ").map(Number);
      x = (cx / w) * r.width;
      y = (cy / h) * r.height;
    }
    setTip({ x, y, name: c.name, n: counts[id] ?? 0 });
  };

  const [vx, vy, vw, vh] = map.viewBox.split(" ").map(Number);

  return (
    <div ref={box} className="relative" onPointerLeave={() => setTip(null)}>
      <svg
        viewBox={`${vx} ${vy} ${vw} ${vh}`}
        className="h-auto w-full"
        role="group"
        aria-label="Map of Africa"
      >
        {map.context.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={MAP_STEPS[0].color}
            stroke="#ffffff"
            strokeWidth={1.5}
            aria-hidden
          />
        ))}
        {map.countries.map((m) => {
          const c = countryByIso3.get(m.iso3);
          if (!c) return null;
          const n = counts[c.id] ?? 0;
          const isSel = c.id === selected;
          const label = `${c.name}: ${n ? `${n} campaign${n === 1 ? "" : "s"}` : "no campaigns yet"}`;
          const common = {
            role: "button" as const,
            tabIndex: 0,
            "aria-label": label,
            "aria-pressed": isSel,
            onClick: () => onSelect(c.id),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(c.id);
              }
            },
            onPointerMove: (e: React.PointerEvent) => show(e, c.id, m.cx, m.cy),
            onFocus: (e: React.FocusEvent) => show(e, c.id, m.cx, m.cy),
            onBlur: () => setTip(null),
            className:
              "cursor-pointer outline-none transition-[fill] duration-300 hover:brightness-95 focus-visible:brightness-90",
          };
          return (
            <g key={m.iso3}>
              <path
                d={m.d}
                fill={shade(n)}
                stroke={isSel ? "#1c1c1c" : "#ffffff"}
                strokeWidth={isSel ? 2.5 : 1.2}
                strokeLinejoin="round"
                {...(m.small ? { "aria-hidden": true } : common)}
              />
              {m.small && (
                <circle
                  cx={m.cx}
                  cy={m.cy}
                  r={7}
                  fill={shade(n)}
                  stroke={isSel ? "#1c1c1c" : "#a3a19b"}
                  strokeWidth={isSel ? 2.5 : 1}
                  {...common}
                />
              )}
            </g>
          );
        })}
        {/* Draw the selected outline again on top so neighbours never cover it */}
        {map.countries
          .filter((m) => countryByIso3.get(m.iso3)?.id === selected && !m.small)
          .map((m) => (
            <path
              key="sel"
              d={m.d}
              fill="none"
              stroke="#1c1c1c"
              strokeWidth={2.5}
              pointerEvents="none"
              aria-hidden
            />
          ))}
      </svg>

      {tip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-[0.3125rem] bg-foreground px-3 py-2 text-xs whitespace-nowrap text-white shadow-lg"
          style={{ left: tip.x, top: tip.y }}
        >
          <span className="font-semibold">{tip.name}</span>
          <span className="text-white/70">
            {" "}
            ·{" "}
            {tip.n
              ? `${tip.n} campaign${tip.n === 1 ? "" : "s"}`
              : "no campaigns yet"}
          </span>
        </div>
      )}
    </div>
  );
}
