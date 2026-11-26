import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { AuthShowcase } from "@/components/auth/auth-showcase";
import { siteConfig } from "@/config/site";

// Evaluated when the page is built, so it stays a static value.
const YEAR = new Date().getFullYear();

/*
 * Shared layout for the auth pages (log in, register, forgot password):
 * no site header or footer. On the left, the logo and the form over a
 * faint pattern of brand icons; on the right (large screens), a rounded
 * panel with rotating facts and cut-out photos.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh flex-1 bg-white lg:grid-cols-[1fr_1fr] lg:p-3 xl:grid-cols-[1.1fr_1fr]">
      <div className="relative isolate flex flex-col px-5 py-6 sm:px-10 lg:py-8">
        {/* Faint pattern of brand icons, fading out towards the centre */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[url(/brand/pattern-auth.svg)] [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black_75%)] bg-size-[180px] opacity-[0.07]"
        />
        <Link
          href="/"
          className="inline-flex w-fit"
          aria-label={`${siteConfig.name} home`}
        >
          <Image
            src="/brand/ftm-logo.png"
            alt={siteConfig.name}
            width={2442}
            height={814}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[28rem]">{children}</div>
        </main>

        <p className="text-center text-xs text-muted lg:text-left">
          © {YEAR} Connected Development (CODE)
        </p>
      </div>

      <div className="hidden lg:sticky lg:top-3 lg:block lg:h-[calc(100dvh-1.5rem)]">
        <AuthShowcase />
      </div>
    </div>
  );
}
