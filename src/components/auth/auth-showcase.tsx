"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/*
 * The right-hand panel of the auth pages: a soft brand panel with a short
 * fact and a cut-out photo of people from the network (background removed,
 * with a thick deep-red outline like a sticker; made with rembg, see
 * scripts/make-cutouts.py). It moves to the next slide every 6 seconds
 * with a gentle cross-fade and rise; the dots below let you pick one.
 * With reduced motion it does not rotate on its own.
 * Facts are the figures published on ifollowthemoney.org.
 */
const slides = [
  {
    src: "/images/cutouts/march-wall.png",
    width: 2043,
    height: 1037,
    // Wide group: sits against the panel's left edge
    // and bleeds a little past it, so the group touches the edge
    align: "-left-[7%] w-[107%] object-[left_bottom]",
    title: "Track the projects meant for your community.",
    text: "Citizens across Africa follow public money from the budget to the finished project.",
  },
  {
    src: "/images/cutouts/banner-home.png",
    width: 1178,
    height: 1041,
    // Bleeds a little past the right edge
    align: "-right-[7%] w-[107%] object-[right_bottom]",
    title: "₦447 million saved from financial leakages.",
    text: "Because citizens asked where the money went, and kept asking.",
  },
  {
    src: "/images/cutouts/bauchi-schoolgirls.png",
    width: 1752,
    height: 1036,
    // Wide group: bleeds a little past the left edge
    align: "-left-[7%] w-[107%] object-[left_bottom]",
    title: "371 grassroots communities and counting.",
    text: "$13.5 million in government projects tracked by the people they were meant for.",
  },
];

const EVERY = 6000;

export function AuthShowcase() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = window.setInterval(
      () => setI((n) => (n + 1) % slides.length),
      EVERY,
    );
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-[#FDF6F6]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decoration: a big soft circle and the brand gear */}
      <div
        aria-hidden
        className="absolute -right-24 -bottom-24 -z-10 size-[34rem] rounded-full bg-[#F7D3D6]/20"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-56 -rotate-90 opacity-70"
      />

      {/* Fact */}
      <div
        className="relative z-10 px-10 pt-12 xl:px-14 xl:pt-14"
        aria-live="polite"
      >
        {slides.map((s, k) => (
          <div
            key={s.src}
            className={cn(
              "transition-[opacity,transform] duration-700 ease-out",
              k === i
                ? "relative opacity-100"
                : "pointer-events-none absolute inset-x-10 top-12 translate-y-3 opacity-0 xl:inset-x-14 xl:top-14",
            )}
            aria-hidden={k !== i}
          >
            <h2 className="max-w-md [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance text-black xl:text-[2.375rem]/[2.875rem]">
              {s.title}
            </h2>
            <p className="mt-4 max-w-sm text-[0.9375rem]/7 text-muted">
              {s.text}
            </p>
          </div>
        ))}
        {/* Dots */}
        <div className="mt-7 flex gap-2" role="tablist" aria-label="Slides">
          {slides.map((s, k) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Slide ${k + 1}`}
              onClick={() => setI(k)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                k === i
                  ? "w-8 bg-primary"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40",
              )}
            />
          ))}
        </div>
      </div>

      {/* Cut-out photos */}
      <div className="relative mt-auto h-[58%] min-h-[18rem] translate-y-[6%]">
        {slides.map((s, k) => (
          <Image
            key={s.src}
            src={s.src}
            alt=""
            width={s.width}
            height={s.height}
            sizes="(min-width: 1024px) 45vw, 0px"
            priority={k === 0}
            className={cn(
              "absolute inset-y-0 h-full object-contain drop-shadow-[0_24px_30px_rgb(110_0_8/0.25)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              "align" in s && s.align
                ? s.align
                : "inset-x-0 w-full object-[right_bottom]",
              k === i ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          />
        ))}
      </div>
    </div>
  );
}
