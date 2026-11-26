"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, type ReactNode, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/*
 * A large statement that is "written" as you scroll, the same effect as
 * the statement under the home page hero (Highlights): the whole sentence
 * is there from the start, faded; GSAP brings each word to full, tied to
 * the scroll position (scrolling back un-writes it), and each chip's
 * highlight fills in as its words arrive. With reduced motion the text is
 * simply shown in full.
 */
export type StatementPart = string | { chip: string };

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

export function ScrollStatement({
  parts,
  className,
  lang,
}: {
  parts: StatementPart[];
  className?: string;
  lang?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.written = "true";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const all = Array.from(el.querySelectorAll("[data-word]"));
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
      });
      // Every word, in reading order, goes from faded to full
      tl.to(all, { opacity: 1, stagger: 0.1, duration: 0.3, ease: "none" });
      // Each chip's highlight fills as its first word is written
      el.querySelectorAll<HTMLElement>("[data-chip]").forEach((chip) => {
        const first = chip.querySelector("[data-word]");
        const at = first ? all.indexOf(first) * 0.1 : 0;
        tl.to(chip, { "--chip-fill": 1, duration: 0.35, ease: "power1.out" }, at);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <p ref={ref} lang={lang} className={cn("ftm-statement", className)}>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{words(part, `t${i}`)}</Fragment>
        ) : (
          <span key={i} data-chip className="ftm-chip">
            {words(part.chip, `c${i}`)}
          </span>
        ),
      )}
    </p>
  );
}
