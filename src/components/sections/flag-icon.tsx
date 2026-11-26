import type { Flag } from "@/components/sections/map-countries";

/** A country's simplified flag as a small round SVG (matches the globe). */
export function FlagIcon({ flag, className }: { flag: Flag; className?: string }) {
  const total = flag.stripes.reduce((n, s) => n + (s.weight ?? 1), 0);
  const bands = flag.stripes.reduce<{ color: string; start: number; size: number }[]>(
    (out, s) => {
      const start = out.length ? out[out.length - 1].start + out[out.length - 1].size : 0;
      out.push({ color: s.color, start, size: ((s.weight ?? 1) / total) * 20 });
      return out;
    },
    [],
  );
  return (
    <svg viewBox="-10 -10 20 20" aria-hidden className={className}>
      <clipPath id="flag-circle">
        <circle r="10" />
      </clipPath>
      <g clipPath="url(#flag-circle)">
        {bands.map((b, i) =>
          flag.dir === "h" ? (
            <rect key={i} x={-10} y={-10 + b.start} width={20} height={b.size + 0.3} fill={b.color} />
          ) : (
            <rect key={i} x={-10 + b.start} y={-10} width={b.size + 0.3} height={20} fill={b.color} />
          ),
        )}
        {flag.disc && <circle r="3.2" fill={flag.disc} />}
        {flag.star && (
          <path
            transform="scale(0.34)"
            d="M0-10 2.9-3.1 10.5-3.1 4.3 1.4 6.6 8.1 0 4 -6.6 8.1 -4.3 1.4 -10.5-3.1 -2.9-3.1Z"
            fill={flag.star}
          />
        )}
      </g>
    </svg>
  );
}
