import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContactBanner } from "@/components/contact/contact-banner";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactFaq } from "@/components/contact/contact-faq";
import { ContactForm } from "@/components/contact/contact-form";
import {
  AnalyticsIcon,
  AppIcon,
  CampaignIcon,
  PeopleIcon,
} from "@/components/contact/contact-icons";
import { Container } from "@/components/ui/container";
import { WriteOn } from "@/components/ui/write-on";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with the Follow The Money team: questions, partnerships, press, or a project in your community.",
};

// For people who came here to do something else (custom icons)
const shortcuts = [
  {
    icon: CampaignIcon,
    title: "Start a campaign",
    text: "Follow a project in your community.",
    href: "/register",
  },
  {
    icon: AppIcon,
    title: "Get the app",
    text: "Report and follow from your phone.",
    href: siteConfig.appUrl,
    external: true,
  },
  {
    icon: AnalyticsIcon,
    title: "See the analytics",
    text: "Campaigns and spending by country.",
    href: "/analytics",
  },
  {
    icon: PeopleIcon,
    title: "About the movement",
    text: "Who we are and how it began.",
    href: "/about",
  },
];

/*
 * Contact page: banner; the direct channels in one full-width row; the
 * form on its own full-width row; shortcuts for other things people come
 * to do; then common questions.
 */
export default function ContactPage() {
  return (
    <>
      <ContactBanner />

      <section
        aria-labelledby="contact-title"
        className="relative isolate overflow-hidden bg-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/corner-gear.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 -z-10 size-[9rem] -rotate-90 opacity-60 sm:size-[20rem] sm:opacity-70"
        />
        <Container className="py-16 sm:py-20 lg:max-w-[80rem] lg:py-24">
          {/* Heading */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                Get in touch
              </p>
              <WriteOn
                id="contact-title"
                className="mt-4 [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
                text="Reach the team directly."
              />
            </div>
            <p className="max-w-xl text-base/7 text-muted sm:text-lg/8">
              Email, call or visit our office in Abuja, follow the work online,
              or send a message with the form below.
            </p>
          </div>

          {/* Row 1: the direct channels */}
          <div className="mt-10 sm:mt-12">
            <ContactChannels />
          </div>

          {/* Row 2: the form */}
          <div className="mt-14 grid gap-10 rounded-[0.3125rem] border border-foreground/15 bg-white p-6 shadow-[6px_7px_0_var(--foreground)] sm:mt-16 sm:p-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16 lg:p-12">
            <div>
              <h2 className="[font-family:Cambria,Georgia,serif] text-[1.75rem]/tight font-medium text-black sm:text-[2.25rem]/tight">
                Send us a message
              </h2>
              <p className="mt-3 max-w-sm text-[0.9375rem]/7 text-muted">
                Tell us a little about what you need. Pick a topic so it reaches
                the right person.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-foreground">
                {[
                  "Partnerships and funding",
                  "Press, data and interviews",
                  "A project in your community",
                  "Help with your account or the app",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-primary"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <ContactForm />
          </div>

          {/* Shortcuts */}
          <div className="mt-16 sm:mt-20">
            <p className="text-sm font-semibold text-foreground">
              Looking for something else?
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {shortcuts.map(({ icon: Icon, title, text, href, external }) => {
                const inner = (
                  <>
                    <Icon className="size-12 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-foreground">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {text}
                      </span>
                    </span>
                    <ChevronRight
                      aria-hidden
                      className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </>
                );
                const cls =
                  "group flex h-full items-center gap-4 rounded-[0.3125rem] border border-foreground/15 bg-white p-4 transition-colors hover:border-primary";
                return (
                  <li key={title}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={href} className={cls}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <ContactFaq />
    </>
  );
}
