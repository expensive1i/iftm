import Link from "next/link";

import { Container } from "@/components/ui/container";

/*
 * Short full-width photo band with a fixed background: the page scrolls over
 * the photo (as on the old site's "Download App" band). It sits just above
 * the footer, so its bottom padding leaves room for the footer's app card,
 * which overlaps this band's lower edge. Copy from the current
 * ifollowthemoney.org About page. The photo goes through Next's image
 * optimiser so a large original isn't sent to the browser.
 * iOS ignores fixed backgrounds, so on phones it simply scrolls.
 */
const PHOTO = "/_next/image?url=%2Fimages%2Fbanner-home.jpeg&w=1920&q=70";

export function ImpactBand() {
  return (
    <section
      aria-labelledby="impact-title"
      className="relative isolate overflow-hidden bg-cover bg-[center_30%] text-white md:bg-fixed"
      style={{ backgroundImage: `url(${PHOTO})` }}
    >
      {/* Dark-to-deep-red wash so the text reads */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(20_20_20/0.92)_0%,rgb(28_28_28/0.75)_45%,rgb(110_0_8/0.45)_100%)]"
      />

      <Container className="flex flex-col gap-8 pt-14 pb-36 sm:pt-16 lg:max-w-[80rem] lg:flex-row lg:items-end lg:justify-between lg:pt-20 lg:pb-36">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase">
            Where the money went
          </p>
          <h2
            id="impact-title"
            className="mt-3 max-w-[24ch] [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance sm:text-[2.5rem]/[3rem] lg:text-[2.875rem]/[3.375rem]"
          >
            Schools rebuilt. Clinics restored. Water flowing again.
          </h2>
        </div>
        <Link
          href="/campaigns"
          className="btn-sweep inline-flex h-13 shrink-0 items-center self-start rounded-[0.3125rem] border-white bg-white px-7 text-base font-semibold text-foreground [--edge:#000] hover:bg-surface-muted lg:self-auto"
        >
          See the campaigns
        </Link>
      </Container>
    </section>
  );
}
