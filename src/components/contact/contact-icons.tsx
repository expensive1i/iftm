import type { SVGProps } from "react";

/*
 * Custom two-tone icons for the Contact page shortcuts, drawn to match the
 * About page illustrations: dark outlines, brand red, soft pink fills, on a
 * 48×48 grid.
 */

const R = "#d3000f";
const P = "#fde8e9";
const K = "#1c1c1c";
const line = {
  stroke: K,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      {children}
    </svg>
  );
}

/** A megaphone with two sound waves: start a campaign. */
export function CampaignIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path
        d="M10 20h5l15-8v24l-15-8h-5a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3Z"
        fill={P}
        {...line}
      />
      <path d="M15 28l2 9h5l-2-9" fill="#fff" {...line} />
      <path d="M30 12v24" {...line} />
      <path
        d="M35.5 19.5q2.5 4.5 0 9M39.5 16q4.5 8 0 16"
        stroke={R}
        strokeWidth={2.25}
        strokeLinecap="round"
      />
    </Icon>
  );
}

/** A phone with a map pin on screen: the app. */
export function AppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="14" y="5" width="20" height="38" rx="4" fill="#fff" {...line} />
      <path d="M14 11h20M14 36h20" {...line} />
      <rect x="15" y="12" width="18" height="23" fill={P} />
      <path
        d="M24 30s-5-4.6-5-8.2a5 5 0 0 1 10 0c0 3.6-5 8.2-5 8.2Z"
        fill={R}
      />
      <circle cx="24" cy="21.8" r="1.8" fill="#fff" />
      <circle cx="24" cy="39.5" r="1.2" fill={K} />
    </Icon>
  );
}

/** Rising bars under a trend line: the analytics. */
export function AnalyticsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M7 8v33h34" {...line} />
      <rect
        x="12"
        y="29"
        width="6"
        height="12"
        rx="1.5"
        fill={P}
        {...line}
        strokeWidth={1.75}
      />
      <rect
        x="22"
        y="22"
        width="6"
        height="19"
        rx="1.5"
        fill={P}
        {...line}
        strokeWidth={1.75}
      />
      <rect
        x="32"
        y="15"
        width="6"
        height="26"
        rx="1.5"
        fill={R}
        {...line}
        strokeWidth={1.75}
      />
      <path
        d="M12 22l9-7 8 3 9-9"
        stroke={R}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="9" r="2.5" fill={R} />
    </Icon>
  );
}

/** Three people together: the movement. */
export function PeopleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="18" r="4.5" fill="#fff" {...line} />
      <path d="M4 37a8 8 0 0 1 16 0" fill="#fff" {...line} />
      <circle cx="36" cy="18" r="4.5" fill="#fff" {...line} />
      <path d="M28 37a8 8 0 0 1 16 0" fill="#fff" {...line} />
      <circle cx="24" cy="15" r="5.5" fill={R} {...line} />
      <path d="M14 40a10 10 0 0 1 20 0" fill={P} {...line} />
    </Icon>
  );
}
