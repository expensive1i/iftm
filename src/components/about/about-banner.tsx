import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

/*
 * About page banner: breadcrumb, title and a short intro on white (so the
 * transparent header stays readable), then a wide photo on the deep red
 * offset block used across the site, with a small "10+ years" card.
 * Copy from the current ifollowthemoney.org About page.
 */
export function AboutBanner() {
  return (
    <section aria-labelledby="about-page-title" className="relative isolate overflow-hidden bg-white">
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

      <Container className="pt-10 pb-16 sm:pt-14 sm:pb-20 lg:max-w-[80rem] lg:pt-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              About
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">About us</p>
            <h1
              id="about-page-title"
              className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.5rem]/[3rem] font-medium text-balance text-black sm:text-[3rem]/[3.625rem] lg:text-[3.25rem]/[3.875rem]"
            >
              Africa’s largest citizen‑led accountability movement.
            </h1>
          </div>
          <p lang="en" className="text-[1.0625rem]/[1.85rem] text-justify hyphens-manual text-muted sm:text-lg/8">
            {"A net­work of jour­nal­ists, data spe­cial­ists, com­mu­nity cham­pi­ons, " +
              "an­a­lysts, legal prac­ti­tion­ers and citi­zens who pro­mote open " +
              "data and trans­par­ent gov­ern­ment."}
          </p>
        </div>

        {/* Wide photo on the offset block */}
        <div className="relative mt-12 pr-3 pb-4 sm:mt-14 sm:pr-4 sm:pb-5">
          <div
            aria-hidden
            className="absolute inset-0 top-4 left-3 -z-10 rounded-[1rem] bg-primary-deep sm:top-5 sm:left-4"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-surface-muted sm:aspect-[16/7] lg:aspect-[21/8]">
            <Image
              src="/images/banner-about.jpg"
              alt="Follow The Money trackers with members of a community"
              fill
              priority
              sizes="(min-width: 1280px) 78rem, 100vw"
              className="object-cover object-[60%_35%]"
            />
          </div>

          {/* Small figure card over the lower left of the photo */}
          <div className="absolute bottom-0 left-4 rounded-[0.625rem] border border-foreground/10 bg-white px-5 py-4 shadow-[5px_6px_0_var(--foreground)] sm:left-8 sm:px-6 sm:py-5">
            <p className="[font-family:Cambria,Georgia,serif] text-[2rem]/none font-medium text-black sm:text-[2.5rem]/none">
              10+
            </p>
            <p className="mt-1.5 max-w-[12rem] text-[0.8125rem]/5 text-muted sm:text-sm">
              years tracking public money and transparency
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
