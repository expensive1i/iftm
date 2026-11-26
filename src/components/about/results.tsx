"use client";

import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Container } from "@/components/ui/container";
import { WriteOn } from "@/components/ui/write-on";

/*
 * What tracking has helped deliver. Facts from the current About page,
 * in plain words. Each card has three photos: one large, two small.
 * Field photos © CODE (many by KC Nwakalor), from CODE's Flickr.
 */
const C = "/images/community";
const results = [
  {
    title: "Schools",
    text: "Classrooms that were left half-built are now finished, so children can learn in them.",
    photos: [
      { src: `${C}/zamfara-schoolchildren.jpg`, pos: "55% 70%" },
      { src: `${C}/bauchi-tirum-schoolgirls.jpg`, pos: "50% 30%" },
      { src: `${C}/bauchi-schoolgirls.jpg`, pos: "50% 30%" },
    ],
  },
  {
    title: "Health centres",
    text: "Local clinics repaired and equipped, so care is close to the people it was meant for.",
    photos: [
      { src: "/images/about-3.jpg", pos: "35% 40%" },
      { src: `${C}/phc-schedule-check.jpg`, pos: "40% 40%" },
      { src: "/images/about-2.jpg", pos: "50% 40%" },
    ],
  },
  {
    title: "Clean water and toilets",
    text: "Boreholes, toilets and handwashing points put in where communities were promised them.",
    photos: [
      { src: "/images/campaign-kakulu.jpg", pos: "45% 55%" },
      { src: `${C}/shikira-water-point.jpg`, pos: "30% 55%" },
      { src: `${C}/shikira-portrait.jpg`, pos: "50% 35%" },
    ],
  },
  {
    title: "Help for Bagega",
    text: "$5.3 million released to treat children with lead poisoning in Bagega and clean up the village.",
    photos: [
      { src: `${C}/bagega-girl.jpg`, pos: "50% 35%" },
      { src: `${C}/bagega-well.jpg`, pos: "50% 50%" },
      { src: `${C}/village-women.jpg`, pos: "50% 35%" },
    ],
  },
  {
    title: "Money saved",
    text: "₦447 million of public money kept from being lost or wasted on government projects.",
    photos: [
      { src: `${C}/site-inspection-elders.jpg`, pos: "50% 40%" },
      { src: `${C}/niger-site-workers.jpg`, pos: "50% 45%" },
      { src: `${C}/tracker-field.jpg`, pos: "50% 35%" },
    ],
  },
  {
    title: "Projects checked on the ground",
    text: "$13.5 million of government projects checked in 371 communities, by the people who live there.",
    photos: [
      { src: `${C}/kano-tracker.jpg`, pos: "50% 35%" },
      { src: `${C}/lagos-tracker-resident.jpg`, pos: "50% 35%" },
      { src: `${C}/monitoring-team-training.jpg`, pos: "50% 40%" },
    ],
  },
];

/**
 * The results as a marquee: the cards glide steadily to the left on their
 * own, in an endless loop (the list is drawn twice, the second copy hidden
 * from screen readers). It never stops and starts again: hovering does not
 * pause it, and the arrows add a smooth one-card push on top of the glide.
 * The only time it holds still is while a finger or mouse is dragging it;
 * when let go it carries on at once, with a little momentum from the drag.
 * With reduced motion it does not move on its own, but the arrows and
 * dragging still work. The first card starts in line with the title.
 */
