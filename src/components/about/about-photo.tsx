import Image from "next/image";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

// One large photo and four smaller ones, each from a different event.
// Field photos © CODE (many by KC Nwakalor), from CODE's Flickr.
const photos = [
  {
    src: "/images/banner-about.jpg",
    alt: "Follow The Money trackers with members of a community",
    pos: "60% 35%",
    big: true,
  },
  {
    src: "/images/community/zamfara-roofless-classroom.jpg",
    alt: "A classroom in Zamfara with no roof",
    pos: "50% 50%",
  },
  {
    src: "/images/community/kuchingoro-graduates.jpg",
    alt: "Graduates walking along a dirt road in Kuchingoro, Abuja",
    pos: "40% 45%",
  },
  {
    src: "/images/community/bagega-girl.jpg",
    alt: "A girl in Bagega, Zamfara",
    pos: "50% 35%",
  },
  {
    src: "/images/community/shikira-water-point.jpg",
    alt: "Children fetching water at a water point in Shikira, Niger State",
    pos: "30% 55%",
  },
];

/**
 * A photo grid after the intro text: a large photo on the left with four
 * smaller ones beside it (on phones, the large one on top and the rest two
 * by two). Rounded corners, even gaps, a slow zoom on hover. Brand quarter
 * gears sit in the top corners of the section.
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

      <Container className="pb-12 sm:pb-16 lg:max-w-[80rem] lg:pb-20">
        <ul className="grid auto-rows-[9rem] grid-cols-2 gap-2.5 sm:auto-rows-[12rem] sm:gap-3 lg:auto-rows-[14.5rem] lg:grid-cols-4 lg:gap-4">
          {photos.map((p) => (
            <li
              key={p.src}
              className={cn(
                "group relative overflow-hidden rounded-[0.75rem] bg-surface-muted",
                p.big && "col-span-2 row-span-2",
              )}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={p.big ? "(min-width: 1024px) 40rem, 100vw" : "(min-width: 1024px) 20rem, 50vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                style={{ objectPosition: p.pos }}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
