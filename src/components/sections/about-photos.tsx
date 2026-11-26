"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const STEP_MS = 3500;

// `crop` trims the corner of a photo that carries a printed credit mark.
// The field photos (© CODE / KC Nwakalor) come from CODE's Flickr.
const photos = [
  {
    src: "/images/community/bagega-well.jpg",
    alt: "A woman drawing water from a well in Bagega, Zamfara",
    pos: "72% 45%",
    crop: true,
    title: "Bagega, Zamfara",
    text: "Where it began: the community whose children Follow The Money first campaigned for.",
  },
  {
    src: "/images/about-2.jpg",
    alt: "A Follow The Money tracker talking with women in a community",
    pos: "58% 40%",
    crop: true,
    title: "Listening first",
    text: "Trackers ask communities what was promised, and what arrived.",
  },
  {
    src: "/images/about-3.jpg",
    alt: "Follow The Money trackers working with a community",
    pos: "35% 40%",
    title: "On the ground",
    text: "Every project is checked in person, not just on paper.",
  },
  {
    src: "/images/community/zamfara-roofless-classroom.jpg",
    alt: "A classroom in Zamfara with no roof, only the bare rafters",
    pos: "50% 50%",
    crop: true,
    title: "A classroom with no roof",
    text: "The kind of unfinished project trackers find, report and follow up.",
  },
  {
    src: "/images/community/shikira-water-point.jpg",
    alt: "Children fetching water with jerrycans at a water point in Shikira, Niger State",
    pos: "30% 55%",
    crop: true,
    title: "Shikira, Niger State",
    text: "Children fetching water: the everyday needs that public money is meant to meet.",
  },
  {
    src: "/images/about-1.jpg",
    alt: "Citizens at a Follow The Money community meeting",
    pos: "62% 35%",
    title: "Voices together",
    text: "What citizens find is shared, so leaders have to answer.",
  },
];

/**
 * Arched photo that changes every few seconds with a soft cross-fade and a
 * slow zoom. Each photo carries a short caption that slides up inside its
 * lower edge once the photo is showing. Hovering pauses the changes.
 */
export function AboutPhotos() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % photos.length), STEP_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      className="relative isolate mx-auto w-full max-w-[28rem] pr-4 pb-5 lg:mx-0 lg:ml-auto"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Dot patch behind the lower left */}
      <div
        aria-hidden
        className="absolute -bottom-6 -left-8 -z-10 size-40 bg-[url(/brand/pattern-dots-orbit.svg)] bg-size-[2.5rem] [mask-image:radial-gradient(circle,black_35%,transparent_72%)] sm:-left-12 sm:size-48"
      />

      {/* The extra layer: a deep red copy of the arch set just behind it,
          like the offset block under the campaign cards */}
      <div
        aria-hidden
        className="absolute inset-0 top-5 left-4 -z-10 rounded-t-[999px] rounded-b-[1rem] bg-primary-deep"
      />

      <div className="relative aspect-square overflow-hidden rounded-t-[999px] sm:aspect-[5/6] rounded-b-[1rem] bg-surface-muted">
      {photos.map((p, i) => {
        const on = i === active;
        return (
          <figure
            key={p.src}
            aria-hidden={!on}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              on ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 34vw, 90vw"
              className={cn(
                "object-cover transition-transform duration-[4500ms] ease-out",
                p.crop ? "origin-top-left" : "origin-center",
                // Slow zoom while showing; the cropped photo never drops
                // below the scale that hides its credit mark.
                on ? (p.crop ? "scale-[1.2]" : "scale-[1.08]") : p.crop ? "scale-[1.14]" : "scale-100",
              )}
              style={{ objectPosition: p.pos }}
            />

            {/* Caption sliding up inside the lower edge */}
            <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.72),rgb(0_0_0/0.35)_60%,transparent)] px-5 pt-10 pb-4 text-white sm:px-7 sm:pt-16 sm:pb-6">
              <div
                className={cn(
                  "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  on ? "translate-y-0 opacity-100 delay-300" : "translate-y-5 opacity-0",
                )}
              >
                <p className="[font-family:Cambria,Georgia,serif] text-[1.375rem]/tight font-medium sm:text-[1.5rem]/tight">
                  {p.title}
                </p>
                <p className="mt-1 max-w-[24rem] text-[0.8125rem]/5 text-white/80 sm:mt-1.5 sm:text-sm/6">{p.text}</p>
              </div>
            </figcaption>
          </figure>
        );
      })}
      </div>
    </div>
  );
}
