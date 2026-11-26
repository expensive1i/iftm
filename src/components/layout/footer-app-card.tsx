import { Laptop } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { GooglePlayIcon } from "@/components/brand/google-play-icon";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

// Photos for the round collage at the card's right edge.
const PHOTOS = [
  { src: "/images/about-2.jpg", pos: "58% 30%" },
  { src: "/images/banner-about.jpg", pos: "75% 30%" },
  { src: "/images/about-1.jpg", pos: "72% 30%" },
  { src: "/images/banner-home.jpeg", pos: "50% 30%" },
  { src: "/images/about-3.jpg", pos: "35% 40%" },
  { src: "/images/about-4.jpg", pos: "58% 38%" },
  { src: "/images/campaign-kakulu.jpg", pos: "45% 55%" },
];

// Shared by both store-style buttons: one line each on phones, two-line
// labels with a fixed minimum width from sm up so the text never wraps.
const BTN =
  "btn-sweep inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[0.3125rem] px-3 whitespace-nowrap sm:h-13 sm:min-w-[11.5rem] sm:flex-none sm:shrink-0 sm:justify-start sm:gap-3 sm:pr-6 sm:pl-4";
const SMALL = "hidden text-[0.625rem] font-semibold tracking-[0.12em] uppercase sm:block";
const BIG = "block text-[0.9375rem] font-semibold sm:mt-1 sm:text-[1.0625rem]";

/**
 * Red "Get the app" card, pulled up so half of it overlaps the section
 * above the footer. A small diamond collage peeks in from the right on
 * wider screens.
 */
export function FooterAppCard() {
  return (
    <Container className="relative -mt-[6rem] lg:max-w-[88rem]">
      <div className="relative isolate overflow-hidden rounded-[0.5rem] bg-primary-deep px-5 py-6 sm:px-10 sm:py-9 lg:px-12 lg:py-10">
        {/* Faint dot texture, brighter toward the photos */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[url(/brand/pattern-dots.svg)] bg-size-[1.5rem] opacity-20 invert [mask-image:linear-gradient(to_left,black,transparent_70%)]"
        />

        <AppCollage />

        <div className="max-w-[34rem] md:max-w-[58%] lg:max-w-[50%]">
          <p className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
            Get the app
          </p>
          <h2 className="mt-3 [font-family:Cambria,Georgia,serif] text-[1.5rem]/[1.9rem] font-medium text-balance sm:text-[2rem]/[2.5rem] lg:text-[2.25rem]/[2.75rem]">
            Follow the money from your phone.
          </h2>
          <p className="mt-2 hidden text-[0.9375rem]/6 text-white/70 sm:block">
            Report on projects in your community, follow campaigns and share
            what you find, wherever you are.
          </p>
          <div className="mt-5 flex gap-2.5 sm:mt-6 sm:flex-wrap sm:gap-3">
            <a
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN} border-white bg-white text-foreground [--edge:#2a0003] hover:bg-surface-muted`}
            >
              <GooglePlayIcon className="size-6" />
              <span className="text-left leading-none">
                <span className={`${SMALL} text-muted`}>Get it on</span>
                <span className={BIG}>Google Play</span>
              </span>
            </a>
            <Link
              href="/login"
              className={`${BTN} border-[#0c0c0c] bg-[#0c0c0c] text-white [--edge:#000] hover:bg-[#1c1c1c]`}
            >
              <Laptop aria-hidden className="size-6 text-white/85" />
              <span className="text-left leading-none">
                <span className={`${SMALL} text-white/55`}>Or log in</span>
                <span className={BIG}>On the web</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}

/**
 * A 3×3 cluster of round photos peeking in from the right (md and up), in
 * the same spot the first collage used. The middle column sits half a
 * step lower, and the centre circle carries the gear mark on red.
 */
function AppCollage() {
  return (
    <div
      aria-hidden
      className="absolute top-1/2 right-[-3.5rem] -z-10 hidden -translate-y-1/2 grid-cols-3 gap-3 md:grid"
    >
      {[0, 1, 2].map((col) => (
        <div key={col} className={`flex flex-col gap-3 ${col === 1 ? "translate-y-[2.3rem] lg:translate-y-[2.8rem]" : ""}`}>
          {[0, 1, 2].map((row) => {
            const i = col * 3 + row;
            const p = PHOTOS[(i * 3) % PHOTOS.length];
            const centre = col === 1 && row === 1;
            return (
              <div
                key={row}
                className={`relative size-[4.25rem] overflow-hidden rounded-full lg:size-[5.25rem] ${centre ? "grid place-items-center bg-primary" : "bg-black/30 ring-2 ring-white/10"}`}
              >
                {centre ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/brand/motif-gear-red.svg" alt="" className="size-[62%] brightness-0 invert" />
                ) : (
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                    style={{ objectPosition: p.pos }}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
