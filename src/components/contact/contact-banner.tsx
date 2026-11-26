import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

/*
 * Contact page banner: the same title band as the About and Analytics
 * pages (a darkened photo, larger breadcrumbs, the title and a short line
 * beside it).
 */
export function ContactBanner() {
  return (
    <section aria-labelledby="contact-page-title">
      <div className="relative isolate overflow-hidden text-white">
        <Image
          src="/images/community/abuja-health-dialogue.jpg"
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
                Contact
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
            <h1
              id="contact-page-title"
              className="[font-family:Cambria,Georgia,serif] text-[2.5rem]/[3rem] font-medium text-balance sm:text-[3rem]/[3.625rem] lg:text-[3.25rem]/[3.875rem]"
            >
              Let’s talk.
            </h1>
            <p className="max-w-md text-[0.9375rem]/[1.7rem] text-white/80">
              Questions, partnerships, press, or a project in your community
              that needs attention: write to the Follow The Money team.
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
