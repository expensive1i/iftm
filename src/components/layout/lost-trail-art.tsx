import type { SVGProps } from "react";

/*
 * The "404" itself, drawn as the page-not-found illustration: two bold
 * dark 4s, and the 0 is a magnifying glass with a red question mark in the
 * lens. Under it, a dotted money trail of coins runs out. Brand red, soft
 * pink and dark ink, like the About page illustrations. The glass and the
 * coins float gently (CSS `ftm-float`, off with reduced motion).
 */
const R = "#d3000f";
const D = "#6e0008";
const P = "#fde8e9";
const K = "#1c1c1c";

function Four({ x }: { x: number }) {
  // Drawn as one thick stroke: down-stroke, diagonal, crossbar
  return (
    <path
      d={`M${x + 96} ${206}V${34}L${x + 14} ${150}H${x + 128}`}
      stroke={K}
      strokeWidth={30}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Coin({ x, y, delay }: { x: number; y: number; delay: string }) {
  return (
    <g className="ftm-float" style={{ animationDelay: delay }}>
      <ellipse cx={x} cy={y + 4} rx="13" ry="4.5" fill={D} />
      <ellipse
        cx={x}
        cy={y}
        rx="13"
        ry="4.5"
        fill={R}
        stroke={K}
        strokeWidth={2}
      />
      <path
        d={`M${x - 13} ${y}v4a13 4.5 0 0 0 26 0v-4`}
        stroke={K}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

export function LostTrailArt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 560 290"
      fill="none"
      role="img"
      aria-label="404"
      {...props}
    >
      {/* Soft disc behind the 0 */}
      <circle cx="280" cy="122" r="104" fill={P} />

      <Four x={20} />
      <Four x={392} />

      {/* The 0: a magnifying glass */}
      <g className="ftm-float" style={{ animationDuration: "5s" }}>
        <path
          d="M322 166l40 40"
          stroke={K}
          strokeWidth={24}
          strokeLinecap="round"
        />
        <path
          d="M322 166l40 40"
          stroke={R}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <circle
          cx="280"
          cy="122"
          r="70"
          fill="#fff"
          stroke={K}
          strokeWidth={22}
        />
        <path
          d="M240 96a50 50 0 0 1 30-22"
          stroke={P}
          strokeWidth={8}
          strokeLinecap="round"
        />
        {/* Question mark */}
        <path
          d="M264 108a17 17 0 1 1 25 15c-6 3.5-9 7-9 13.5"
          stroke={R}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="280" cy="157" r="5.5" fill={R} />
      </g>

      {/* The money trail that runs out */}
      <path
        d="M30 262h500"
        stroke={K}
        strokeOpacity={0.15}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M46 256c40 0 60-20 96-20s58 18 92 16 46-14 70-22"
        stroke={R}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="0.5 11"
      />
      <path
        d="M320 226l9-4M338 219l5-2"
        stroke={R}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.35}
      />
      <Coin x={66} y={250} delay="0s" />
      <Coin x={146} y={232} delay="0.4s" />
      <Coin x={228} y={246} delay="0.8s" />
    </svg>
  );
}
