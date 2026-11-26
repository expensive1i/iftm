import Link from "next/link";

import { AboutPhotos } from "@/components/sections/about-photos";
import { Container } from "@/components/ui/container";

/*
 * A brief "How it began" (from the current ifollowthemoney.org About page).
 *
 * Left: the story told as "then and now": a short intro, then two linked
 * panels comparing 2013 (one community) with today (a movement).
 * Right: an arched photo that changes (see AboutPhotos). A large "2013"
 * fades down from the top of the section.
 */
export function About() {
  return (
    <section
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Quarter of the brand gear tucked into each top corner */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 -z-10 size-[9rem] rotate-180 opacity-60 sm:size-[22rem] sm:opacity-70"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-[9rem] -rotate-90 opacity-60 sm:size-[22rem] sm:opacity-70"
      />

      {/* "2013" across the full width at the top of the section, fading downwards */}
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 -translate-y-[6%] bg-[linear-gradient(to_bottom,rgb(28_28_28/0.075)_10%,rgb(28_28_28/0)_70%)] bg-clip-text text-center [font-family:Cambria,Georgia,serif] text-[30vw]/[0.8] font-bold tracking-[-0.02em] text-transparent select-none lg:text-[18vw]/[0.8]"
      >
        2013
      </p>

      <Container className="grid items-center gap-12 py-16 sm:py-20 lg:max-w-[80rem] lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-20">
        {/* ── Left: then and now ─────────────────────────────── */}
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
            How it began
          </p>
          <h2
            id="about-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-black sm:text-[2.5rem]/[3.125rem] lg:text-[2.5rem]/[3.125rem] xl:text-[2.75rem]/[3.375rem]"
          >
            <span className="sm:block sm:whitespace-nowrap">
              It started with one community.
            </span>{" "}
            <span className="sm:block sm:whitespace-nowrap">
              Now it’s a movement.
            </span>
          </h2>
          {/* Soft hyphens (­) let long words break so the justified
              lines stay even in every browser. */}
          <p
            lang="en"
            className="mt-6 max-w-xl text-justify text-base/[1.8rem] hyphens-manual text-muted sm:text-lg/8"
          >
            {"Citi­zens ral­lied on­line for chil­dren with lead poi­son­ing in " +
              "Ba­gega, Zam­fara, and got the aid re­leased. That cam­paign grew into " +
              "Fol­low The Money, an ini­tia­tive of Con­nected De­vel­op­ment (CODE)."}
          </p>

          {/* Then → now: two open columns split by a hairline, no boxes */}
          <div className="mt-9 grid grid-cols-2 border-t border-foreground/10 pt-6">
            <Milestone
              tag="2013 · Bagega"
              figure="$5.3M"
              text="in aid moved for 1,500+ children with lead poisoning"
            />
            <Milestone
              tag="Today · Africa"
              figure="8,298+"
              text="citizens tracking public money in 54+ countries"
              className="border-l border-foreground/10 pl-5 sm:pl-8"
            />
          </div>

          <Link
            href="/about"
            className="btn-sweep mt-9 inline-flex h-12 items-center justify-center rounded-[0.3125rem] bg-primary px-6 text-[0.9375rem] font-semibold whitespace-nowrap text-primary-foreground"
          >
            Read our story
          </Link>
        </div>

        {/* ── Right: arched photo that changes, with its dots ── */}
        <AboutPhotos />
      </Container>
    </section>
  );
}

/** One side of the then → now comparison. */
function Milestone({
  tag,
  figure,
  text,
  className,
}: {
  tag: string;
  figure: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={`pr-4 sm:pr-6 ${className ?? ""}`}>
      <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-primary uppercase">
        {tag}
      </p>
      <p className="mt-2.5 [font-family:Cambria,Georgia,serif] text-[1.875rem]/none font-medium text-black sm:text-[2.125rem]/none">
        {figure}
      </p>
      <p className="mt-2 text-[0.8125rem]/5 text-muted sm:text-sm/6">{text}</p>
    </div>
  );
}
