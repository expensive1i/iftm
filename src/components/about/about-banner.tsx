import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

/*
 * About page banner. A page-title band with a photo behind it (darkened so
 * the white breadcrumb and title read), then, on white, the wide photo on
 * the deep red offset block used across the site.
 * Copy from the current ifollowthemoney.org About page.
 */
export function AboutBanner() {
  return (
    <section aria-labelledby="about-page-title">
      {/* ── Title band with a photo background ───────────────── */}
      <div className="relative isolate overflow-hidden text-white">
        <Image
          src="/images/community/delta-village-walk.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 origin-top-left scale-[1.12] object-cover object-[center_55%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(20_20_20/0.86)_0%,rgb(28_28_28/0.7)_55%,rgb(70_0_6/0.62)_100%)]"
        />

        {/* Bottom edge fades softly into the white section below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 bg-[linear-gradient(to_bottom,transparent,white)] sm:h-24"
        />

        {/* Extra bottom space keeps every line of text clear of the fade; a
            soft shadow keeps it readable over any part of the photo. */}
        <Container className="pt-10 pb-24 [text-shadow:0_1px_14px_rgb(0_0_0/0.45)] sm:pt-14 sm:pb-28 lg:max-w-[80rem] lg:pt-16 lg:pb-32">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-white/75">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-white">
                About
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-white/70 uppercase">
                About us
              </p>
              <h1
                id="about-page-title"
                className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.5rem]/[3rem] font-medium text-balance sm:text-[3rem]/[3.625rem] lg:text-[3.25rem]/[3.875rem]"
              >
                Africa’s largest citizen‑led accountability movement.
              </h1>
            </div>
            <p
              lang="en"
              className="text-[1.0625rem]/[1.85rem] text-justify hyphens-manual text-white/85 sm:text-lg/8"
            >
              {"A net­work of jour­nal­ists, data spe­cial­ists, com­mu­nity cham­pi­ons, " +
                "an­a­lysts, legal prac­ti­tion­ers and citi­zens who pro­mote open " +
                "data and trans­par­ent gov­ern­ment."}
            </p>
          </div>
        </Container>
      </div>

      {/* ── Wide photo on the offset block ───────────────────── */}
      <div className="relative isolate overflow-hidden bg-white">
        {/* Brand quarter gears in the top corners */}
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

        <Container className="py-12 sm:py-16 lg:max-w-[80rem] lg:py-20">
          <div className="relative pr-3 pb-4 sm:pr-4 sm:pb-5">
            <div
              aria-hidden
              className="absolute inset-0 top-4 left-3 -z-10 rounded-[1rem] bg-primary-deep sm:top-5 sm:left-4"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-surface-muted sm:aspect-[16/7] lg:aspect-[21/8]">
              <Image
                src="/images/banner-about.jpg"
                alt="Follow The Money trackers with members of a community"
                fill
                sizes="(min-width: 1280px) 78rem, 100vw"
                className="object-cover object-[60%_35%]"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
