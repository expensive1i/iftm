import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

/*
 * Analytics page banner: the same title band as the About page (a darkened
 * photo with the breadcrumb, title and a short line beside it).
 */
export function AnalyticsBanner() {
  return (
    <section aria-labelledby="analytics-page-title">
      <div className="relative isolate overflow-hidden text-white">
        <Image
          src="/images/community/monitoring-training-notes.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[center_35%]"
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
                Analytics
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
            {/* The visible title is commented out for now (kept for later):
            <h1
              id="analytics-page-title"
              className="[font-family:Cambria,Georgia,serif] text-[2.5rem]/[3rem] font-medium text-balance sm:text-[3rem]/[3.625rem] lg:text-[3.25rem]/[3.875rem]"
            >
              Follow the money across Africa.
            </h1>
            */}
            {/* Meanwhile: a heading for screen readers, and an invisible
                copy of the title that holds its space so the banner keeps
                its height. */}
            <div>
              <h1 id="analytics-page-title" className="sr-only">
                Analytics
              </h1>
              <p
                aria-hidden
                className="invisible [font-family:Cambria,Georgia,serif] text-[2.5rem]/[3rem] font-medium text-balance select-none sm:text-[3rem]/[3.625rem] lg:text-[3.25rem]/[3.875rem]"
              >
                Follow the money across Africa.
              </p>
            </div>
            <p className="max-w-md text-[0.9375rem]/[1.7rem] text-white/80">
              Campaigns, budgets and spending tracked by citizens in 54
              countries, straight from the iFollowTheMoney platform.
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
