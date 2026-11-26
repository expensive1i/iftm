import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { LostTrailArt } from "@/components/layout/lost-trail-art";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * The site's empty state ("page not found"), on its own with no header or
 * footer: the "404" drawn as the illustration (the 0 is a magnifying glass
 * over a money trail that runs out), one line of text and a single text
 * link back home, over a huge faint "iFollowTheMoney" watermark.
 */
export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-white px-4 py-16">
      {/* Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center select-none"
      >
        <span className="font-display text-[19vw]/none font-bold tracking-[-0.05em] whitespace-nowrap text-foreground/[0.035] lg:text-[15vw]/none">
          iFollowTheMoney
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        <h1 className="sr-only">Page not found (404)</h1>
        <LostTrailArt className="h-auto w-full max-w-[32rem]" />
        <p className="mt-8 [font-family:Cambria,Georgia,serif] text-[1.5rem]/tight text-black sm:text-[2rem]/tight">
          This page isn’t here.
        </p>
        <Link
          href="/"
          className="group mt-5 inline-flex items-center gap-1 text-base font-semibold text-primary underline-offset-[6px] hover:underline"
        >
          Back to home
          <ChevronRight
            aria-hidden
            className="size-5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </main>
  );
}
