import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

// The card shown when a link to the site is shared (WhatsApp, X, LinkedIn…).
export const alt = `${siteConfig.name}: make public funds work for the public`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The gear mark, drawn inline (same geometry as /brand/motif-gear-red.svg).
function GearMark() {
  const teeth = [-45, 0, 45];
  const dots: [number, number][] = [
    [-91.9, 91.9],
    [-130, 0],
    [-91.9, -91.9],
  ];
  return (
    <svg width="300" height="300" viewBox="-160 -160 320 320">
      <circle
        r="81"
        fill="none"
        stroke="#D3000F"
        strokeWidth="36"
        strokeDasharray="155.5 7 56.6 7 56.6 7 56.6 7 155.5 0"
      />
      {teeth.map((a) => (
        <rect key={a} x="94" y="-15" width="24" height="30" rx="2" fill="#D3000F" transform={`rotate(${a})`} />
      ))}
      {dots.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="12" fill="#D3000F" />
      ))}
      <g transform="rotate(8)">
        <path d="M0 -150 L24 0 L0 150 L-24 0 Z" fill="#D3000F" stroke="#0c0c0c" strokeWidth="7" />
        <circle r="10" fill="#0c0c0c" />
      </g>
    </svg>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "linear-gradient(180deg, #0c0c0c 45%, #22030a 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.6)", letterSpacing: 2 }}>
            {siteConfig.name}
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 24, fontFamily: "serif" }}>
            Make public funds work for the public.
          </div>
          <div style={{ fontSize: 28, marginTop: 30, color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
            Citizens tracking government and aid spending across Africa.
          </div>
        </div>
        <GearMark />
      </div>
    ),
    size,
  );
}
