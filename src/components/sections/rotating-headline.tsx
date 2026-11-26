"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The hero headline, cycling through several lines on a timer like the
 * collage photos. Every line is stacked in the same grid cell, so the
 * block keeps the height of the longest one and nothing below it jumps.
 * Only the visible line is exposed to screen readers.
 */
export function RotatingHeadline({
  lines,
  interval = 5000,
  className,
}: {
  lines: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % lines.length), interval);
    return () => clearInterval(id);
  }, [lines.length, interval]);

  return (
    <h1 className={cn("grid", className)}>
      {lines.map((line, i) => (
        <span
          key={line}
          aria-hidden={i !== index}
          className={cn(
            "col-start-1 row-start-1 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            i === index
              ? "translate-y-0 opacity-100 blur-0"
              : "pointer-events-none translate-y-4 opacity-0 blur-[2px]",
          )}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}
