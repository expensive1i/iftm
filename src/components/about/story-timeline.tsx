"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { WriteOn } from "@/components/ui/write-on";

// From the current ifollowthemoney.org About page.
// Field photos © CODE (many by KC Nwakalor), from CODE's Flickr.
const steps = [
  {
    when: "2012",
    title: "CODE is founded",
    text: "Connected Development (CODE) starts as a non-governmental organisation to help marginalised communities be heard and hold government to account.",
    photo: "/images/community/kaduna-advocates-meeting.jpg",
    alt: "Advocates meeting in Kaduna",
  },
  {
    when: "2013",
    title: "Follow The Money begins in Bagega",
    text: "Over 1,500 children were dying of lead poisoning in Bagega, a far-to-reach community in Zamfara, Northern Nigeria.",
    more: "Using Twitter and Facebook, Follow The Money mobilised Nigerians and the international community to demand justice for them. The outcry sped up the release of $5.3 million by the Nigerian Government and international aid for the children’s treatment and the remediation of Bagega.",
    photo: "/images/community/bagega-well.jpg",
    alt: "A well in Bagega, Zamfara",
  },
  {
    when: "Since",
    title: "Projects back on track",
    text: "Bagega showed that our collective voices can speed up social change.",
    more: "Since then, essential public projects that were abandoned, or might never have been built, have been restarted and completed: schools built or renovated, primary health centres rehabilitated and refurbished, and water, sanitation and hygiene (WASH) facilities installed.",
    photo: "/images/community/niger-site-visit.jpg",
    alt: "Trackers on a project site visit in Niger State",
  },
  {
    when: "Today",
    title: "A movement across Africa",
    text: "$13.5 million in government projects tracked across 371 grassroots communities, and ₦447 million saved from financial leakages.",
    photo: "/images/community/kano-young-trackers.jpg",
    alt: "Young trackers in Kano",
  },
];

/**
 * The story as a timeline. On large screens the heading stays in view on
 * the left while the steps run down on the right.
 * As you scroll, a red line fills down from step to step (GSAP, tied to
 * the scroll position), and each step lights up as you reach it: its dot
 * fills, its year turns red and its photo goes from grey to colour.
 * Scrolling back up reverses it. No hover effects. Long steps show their
 * first sentence with a "Read more" toggle that opens the rest; after it
 * opens or closes, the scroll positions are measured again. With reduced motion
 * every step is shown lit, with the line full.
 */
export function StoryTimeline() {
  const list = useRef<HTMLOListElement>(null);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setOpen((o) => ({ ...o, [i]: !o[i] }));
    // Re-measure once the open/close transition has finished
    window.setTimeout(() => ScrollTrigger.refresh(), 450);
  }

  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const items = Array.from(ol.querySelectorAll<HTMLElement>("[data-step]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((li) => li.classList.add("is-active"));
      gsap.set(ol.querySelectorAll("[data-fill]"), { scaleY: 1 });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      items.forEach((li) => {
        ScrollTrigger.create({
          trigger: li,
          start: "top 65%",
          toggleClass: { targets: li, className: "is-active" },
          end: "max",
        });
        const fill = li.querySelector("[data-fill]");
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: li,
                start: "top 65%",
                end: "bottom 65%",
                scrub: 0.4,
              },
            },
          );
        }
      });
    }, ol);
    return () => ctx.revert();
  }, []);

  return (
    <section
      aria-labelledby="story-title"
      className="relative isolate overflow-hidden border-y border-foreground/[0.06] bg-[#FCFCFB]"
    >
      {/* Quarter of the brand gear in the top-right and bottom-left corners */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 size-[9rem] -rotate-90 opacity-60 sm:size-[20rem] sm:opacity-70"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 -z-10 size-[9rem] rotate-90 opacity-60 sm:size-[20rem] sm:opacity-70"
      />
      <Container className="grid gap-12 py-20 sm:py-24 lg:max-w-[80rem] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Our story</p>
          <WriteOn
            id="story-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
            text="From one campaign to a movement."
          />
          <p className="mt-6 max-w-md text-base/[1.8rem] text-muted sm:text-lg/8">
            How a campaign for the children of Bagega became more than ten years of tracking public money.
          </p>
        </div>

        <ol ref={list}>
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            return (
              <li
                key={s.title}
                data-step
                className="group/step grid grid-cols-[4.25rem_1fr] sm:grid-cols-[6rem_1fr]"
              >
                <p className="pt-0.5 [font-family:Cambria,Georgia,serif] text-[1.375rem]/none font-medium text-foreground/25 transition-colors duration-500 group-[.is-active]/step:text-primary sm:text-[1.75rem]/none">
                  {s.when}
                </p>

                <div className={`relative pl-6 sm:pl-8 ${last ? "" : "pb-12 sm:pb-14"}`}>
                  {/* The line down to the next step: a faint track, and a
                      red fill that grows with the scroll */}
                  {!last && (
                    <>
                      <span aria-hidden className="absolute top-2 -bottom-2 left-0 w-px bg-foreground/10" />
                      <span
                        aria-hidden
                        data-fill
                        className="absolute top-2 -bottom-2 left-0 w-px origin-top scale-y-0 bg-primary"
                      />
                    </>
                  )}
                  {/* The dot: an outline that fills red when reached */}
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[5.5px] size-[11px] rounded-full border border-foreground/25 bg-[#FCFCFB] ring-4 ring-[#FCFCFB] transition-colors duration-500 group-[.is-active]/step:border-primary group-[.is-active]/step:bg-primary"
                  />

                  <div className="sm:flex sm:items-start sm:gap-7">
                    <div className="flex-1">
                      <h3 className="[font-family:Cambria,Georgia,serif] text-[1.375rem]/tight font-medium text-black sm:text-[1.5rem]/tight">
                        {s.title}
                      </h3>
                      <p className="mt-2.5 max-w-xl text-[0.9375rem]/7 text-muted sm:text-base/7">{s.text}</p>
                      {s.more && (
                        <>
                          <div
                            id={`story-more-${i}`}
                            aria-hidden={!open[i]}
                            className={`grid transition-[grid-template-rows] duration-400 ease-out ${open[i] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                          >
                            <div className="overflow-hidden">
                              <p className="mt-2 max-w-xl text-[0.9375rem]/7 text-muted sm:text-base/7">{s.more}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-expanded={!!open[i]}
                            aria-controls={`story-more-${i}`}
                            onClick={() => toggle(i)}
                            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                          >
                            {open[i] ? "Show less" : "Read more"}
                            <ChevronDown
                              aria-hidden
                              className={`size-4 transition-transform duration-300 ${open[i] ? "rotate-180" : ""}`}
                            />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="relative mt-4 aspect-[16/10] w-full max-w-[18rem] shrink-0 overflow-hidden rounded-[0.3125rem] bg-surface-muted sm:mt-1 sm:w-36 lg:w-40">
                      <Image
                        src={s.photo}
                        alt={s.alt}
                        fill
                        sizes="(min-width: 640px) 10rem, 18rem"
                        className="object-cover opacity-70 grayscale transition-[filter,opacity] duration-700 group-[.is-active]/step:opacity-100 group-[.is-active]/step:grayscale-0"
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
