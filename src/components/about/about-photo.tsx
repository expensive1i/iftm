import { MapPin } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

// Five photos, each from a different event, with a place label on each.
// Field photos © CODE (many by KC Nwakalor), from CODE's Flickr.
// `area` places each photo in the bento grid below.
const photos = [
  {
    src: "/images/banner-about.jpg",
    alt: "A Follow The Money tracker with members of a community",
    pos: "62% 35%",
    place: "With the community",
    area: "col-span-2 row-span-3 sm:row-span-4 lg:col-span-6 lg:row-span-6",
    big: true,
  },
  {
    src: "/images/community/zamfara-roofless-classroom.jpg",
    alt: "A classroom in Zamfara with no roof",
    pos: "50% 50%",
    place: "Zamfara",
    area: "row-span-2 lg:col-span-3 lg:row-span-3",
  },
  {
    src: "/images/community/bagega-girl.jpg",
    alt: "A girl in Bagega, Zamfara",
    pos: "50% 35%",
    place: "Bagega, Zamfara",
    area: "row-span-2 lg:col-span-3 lg:row-span-4",
  },
  {
    src: "/images/community/kuchingoro-graduates.jpg",
    alt: "Graduates walking along a dirt road in Kuchingoro, Abuja",
    pos: "40% 45%",
    place: "Kuchingoro, Abuja",
    area: "row-span-2 lg:col-span-3 lg:row-span-3",
  },
  {
    src: "/images/community/shikira-water-point.jpg",
    alt: "Children fetching water at a water point in Shikira, Niger State",
    pos: "30% 55%",
    place: "Shikira, Niger State",
    area: "row-span-2 lg:col-span-3 lg:row-span-2",
  },
];

/**
 * A bento photo grid after the intro text. On large screens: one tall photo
 * on the left (on the deep red offset block used across the site), and four
 * photos of different heights beside it. On phones: the big one on top and
 * the others two by two. Each photo has a frosted place label over a soft
 * fade. On hover the photo zooms and warms with a red wash, a red line
 * sweeps along its bottom, the label turns red and lifts, the offset block
 * shifts, and the other photos dim to grey. Corners use a 5px radius.
 */
export function AboutPhoto() {
  return (
    <section
      aria-label="Follow The Money in communities"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 -z-10 size-[9rem] rotate-180 opacity-60 sm:size-[20rem] sm:opacity-70"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-[9rem] -rotate-90 opacity-60 sm:size-[20rem] sm:opacity-70"
      />

      <Container className="pb-14 sm:pb-16 lg:max-w-[80rem] lg:pb-24">
        <ul className="grid auto-rows-[5.5rem] grid-cols-2 gap-3 sm:auto-rows-[7rem] sm:gap-4 lg:auto-rows-[5.25rem] lg:grid-cols-12 lg:grid-flow-dense lg:gap-4 [&:has(>li:hover)>li:not(:hover)]:opacity-55 [&:has(>li:hover)>li:not(:hover)_img]:grayscale">
          {photos.map((p) => (
            <li
              key={p.src}
              className={cn(
                "group relative transition-opacity duration-500 ease-out",
                p.area,
                // The big photo sits on the red offset block
                p.big && "mr-3 mb-4 sm:mr-4 sm:mb-5",
              )}
            >
              {p.big && (
                <span
                  aria-hidden
                  className="absolute inset-0 top-4 left-3 -right-3 -bottom-4 -z-10 rounded-[0.3125rem] bg-primary-deep transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-1 sm:top-5 sm:left-4 sm:-right-4 sm:-bottom-5"
                />
              )}
              <figure
                className={cn(
                  "relative size-full overflow-hidden bg-surface-muted ring-1 ring-foreground/5 ring-inset",
                  "rounded-[0.3125rem]",
                )}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes={p.big ? "(min-width: 1024px) 38rem, 100vw" : "(min-width: 1024px) 19rem, 50vw"}
                  className="object-cover transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.09] group-hover:rotate-[0.6deg] group-hover:saturate-[1.15]"
                  style={{ objectPosition: p.pos }}
                />
                {/* Soft fade so the label reads */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(0_0_0/0.5),transparent)] transition-[height] duration-500 group-hover:h-3/4"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgb(110_0_8/0.55),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Red line that sweeps across the bottom edge */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                />
                <figcaption
                  className={cn(
                    "absolute bottom-2.5 left-2.5 inline-flex max-w-[calc(100%-1.25rem)] items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[0.6875rem] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md transition-[transform,background-color] duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:ring-transparent sm:bottom-3 sm:left-3 sm:text-xs",
                    p.big && "sm:bottom-4 sm:left-4 sm:px-3 sm:py-1.5 sm:text-[0.8125rem]",
                  )}
                >
                  <MapPin aria-hidden className="size-3 shrink-0 text-[#ff6b73] transition-colors group-hover:text-white sm:size-3.5" />
                  <span className="truncate">{p.place}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
