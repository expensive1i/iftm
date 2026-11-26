import {
  ChartColumn,
  Database,
  Megaphone,
  Newspaper,
  Scale,
  Users,
} from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/ui/container";

// The people who make up the network (from the current About page).
const roles = [
  {
    icon: Newspaper,
    title: "Journalists",
    text: "Report what was promised and what was delivered.",
  },
  {
    icon: Database,
    title: "Data specialists",
    text: "Turn budgets and spending into open, usable data.",
  },
  {
    icon: Megaphone,
    title: "Community champions",
    text: "Lead tracking on the ground in their own communities.",
  },
  {
    icon: ChartColumn,
    title: "Analysts",
    text: "Study the numbers behind public projects.",
  },
  {
    icon: Scale,
    title: "Legal practitioners",
    text: "Use the law to press for answers.",
  },
  {
    icon: Users,
    title: "Citizens",
    text: "Ask questions and share what they see.",
  },
];

/**
 * Who we are: a short statement and the six kinds of people in the network,
 * over a still photo of a community group that the page scrolls past.
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
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(20_20_20/0.9)_0%,rgb(28_28_28/0.78)_45%,rgb(110_0_8/0.55)_100%)]"
      />

      <Container className="grid gap-12 py-20 sm:py-24 lg:max-w-[80rem] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:py-28">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white/60 uppercase">
            Who we are
          </p>
          <h2
            id="who-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-white sm:text-[2.75rem]/[3.375rem]"
          >
            People who follow the money, together.
          </h2>
          <p
            lang="en"
            className="mt-6 max-w-xl text-justify text-base/[1.8rem] hyphens-manual text-white/75 sm:text-lg/8"
          >
            {"Fol­low The Money is a so­cio-dig­i­tal ac­count­abil­ity move­ment. " +
              "It brings to­gether peo­ple with dif­fer­ent skills to track gov­ern­ment " +
              "and in­ter­na­tional aid spend­ing in grass­roots com­mu­ni­ties."}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[1rem] bg-foreground/10 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
          {roles.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="group bg-white p-4 transition-colors hover:bg-[#FCFCFB] sm:p-7"
            >
              <span className="grid size-9 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-white sm:size-11">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-3.5 [font-family:Cambria,Georgia,serif] text-[1.0625rem]/tight font-medium text-black sm:mt-5 sm:text-[1.25rem]/tight">
                {title}
              </h3>
              <p className="mt-1.5 text-[0.8125rem]/5 text-muted sm:mt-2 sm:text-sm/6">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
