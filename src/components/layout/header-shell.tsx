"use client";

import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The sticky main bar. On large screens it is transparent while the page
 * is at the very top (so the hero shows through) and turns solid white
 * with a soft shadow once you scroll or open a menu. Phones: always solid.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-at-top={atTop}
      className={cn(
        "sticky top-0 z-40 border-b bg-white transition-[background-color,border-color,box-shadow] duration-300",
        atTop
          ? "lg:border-transparent lg:bg-transparent"
          : "shadow-[0_10px_30px_-18px_rgb(0_0_0/0.35)]",
        "lg:has-[[data-menu]]:border-border! lg:has-[[data-menu]]:bg-white!",
      )}
    >
      {children}
    </header>
  );
}
