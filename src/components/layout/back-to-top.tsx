"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A round "back to top" button in the bottom-right corner on every page.
 * It fades in once you have scrolled down a screen or so, and shows how far
 * down the page you are as a red ring around it.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShown(window.scrollY > window.innerHeight * 0.8);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const C = 2 * Math.PI * 22;

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full bg-white text-foreground shadow-[0_12px_28px_-10px_rgb(0_0_0/0.45)] transition-[opacity,transform,background-color,color] duration-300 hover:bg-primary hover:text-white sm:right-6 sm:bottom-6 sm:size-14",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {/* Scroll progress ring */}
      <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90">
        <circle cx="24" cy="24" r="22" fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
        />
      </svg>
      <ArrowUp aria-hidden className="relative size-5" />
    </button>
  );
}
