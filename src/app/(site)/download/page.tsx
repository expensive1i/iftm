import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  AppIcon,
  CampaignIcon,
  PeopleIcon,
} from "@/components/contact/contact-icons";
import { StoreButtons } from "@/components/download/store-buttons";
import { Container } from "@/components/ui/container";
import { WriteOn } from "@/components/ui/write-on";

export const metadata: Metadata = {
  title: "Download the app",
  description:
    "Get the iFollowTheMoney app: report on projects in your community, follow campaigns and share what you find. Android now, iOS coming soon.",
};

// How to follow the money, in three steps (custom icons)
const steps = [
  {
    n: "01",
    icon: AppIcon,
    title: "Download the app",
    text: "Get it from Google Play. The iOS app is on its way.",
  },
  {
    n: "02",
    icon: PeopleIcon,
    title: "Create your account",
    text: "Register on the app or the website.",
  },
  {
    n: "03",
    icon: CampaignIcon,
    title: "Follow the money",
    text: "Start a campaign or follow one near you.",
  },
];

/*
 * Download the app, kept simple: the banner, then one section with the
 * store buttons and the three steps to follow the money. The App Store
 * button reads "Coming soon" until siteConfig.iosAppUrl is set. The bottom
 * padding leaves room for the footer's app card.
 */
export default function DownloadPage() {
  return (
    <>
      {/* Banner, as on the other pages */}
      <section aria-labelledby="download-page-title">
        <div className="relative isolate overflow-hidden text-white">
          <Image
            src="/images/community/kano-young-trackers.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-[center_30%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(20_20_20/0.88)_0%,rgb(28_28_28/0.72)_55%,rgb(70_0_6/0.62)_100%)]"
          />
          <Container className="pt-10 pb-14 [text-shadow:0_1px_14px_rgb(0_0_0/0.45)] sm:pt-14 sm:pb-16 lg:max-w-[80rem] lg:pt-16 lg:pb-20">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-base text-white/80 sm:text-lg">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden>
                  <ChevronRight className="size-4 sm:size-[1.125rem]" />
                </li>
                <li aria-current="page" className="font-medium text-white">
                  Download the app
                </li>
              </ol>
            </nav>
            <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
              <h1
                id="download-page-title"
                className="[font-family:Cambria,Georgia,serif] text-[2.5rem]/[3rem] font-medium text-balance sm:text-[3rem]/[3.625rem] lg:text-[3.25rem]/[3.875rem]"
              >
                Get the app.
              </h1>
              <p className="max-w-md text-[0.9375rem]/[1.7rem] text-white/80">
                Track public projects in your community from your phone,
                wherever you are.
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* Store buttons + phone */}
      <section
        aria-labelledby="download-title"
        className="relative isolate overflow-hidden bg-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/corner-gear.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 -z-10 size-[9rem] -rotate-90 opacity-60 sm:size-[20rem] sm:opacity-70"
        />
        <Container className="pt-16 pb-40 sm:pt-20 lg:max-w-[80rem] lg:pt-24 lg:pb-44">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              iFollowTheMoney app
            </p>
            <WriteOn
              id="download-title"
              className="mt-4 [font-family:Cambria,Georgia,serif] text-[2rem]/[2.5rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
              text="Follow the money from your phone."
            />
            <p className="mx-auto mt-5 max-w-xl text-base/7 text-muted sm:text-lg/8">
              Report on projects in your community, follow campaigns and share
              what you find. Available on Android now; the iOS app is coming
              soon.
            </p>
            <StoreButtons className="mt-8 justify-center" />
            <p className="mt-6 text-sm text-muted">
              Prefer a computer?{" "}
              <Link
                href="/login"
                className="inline-flex items-center gap-0.5 font-semibold text-primary underline-offset-4 hover:underline"
              >
                Use it on the web{" "}
                <ChevronRight aria-hidden className="size-4" />
              </Link>
            </p>
          </div>

          {/* How to follow the money */}
          <div className="mt-16 sm:mt-20">
            <h2 className="text-center [font-family:Cambria,Georgia,serif] text-[1.625rem]/tight font-medium text-black sm:text-[2rem]/tight">
              How to follow the money
            </h2>
            <ol className="mt-8 grid gap-px overflow-hidden rounded-[0.3125rem] border border-foreground/15 bg-foreground/15 sm:grid-cols-3">
              {steps.map(({ n, icon: Icon, title, text }) => (
                <li key={n} className="bg-white p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <Icon className="size-14" />
                    <span className="[font-family:Cambria,Georgia,serif] text-[1.75rem]/none font-medium text-primary">
                      {n}
                    </span>
                  </div>
                  <h3 className="mt-5 [font-family:Cambria,Georgia,serif] text-[1.25rem]/tight font-medium text-black">
                    {title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem]/6 text-muted">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    </>
  );
}
