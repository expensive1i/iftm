"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, type ReactNode, useEffect, useRef } from "react";

import { Container } from "@/components/ui/container";

/*
 * One large statement under the hero, with the key facts picked out as
 * highlighted chips. Figures are the ones published on the current
 * ifollowthemoney.org home page.
 *
 * The whole sentence is there from the start, faded. As you scroll, GSAP
 * "writes" it word by word (tied to the scroll position, so scrolling back
 * un-writes it), and each chip's highlight fills in as its words arrive.
 * With reduced motion the text is simply shown in full.
 */
type Part = string | { chip: string };

const statement: Part[] = [
  "Pick a ",
  { chip: "project" },
  " in your com­mu­nity, follow the ",
  { chip: "money behind it" },
  ", and report what was ",
  { chip: "really de­liv­ered" },
  ". Join ",
  { chip: "8,298+ citi­zens" },
  " doing it across ",
  { chip: "54+ coun­tries" },
  ".",
];

/** Wrap each word in its own span, keeping the spaces between them. */
function words(text: string, key: string): ReactNode[] {
  return text.split(/(\s+)/).map((w, i) =>
    /^\s+$/.test(w) || w === "" ? (
      <Fragment key={`${key}-${i}`}>{w}</Fragment>
    ) : (
      <span key={`${key}-${i}`} data-word className="ftm-word">
        {w}
      </span>
    ),
  );
}

export function Highlights() {
  const text = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = text.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.written = "true";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });
      // Every word, in reading order, goes from faded to full.
      tl.to(el.querySelectorAll("[data-word]"), {
        opacity: 1,
        stagger: 0.1,
        duration: 0.3,
        ease: "none",
      });
      // Each chip's highlight fills as its first word is written.
      el.querySelectorAll<HTMLElement>("[data-chip]").forEach((chip) => {
        const first = chip.querySelector("[data-word]");
        const at = first ? indexTime(el, first) : 0;
        tl.to(chip, { "--chip-fill": 1, duration: 0.35, ease: "power1.out" }, at);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-label="iFollowTheMoney in numbers"
      className="relative isolate overflow-hidden border-y border-foreground/[0.06] bg-[#FCFCFB]"
    >
      {/* Quarter of the brand gear in the top-left and bottom-right corners */}
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
        className="pointer-events-none absolute right-0 bottom-0 -z-10 size-[9rem] opacity-60 sm:size-[22rem] sm:opacity-70"
      />
      <Container className="py-20 sm:py-28 lg:max-w-[80rem] lg:py-36">
        <p
          ref={text}
          lang="en"
          className="ftm-statement [font-family:Cambria,Georgia,serif] text-[1.375rem]/[2.35rem] font-medium text-pretty text-black max-sm:text-justify max-sm:hyphens-manual sm:text-[2.125rem]/[3.5rem] lg:text-[2.75rem]/[4.5rem]"
        >
          {statement.map((part, i) =>
            typeof part === "string" ? (
              <Fragment key={i}>{words(part, `t${i}`)}</Fragment>
            ) : (
              <span key={i} data-chip className="ftm-chip">
                {words(part.chip, `c${i}`)}
              </span>
            ),
          )}
        </p>
      </Container>
    </section>
  );
}

/** Timeline time at which `word` starts (matches the 0.1 stagger above). */
function indexTime(root: HTMLElement, word: Element) {
  const all = Array.from(root.querySelectorAll("[data-word]"));
  return all.indexOf(word) * 0.1;
}
