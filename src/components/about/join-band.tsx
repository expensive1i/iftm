import Image from "next/image";
import Link from "next/link";

import { WriteOn } from "@/components/ui/write-on";
import { Container } from "@/components/ui/container";

/*
 * Closing band on the About page: the call to join (from the current About
 * page) over a fixed photo, like the home page's impact band. The bottom
 * padding leaves room for the footer's app card, which overlaps it.
 */

export function JoinBand() {
  return (
    <section
      aria-labelledby="join-title"
      className="relative isolate overflow-hidden text-white"
    >
      {/* Photo held still while the page scrolls past it: the fixed layer
          is clipped to this section by clip-path, so it acts like a
          window. Served through next/image (default quality) so it loads
          the same in production as in development. */}
      <div aria-hidden className="absolute inset-0 -z-20 [clip-path:inset(0)]">
        <div className="fixed inset-0">
          <Image src="/images/about-4.jpg" alt="" fill sizes="100vw" className="object-cover object-[center_35%]" />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(20_20_20/0.92)_0%,rgb(28_28_28/0.75)_45%,rgb(110_0_8/0.45)_100%)]"
      />
      <Container className="flex flex-col gap-8 pt-14 pb-36 sm:pt-16 lg:max-w-[80rem] lg:flex-row lg:items-end lg:justify-between lg:pt-20">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase">Join the movement</p>
          <WriteOn
            id="join-title"
            className="mt-3 max-w-[26ch] [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance sm:text-[2.5rem]/[3rem] lg:text-[2.75rem]/[3.25rem]"
            text="Become a citizen evaluator or community champion."
          />
          <p className="mt-4 max-w-xl text-base/7 text-white/70">
            Young people across Africa are tracking the projects meant for their communities. Join them.
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3 sm:flex">
          <Link
            href="/register"
            className="btn-sweep inline-flex h-13 items-center justify-center rounded-[0.3125rem] bg-primary px-6 text-base font-semibold whitespace-nowrap text-primary-foreground"
          >
            Join now
          </Link>
          <Link
            href="/contact-us"
            className="btn-sweep inline-flex h-13 items-center justify-center rounded-[0.3125rem] border-white bg-white px-6 text-base font-semibold whitespace-nowrap text-foreground [--edge:#000] hover:bg-surface-muted"
          >
            Contact us
          </Link>
        </div>
      </Container>
    </section>
  );
}
