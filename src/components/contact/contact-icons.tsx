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

/** An envelope with a red heart seal: email. */
export function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect
        x="6"
        y="12"
        width="36"
        height="25"
        rx="3.5"
        fill="#fff"
        {...line}
      />
      <path d="M7 14l17 13 17-13" fill={P} {...line} />
      <path d="M7 36l12-11M41 36L29 25" {...line} strokeWidth={1.75} />
      <circle cx="24" cy="27" r="5.5" fill={R} stroke={K} strokeWidth={1.75} />
      <path
        d="M24 29.6l-2.4-2.3a1.4 1.4 0 0 1 2-2l.4.4.4-.4a1.4 1.4 0 0 1 2 2Z"
        fill="#fff"
      />
    </Icon>
  );
}

/** A handset with signal arcs: phone. */
export function CallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path
        d="M13 7h6l3 8-4 3a20 20 0 0 0 12 12l3-4 8 3v6a4 4 0 0 1-4 4C21 39 9 27 9 11a4 4 0 0 1 4-4Z"
        fill={P}
        {...line}
      />
      <path d="M13 7h6l3 8-4 3" fill={R} {...line} />
      <path
        d="M28 6a14 14 0 0 1 14 14M28 12a8 8 0 0 1 8 8"
        stroke={R}
        strokeWidth={2.25}
        strokeLinecap="round"
      />
    </Icon>
  );
}

/** A map pin over a small building: the office. */
export function OfficeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 41h32" {...line} />
      <path d="M12 41V24h14v17" fill="#fff" {...line} />
      <path
        d="M16 29h2M20 29h2M16 34h2M20 34h2"
        stroke={K}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path d="M26 41V30h10v11" fill={P} {...line} />
      <path
        d="M34 22s-7-6.4-7-11.4a7 7 0 0 1 14 0c0 5-7 11.4-7 11.4Z"
        fill={R}
        {...line}
      />
      <circle cx="34" cy="10.6" r="2.4" fill="#fff" />
    </Icon>
  );
}

/** Three linked nodes, one red: follow the work online. */
export function SocialIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M17 22l14-8M17 26l14 8" {...line} />
      <circle cx="13" cy="24" r="6.5" fill={R} {...line} />
      <circle cx="35" cy="12" r="5.5" fill="#fff" {...line} />
      <circle cx="35" cy="36" r="5.5" fill={P} {...line} />
    </Icon>
  );
}
