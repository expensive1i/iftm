import {
  ArrowUpRight,
  ChartColumn,
  Megaphone,
  Smartphone,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ContactBanner } from "@/components/contact/contact-banner";
import { ContactChannels } from "@/components/contact/contact-channels";
import { ContactFaq } from "@/components/contact/contact-faq";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { WriteOn } from "@/components/ui/write-on";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with the Follow The Money team: questions, partnerships, press, or a project in your community.",
};

// For people who came here to do something else
const shortcuts = [
  {
    icon: Megaphone,
    title: "Start a campaign",
    text: "Follow a project in your community.",
    href: "/register",
  },
  {
    icon: Smartphone,
    title: "Get the app",
    text: "Report and follow from your phone.",
    href: siteConfig.appUrl,
    external: true,
  },
  {
    icon: ChartColumn,
    title: "See the analytics",
    text: "Campaigns and spending by country.",
    href: "/analytics",
  },
  {
    icon: Users,
    title: "About the movement",
    text: "Who we are and how it began.",
    href: "/about",
  },
];

/*
 * Contact page: banner; the direct channels beside a contact form; quick
 * links for other things people come to do; then common questions.
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
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            {/* Direct channels */}
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
                Get in touch
              </p>
              <WriteOn
                id="contact-title"
                className="mt-4 [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
                text="Reach the team directly."
              />
              <p className="mt-5 max-w-md text-base/7 text-muted sm:text-lg/8">
                Email, call or visit our office in Abuja. Or send a message with
                the form.
              </p>
              <div className="mt-10">
                <ContactChannels />
              </div>
            </div>

            {/* Form */}
            <div className="rounded-[0.3125rem] border border-t-[3px] border-foreground/15 border-t-primary bg-white p-6 shadow-[6px_7px_0_var(--foreground)] sm:p-9 lg:self-start">
              <h2 className="[font-family:Cambria,Georgia,serif] text-[1.625rem]/tight font-medium text-black sm:text-[2rem]/tight">
                Send us a message
              </h2>
              <p className="mt-2 text-[0.9375rem]/7 text-muted">
                Tell us a little about what you need.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
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
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        {title}
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                        />
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {text}
                      </span>
                    </span>
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
