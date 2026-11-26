import Image from "next/image";

import {
  AnalystArt,
  ChampionArt,
  CitizenArt,
  DataArt,
  JournalistArt,
  LegalArt,
} from "@/components/about/role-illustrations";
import { WriteOn } from "@/components/ui/write-on";
import { Container } from "@/components/ui/container";

// The people who make up the network (from the current About page).
const roles = [
  {
    art: JournalistArt,
    title: "Journalists",
    text: "Report what was promised and what was delivered.",
  },
  {
    art: DataArt,
    title: "Data specialists",
    text: "Turn budgets and spending into open, usable data.",
  },
  {
    art: ChampionArt,
    title: "Community champions",
    text: "Lead tracking on the ground in their own communities.",
  },
  {
    art: AnalystArt,
    title: "Analysts",
    text: "Study the numbers behind public projects.",
  },
  {
    art: LegalArt,
    title: "Legal practitioners",
    text: "Use the law to press for answers.",
  },
  {
    art: CitizenArt,
    title: "Citizens",
    text: "Ask questions and share what they see.",
  },
];

/**
 * Who we are: a heading row (title left, statement right), then the six
 * kinds of people in the network as cards, each with its own custom
 * illustration (see role-illustrations.tsx), all over a still photo of a
 * community group that the page scrolls past.
 * The cards are compact rows (illustration left, text right), one, two then
 * three across, kept short so the photo shows around them. No hover
 * effects: the cards stay still.
 */
export function WhoWeAre() {
  return (
    <section
      aria-labelledby="who-title"
      className="relative isolate overflow-hidden text-white"
    >
      {/* Photo held still while the page scrolls past it (as on the home
          page's photo band): a fixed layer clipped to this section. */}
      <div aria-hidden className="absolute inset-0 -z-20 [clip-path:inset(0)]">
        <div className="fixed inset-0">
          <Image
            src="/images/community/jos-community-group.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[center_45%]"
          />
        </div>
      </div>
      {/* Dark wash so the white text reads, warming to deep red on the right */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(20_20_20/0.9)_0%,rgb(28_28_28/0.8)_45%,rgb(110_0_8/0.6)_100%)]"
      />

      <Container className="py-16 sm:py-20 lg:max-w-[80rem] lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-white/60 uppercase">
              <span aria-hidden className="h-px w-8 bg-primary" />
              Who we are
            </p>
            <WriteOn
              id="who-title"
              className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-white sm:text-[2.75rem]/[3.375rem]"
              text="People who follow the money, together."
            />
          </div>
          <p
            lang="en"
            className="max-w-xl text-justify text-base/[1.8rem] hyphens-manual text-white/75 sm:text-lg/8"
          >
            {"Fol­low The Money is a so­cio-dig­i­tal ac­count­abil­ity move­ment. " +
              "It brings to­gether peo­ple with dif­fer­ent skills to track gov­ern­ment " +
              "and in­ter­na­tional aid spend­ing in grass­roots com­mu­ni­ties."}
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
          {roles.map(({ art: Art, title, text }, i) => (
            <li
              key={title}
              className="relative flex overflow-hidden rounded-[0.3125rem] bg-white text-foreground shadow-[0_24px_50px_-28px_rgb(0_0_0/0.7)]"
            >
              {/* Illustration panel on a faint dot grid */}
              <div className="relative grid w-28 shrink-0 place-items-center sm:w-32 bg-[#FBF7F6] bg-[radial-gradient(rgb(211_0_15/0.13)_1px,transparent_1.2px)] bg-[size:14px_14px]">
                <span className="absolute top-2 left-2.5 text-[0.625rem] font-semibold tracking-[0.14em] text-primary/70 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Art className="h-[5.5rem] w-auto sm:h-24" />
              </div>

              <div className="flex flex-1 flex-col justify-center p-4 sm:px-5 sm:py-4">
                <h3 className="[font-family:Cambria,Georgia,serif] text-[1.125rem]/tight font-medium text-black sm:text-[1.1875rem]/tight">
                  {title}
                </h3>
                <p className="mt-1.5 text-[0.875rem]/[1.35rem] text-muted">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
