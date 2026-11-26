import type { SVGProps } from "react";

/*
 * Custom spot illustrations for the six kinds of people in the network
 * (used by WhoWeAre). Drawn in the brand palette: logo red, deep red, soft
 * pink, off-white and the wordmark grey for outlines. Each sits on a pink
 * disc. They are still: no hover or touch animation.
 */

const R = "#d3000f"; // primary
const D = "#6e0008"; // primary-deep
const P = "#fde8e9"; // accent
const K = "#1c1c1c"; // outline
const W = "#ffffff";

const stroke = {
  stroke: K,
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden {...props}>
      <circle cx="80" cy="62" r="44" fill={P} />
      <path d="M28 104h104" {...stroke} strokeWidth={2} opacity={0.2} />
      {children}
    </svg>
  );
}

/** A newspaper with a microphone held up beside it. */
export function JournalistArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <g>
        <path d="M38 28h50l10 10v62H38z" fill={W} {...stroke} />
        <path d="M88 28v10h10" {...stroke} />
        <rect x="46" y="38" width="34" height="8" rx="1.5" fill={R} />
        <path d="M46 55h44M46 63h44M46 71h20" {...stroke} strokeWidth={2} />
        <rect x="70" y="69" width="20" height="22" rx="2" fill={P} {...stroke} strokeWidth={2} />
        <path d="M46 80h16M46 88h16" {...stroke} strokeWidth={2} />
      </g>
      <g>
        <path d="M100 66a14 14 0 0 0 28 0" {...stroke} />
        <path d="M114 80v16M106 96h16" {...stroke} />
        <rect x="105" y="40" width="18" height="32" rx="9" fill={D} {...stroke} />
        <path d="M109 50h10M109 57h10M109 64h10" stroke={W} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      </g>
      <circle cx="126" cy="30" r="3" fill={R} />
    </Frame>
  );
}

/** A database turning into a clean, open table. */
export function DataArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <g>
        <path d="M34 38v46a22 7 0 0 0 44 0V38" fill={W} {...stroke} />
        <path d="M34 54a22 7 0 0 0 44 0M34 69a22 7 0 0 0 44 0" {...stroke} strokeWidth={2} />
        <ellipse cx="56" cy="38" rx="22" ry="7" fill={R} {...stroke} />
        <circle cx="44" cy="62" r="1.8" fill={K} />
        <circle cx="44" cy="77" r="1.8" fill={K} />
      </g>
      <path d="M83 62h10" {...stroke} strokeDasharray="1 5" />
      <path d="M91 57l5 5-5 5" {...stroke} />
      <g>
        <rect x="100" y="38" width="36" height="48" rx="4" fill={W} {...stroke} />
        <path d="M100 50h36M100 62h36M100 74h36M118 38v48" {...stroke} strokeWidth={2} />
        <rect x="119.5" y="51.5" width="15" height="9" fill={R} />
        <rect x="101.5" y="63.5" width="15" height="9" fill={P} />
      </g>
      <circle cx="92" cy="34" r="3" fill={D} />
    </Frame>
  );
}

/** A megaphone calling out, with sound waves. */
export function ChampionArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <g>
        <path d="M54 74l6 22h10l-4-20" fill={D} {...stroke} />
        <rect x="38" y="50" width="16" height="24" rx="4" fill={W} {...stroke} />
        <path d="M54 52l40-18v56L54 72z" fill={R} {...stroke} />
        <path d="M94 34c5 0 8 13 8 28s-3 28-8 28" fill={W} {...stroke} />
      </g>
      <path
       
        d="M110 50q6 12 0 24M119 42q11 20 0 40"
        stroke={R}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx="132" cy="36" r="3" fill={D} />
    </Frame>
  );
}

/** A bar chart under a magnifying glass. */
export function AnalystArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <path d="M34 30v66h76" {...stroke} />
      <g>
        <rect x="42" y="72" width="12" height="24" rx="2" fill={P} {...stroke} strokeWidth={2} />
        <rect x="60" y="60" width="12" height="36" rx="2" fill={W} {...stroke} strokeWidth={2} />
        <rect x="78" y="46" width="12" height="50" rx="2" fill={R} {...stroke} strokeWidth={2} />
        <path d="M44 62l18-12 18-6 16-14" stroke={D} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g>
        <circle cx="110" cy="50" r="17" fill={W} fillOpacity={0.85} {...stroke} />
        <path d="M110 40a10 10 0 0 1 10 10" stroke={R} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M122 62l12 12" stroke={K} strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle cx="96" cy="30" r="3" fill={R} />
    </Frame>
  );
}

/** The scales of justice. */
export function LegalArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <path d="M80 34v58" {...stroke} strokeWidth={3} />
      <rect x="60" y="92" width="40" height="8" rx="3" fill={D} {...stroke} />
      <g>
        <path d="M42 38h76" {...stroke} strokeWidth={3} />
        <path d="M42 38l-12 30M42 38l12 30M118 38l-12 30M118 38l12 30" {...stroke} strokeWidth={1.8} />
        <path d="M28 68h28a14 9 0 0 1-28 0z" fill={W} {...stroke} />
        <path d="M104 68h28a14 9 0 0 1-28 0z" fill={R} {...stroke} />
      </g>
      <circle cx="80" cy="32" r="5" fill={R} {...stroke} strokeWidth={2} />
    </Frame>
  );
}

/** Three people, one asking a question. */
export function CitizenArt(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <g>
        <path d="M34 100a14 14 0 0 1 28 0" fill={W} {...stroke} />
        <circle cx="48" cy="72" r="8" fill={W} {...stroke} />
        <path d="M98 100a14 14 0 0 1 28 0" fill={D} {...stroke} />
        <circle cx="112" cy="72" r="8" fill={D} {...stroke} />
      </g>
      <g>
        <path d="M60 102a20 20 0 0 1 40 0" fill={R} {...stroke} />
        <circle cx="80" cy="64" r="11" fill={W} {...stroke} />
      </g>
      <g>
        <path d="M96 22h32a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5h-20l-8 7v-7h-4a5 5 0 0 1-5-5V27a5 5 0 0 1 5-5z" fill={W} {...stroke} />
        <circle cx="104" cy="34" r="2.4" fill={R} />
        <circle cx="112" cy="34" r="2.4" fill={R} />
        <circle cx="120" cy="34" r="2.4" fill={R} />
      </g>
    </Frame>
  );
}