export function Results() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const api = useRef<{ step: (dir: 1 | -1) => void } | null>(null);

  useEffect(() => {
    const vp = viewport.current;
    const ul = track.current;
    if (!vp || !ul) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pos = 0;
    let dragging = false;

    const first = () => ul.children[0] as HTMLElement;
    // Width of one copy of the list (first card to first card of the copy)
    const loopWidth = () =>
      (ul.children[results.length] as HTMLElement).offsetLeft - first().offsetLeft;
    const cardStep = () => (ul.children[1] as HTMLElement).offsetLeft - first().offsetLeft;
    // Gliding speed in px/s: a little slower on small screens
    const cruise = () => (window.innerWidth < 640 ? 26 : 38);

    const apply = () => {
      const w = loopWidth();
      // Keep pos within (-w, 0] so the loop never shows a gap or a jump
      pos = ((pos % w) - w) % w;
      ul.style.transform = `translate3d(${pos}px,0,0)`;
    };

    // The steady glide
    const tick = (_t: number, dtMs: number) => {
      if (reduce || dragging) return;
      pos -= (cruise() * Math.min(dtMs, 64)) / 1000;
      apply();
    };
    gsap.ticker.add(tick);
    apply();

    // A smooth push of `by` px laid on top of the glide (the glide keeps
    // running underneath, so nothing stops)
    const pushes = new Set<gsap.core.Tween>();
    const push = (by: number, duration: number) => {
      const o = { v: 0 };
      let prev = 0;
      const t = gsap.to(o, {
        v: by,
        duration,
        ease: "power3.out",
        onUpdate: () => {
          pos += o.v - prev;
          prev = o.v;
          apply();
        },
        onComplete: () => {
          pushes.delete(t);
        },
      });
      pushes.add(t);
    };
    const stopPushes = () => {
      pushes.forEach((t) => t.kill());
      pushes.clear();
    };

    api.current = {
      step(dir) {
        push(-dir * cardStep(), 0.9);
      },
    };

    // Drag to move; when let go it glides on with the drag's momentum
    let lastX = 0;
    let lastT = 0;
    let dragV = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      stopPushes();
      lastX = e.clientX;
      lastT = performance.now();
      dragV = 0;
      vp.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastT) / 1000;
      dragV = dragV * 0.6 + (dx / dt) * 0.4;
      lastX = e.clientX;
      lastT = now;
      pos += dx;
      apply();
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId);
      const fling = Math.max(-2400, Math.min(2400, dragV));
      if (Math.abs(fling) > 60) push(fling * 0.35, 1);
    };

    vp.addEventListener("pointerdown", down);
    vp.addEventListener("pointermove", move);
    vp.addEventListener("pointerup", up);
    vp.addEventListener("pointercancel", up);
    window.addEventListener("resize", apply);

    return () => {
      gsap.ticker.remove(tick);
      stopPushes();
      vp.removeEventListener("pointerdown", down);
      vp.removeEventListener("pointermove", move);
      vp.removeEventListener("pointerup", up);
      vp.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", apply);
      api.current = null;
    };
  }, []);

  return (
    <section aria-labelledby="results-title" className="overflow-hidden bg-white">
      <Container className="pt-16 sm:pt-24 lg:max-w-[80rem] lg:pt-28">
        <div className="grid gap-x-12 gap-y-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Results</p>
            <WriteOn
              id="results-title"
              className="mt-3 [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance text-black sm:mt-4 sm:text-[2.75rem]/[3.375rem]"
              text="Unfinished projects, now completed."
            />
            <p className="mt-4 max-w-xl text-base/7 text-muted sm:mt-5 sm:text-lg/8">
              When citizens keep track of public money, projects that were left unfinished get
              restarted and completed. Here is what that has changed.
            </p>
          </div>

          {/* Arrows: under the text on phones, at the right from md up */}
          <div className="flex items-center gap-2.5">
            {(
              [
                [-1, "Previous", ChevronLeft],
                [1, "Next", ChevronRight],
              ] as const
            ).map(([dir, label, Icon]) => (
              <button
                key={label}
                type="button"
                aria-label={`${label} result`}
                onClick={() => api.current?.step(dir)}
                className="grid size-11 place-items-center rounded-full border border-foreground/15 bg-white text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-white sm:size-12"
              >
                <Icon aria-hidden className="size-5" />
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* The moving strip runs the full width of the page; its left padding
          lines the first card up with the title (the Container's edge). */}
      <div
        ref={viewport}
        className="mt-8 cursor-grab touch-pan-y pb-16 select-none active:cursor-grabbing sm:mt-12 sm:pb-24 lg:pb-28"
      >
        <ul
          ref={track}
          aria-label="Results"
          className="flex w-max gap-4 pl-4 will-change-transform sm:gap-5 sm:pl-6 lg:gap-6 lg:pl-[calc(max(0px,(100%-80rem)/2)+2rem)]"
        >
          {[...results, ...results].map((r, i) => {
            const copy = i >= results.length;
            return (
              <li
                key={`${r.title}-${i}`}
                aria-hidden={copy || undefined}
                inert={copy || undefined}
                className="flex w-[17.5rem] shrink-0 flex-col pr-1.5 pb-2 sm:w-[21rem] lg:w-[23.5rem]"
              >
                {/* Three photos: one large on the left, two stacked */}
                <div className="grid aspect-[5/4] grid-cols-3 grid-rows-2 gap-1 overflow-hidden rounded-[0.75rem] bg-surface-muted">
                  {r.photos.map((p, k) => (
                    <div key={p.src} className={`relative ${k === 0 ? "col-span-2 row-span-2" : ""}`}>
                      <Image
                        src={p.src}
                        alt=""
                        fill
                        draggable={false}
                        sizes={k === 0 ? "(min-width: 1024px) 16rem, 12rem" : "(min-width: 1024px) 8rem, 6rem"}
                        className="object-cover"
                        style={{ objectPosition: p.pos }}
                      />
                    </div>
                  ))}
                </div>
                <div className="relative z-10 mx-2.5 -mt-12 flex-1 rounded-[0.625rem] border border-foreground/10 bg-white px-5 pt-4 pb-5 shadow-[5px_6px_0_var(--foreground)] sm:-mt-14 sm:pt-5">
                  <h3 className="[font-family:Cambria,Georgia,serif] text-[1.1875rem]/tight font-medium text-black sm:text-[1.25rem]/tight">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm/6 text-muted">{r.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
