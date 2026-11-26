import { Laptop } from "lucide-react";
import Link from "next/link";

import { GooglePlayIcon } from "@/components/brand/google-play-icon";
import { OrbitDots } from "@/components/brand/orbit-dots";
import { HeroGallery } from "@/components/sections/hero-gallery";
import { RotatingHeadline } from "@/components/sections/rotating-headline";
import { Container } from "@/components/ui/container";
import { authNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/*
 * White hero. On large screens it slides up under the transparent main
 * nav, and the diamond collage fills everything right of a diagonal
 * (see LINE in hero-gallery). The text side carries pieces of the brand
 * kit: a soft dot grid, the logo's three orbit dots, and the outline
 * gear ring peeking in from the left edge.
 * On phones the collage is a band below the text.
 */
// The hero headline cycles through these, like the collage photos.
const headlines = [
  "Make public funds work for the public.",
  "Follow the money behind every school.",
  "Every promised road should be built.",
  "Track the aid meant for your community.",
  "Hold every budget line to account.",
];

export function Hero() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-white lg:-mt-[5.5rem] lg:min-h-[max(45rem,calc(100svh-2.5rem))] lg:flex-row lg:items-center">
      {/* Dot grid from the brand kit, in the bottom-left corner with the gear */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-full bg-[url(/brand/pattern-dots.svg)] bg-size-[1.75rem] [mask-image:radial-gradient(circle_at_0%_100%,black,transparent_70%)] lg:w-[45%]"
      />

      {/* Soft filled gear from the brand kit (as in bg-light.svg), in the bottom-left corner */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/motif-gear-red.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-[13rem] -left-[15rem] -z-10 hidden size-[34rem] opacity-[0.08] lg:block"
      />

      <HeroGallery
        tileClass="size-[6rem] sm:size-[6.875rem] lg:size-[8.75rem]"
        gapClass="gap-1.5 lg:gap-2.5"
        className="relative order-2 mb-10 h-72 sm:h-80 lg:absolute lg:inset-0 lg:order-none lg:mb-0 lg:h-auto"
      />
      {/* White fade along the top right so every nav link and button reads clearly */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 hidden h-[17rem] w-[62%] bg-[linear-gradient(to_bottom,rgb(255_255_255/0.8)_0%,rgb(255_255_255/0.72)_40%,rgb(255_255_255/0.3)_70%,transparent_100%)] [mask-image:linear-gradient(to_left,black_78%,transparent)] lg:block"
      />

      <Container className="relative order-1 py-12 sm:py-16 lg:order-none lg:max-w-[80rem] lg:pt-36 lg:pb-20">
        <div className="lg:max-w-[52%]">
          <p className="ftm-rise flex items-center gap-2.5 text-[0.9375rem] font-semibold text-foreground sm:gap-3 sm:text-base">
            <OrbitDots className="size-7 sm:size-9" />
            Welcome to {siteConfig.name}
          </p>
          <RotatingHeadline
            lines={headlines}
            className="ftm-rise mt-5 [animation-delay:90ms] [font-family:Cambria,Georgia,serif] text-[2.75rem]/[3.25rem] font-medium text-balance text-black sm:text-[3.375rem]/[4rem] lg:text-[clamp(2.75rem,4.3vw,3.875rem)]/[1.17]"
          />
          {/* Justified; soft hyphens let long words break so the lines stay even */}
          <p lang="en" className="ftm-rise mt-6 max-w-xl [animation-delay:180ms] text-[1.125rem]/[1.9rem] text-justify hyphens-manual text-muted sm:text-[1.25rem]/[2rem]">
            {"A net­work of grass­roots citi­zens ded­i­cated to track­ing gov­ern­ment " +
              "and in­ter­na­tional aid spend­ing in their own com­mu­ni­ties."}
          </p>
          <div className="ftm-rise mt-9 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap [animation-delay:270ms]">
            {/* Phones: log in on the web; larger screens: start a campaign */}
            <Link
              href={authNav.login.href}
              className="btn-sweep inline-flex h-12 items-center justify-center gap-2 rounded-[0.3125rem] bg-primary px-3 text-[0.9375rem] font-semibold whitespace-nowrap text-primary-foreground sm:hidden"
            >
              <Laptop aria-hidden className="size-[1.125rem]" />
              Log in on web
            </Link>
            <Link
              href="/campaigns/create"
              className="hidden sm:inline-flex h-12 items-center justify-center whitespace-nowrap sm:h-14 rounded-[0.3125rem] btn-sweep bg-primary px-3 text-[0.9375rem] sm:px-8 sm:text-[1.0625rem] font-semibold text-primary-foreground"
            >
              Start a campaign
            </Link>
            <Link
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap sm:h-14 rounded-[0.3125rem] btn-sweep btn-sweep-invert border border-foreground/25 bg-white gap-2.5 px-3 text-[0.9375rem] sm:px-7 sm:text-[1.0625rem] font-semibold text-foreground"
            >
              <GooglePlayIcon />
              <span className="sm:hidden">Get the app</span>
              <span className="hidden sm:inline">Download the app</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
