import Image from "next/image";

import { Container } from "@/components/ui/container";

// What tracking has helped deliver (from the current About page).
const results = [
  {
    title: "Schools",
    text: "Classrooms that were abandoned half-built, finished so children can learn in them.",
    image: "/images/about-1.jpg",
    pos: "72% 30%",
  },
  {
    title: "Primary health centres",
    text: "Clinics restarted and completed, so care is closer to the people it was meant for.",
    image: "/images/about-3.jpg",
    pos: "35% 40%",
  },
  {
    title: "Water, sanitation and hygiene",
    text: "Boreholes, toilets and WASH facilities completed in communities that were promised them.",
    image: "/images/campaign-kakulu.jpg",
    pos: "45% 55%",
  },
];

/**
 * Three results, styled like the campaign cards: a rounded photo with a
 * white panel overlapping its lower edge on a solid offset block.
 */
export function Results() {
  return (
    <section aria-labelledby="results-title" className="bg-white">
      <Container className="py-20 sm:py-24 lg:max-w-[80rem] lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">Results</p>
          <h2
            id="results-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
          >
            Stalled projects, finished.
          </h2>
          <p className="mt-5 text-base/[1.8rem] text-muted sm:text-lg/8">
            When citizens follow the money, abandoned public projects get restarted and completed.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {results.map((r) => (
            <li key={r.title} className="group flex flex-col pr-1.5 pb-2">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[0.75rem] bg-surface-muted">
                <Image
                  src={r.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: r.pos }}
                />
              </div>
              <div className="relative z-10 mx-2.5 -mt-14 flex-1 rounded-[0.625rem] border border-foreground/10 bg-white px-5 pt-5 pb-5 shadow-[5px_6px_0_var(--foreground)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[6px_9px_0_var(--primary-deep)]">
                <h3 className="[font-family:Cambria,Georgia,serif] text-[1.25rem]/tight font-medium text-black">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm/6 text-muted">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
