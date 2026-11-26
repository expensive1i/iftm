"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Fragment,
  type ReactNode,
  type JSX,
  useEffect,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

/*
 * A title or statement that GSAP writes word by word as it scrolls into
 * view, like the statement under the home page hero. Each word unfolds
 * (swings down from its top edge into focus). It plays every time it comes
 * into view, scrolling down or up, and resets once it is off screen.
 * Words are inline-block so they can turn in 3D.
 * Chips (`{ chip: "…" }`) get their soft red highlight as their words
 * arrive. Lines (`{ line: "…" }`) sit on a line of their own from sm up. With reduced motion the text is simply shown in full.
 */
export type Part = string | { chip: string } | { line: string };

/** Wrap each word in its own span, keeping the spaces between them. */
function words(text: string, key: string): ReactNode[] {
  return text.split(/(\s+)/).map((w, i) =>
    /^\s+$/.test(w) || w === "" ? (
      <Fragment key={`${key}-${i}`}>{w}</Fragment>
    ) : (
      <span key={`${key}-${i}`} data-word className="ftm-word inline-block">
        {w}
      </span>
    ),
  );
}

type Props = {
  as?: keyof JSX.IntrinsicElements;
  /** The text: one string, or strings and chips in reading order. */
  text: string | Part[];
  className?: string;
  id?: string;
  lang?: string;
};

export function WriteOn({ as = "h2", text, className, id, lang }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.written = "true";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    // Phones get a quicker, lighter version that starts as soon as the title
    // peeks in, so titles are readable straight away while scrolling.
    const phone = window.matchMedia("(max-width: 639px)").matches;
    const ctx = gsap.context(() => {
      const all = Array.from(el.querySelectorAll("[data-word]"));
      // A slow, even pace for titles on larger screens (capped at about 2.4s
      // of stagger); on phones about twice as fast.
      const step = phone
        ? Math.min(0.05, 0.9 / Math.max(all.length, 1))
        : Math.min(0.13, 2.4 / Math.max(all.length, 1));
      const tl = gsap.timeline({ paused: true });
      // Each word unfolds: it swings down from its top edge (like a card
      // folding open towards you), rises a little and comes into focus.
      tl.fromTo(
        all,
        {
          opacity: 0,
          rotationX: phone ? -60 : -88,
          yPercent: phone ? 20 : 35,
          filter: phone ? "blur(3px)" : "blur(6px)",
          transformOrigin: "50% 0%",
          transformPerspective: 700,
        },
        {
          opacity: 1,
          rotationX: 0,
          yPercent: 0,
          filter: "blur(0px)",
          duration: phone ? 0.6 : 1.3,
          stagger: step,
          ease: "power3.out",
        },
      );
      el.querySelectorAll<HTMLElement>("[data-chip]").forEach((chip) => {
        const first = chip.querySelector("[data-word]");
        const at = first ? all.indexOf(first) * step + 0.35 : 0;
        tl.fromTo(
          chip,
          { "--chip-fill": 0 },
          { "--chip-fill": 1, duration: 0.9, ease: "power2.out" },
          at,
        );
      });
      // Play every time it comes into view, scrolling down or up; reset
      // once it is fully off screen so the next pass writes it again.
      ScrollTrigger.create({
        trigger: el,
        start: phone ? "top 98%" : "top 88%",
        end: phone ? "bottom 2%" : "bottom 12%",
        onEnter: () => tl.restart(),
        onEnterBack: () => tl.restart(),
        onLeave: () => tl.pause(0),
        onLeaveBack: () => tl.pause(0),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const parts = typeof text === "string" ? [text] : text;
  const Tag = as as "h2";

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      id={id}
      lang={lang}
      className={cn("ftm-statement", className)}
    >
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{words(part, `t${i}`)}</Fragment>
        ) : "line" in part ? (
          <span key={i} className="sm:block sm:whitespace-nowrap">
            {words(part.line, `l${i}`)}
          </span>
        ) : (
          <span key={i} data-chip className="ftm-chip">
            {words(part.chip, `c${i}`)}
          </span>
        ),
      )}
    </Tag>
  );
}
