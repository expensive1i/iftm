import { Plus } from "lucide-react";
import Link from "next/link";

import { WriteOn } from "@/components/ui/write-on";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

// Answers use only what the site already says about how the platform works.
const faqs = [
  {
    q: "How do I start a campaign about a project in my community?",
    a: (
      <>
        Create an account with{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Register
        </Link>
        , then start a campaign from the web or the Android app: say what was
        promised, where it is, and what you can see on the ground. Others can
        follow it and add what they know.
      </>
    ),
  },
  {
    q: "Can I use iFollowTheMoney on my phone?",
    a: (
      <>
        Yes. The{" "}
        <a
          href={siteConfig.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Android app
        </a>{" "}
        lets you report on projects, follow campaigns and share what you find.
        You can also use the website from any browser.
      </>
    ),
  },
  {
    q: "Where do the figures on the Analytics page come from?",
    a: (
      <>
        From the campaigns on the platform itself: the budgets and spending that
        campaign creators report. The{" "}
        <Link
          href="/analytics"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Analytics page
        </Link>{" "}
        reads them live and refreshes every few minutes.
      </>
    ),
  },
  {
    q: "Our organisation would like to partner with you. Who do we talk to?",
    a: (
      <>
        Use the form above and pick{" "}
        <span className="font-semibold text-foreground">Partnership</span>, or
        email {siteConfig.email}. Tell us who you are and what you have in mind.
      </>
    ),
  },
  {
    q: "I am a journalist. Can I use the data or speak to the team?",
    a: (
      <>
        Yes. Pick{" "}
        <span className="font-semibold text-foreground">Press and media</span>{" "}
        in the form, or email {siteConfig.email} with your deadline and what you
        need.
      </>
    ),
  },
];

/**
 * Common questions as an accordion (native details/summary, so it works
 * without JavaScript). The bottom padding leaves room for the footer's app
 * card, which overlaps the end of the page.
 */
export function ContactFaq() {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/corner-gear.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 -z-10 size-[9rem] rotate-90 opacity-60 sm:size-[20rem] sm:opacity-70"
      />
      <Container className="grid gap-10 pt-20 pb-40 sm:pt-24 lg:max-w-[80rem] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:pt-28 lg:pb-44">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
            Questions
          </p>
          <WriteOn
            id="faq-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
            text="Before you write, this might help."
          />
        </div>

        <div className="border-t border-foreground/15">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-foreground/15">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left [font-family:Cambria,Georgia,serif] text-[1.1875rem]/snug font-medium text-black sm:py-6 sm:text-[1.375rem]/snug [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-foreground/15 transition-[transform,background-color,color,border-color] duration-300 group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-white">
                  <Plus aria-hidden className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-[0.9375rem]/7 text-muted">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
