import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { DesktopNav } from "@/components/layout/desktop-nav";
import { HeaderShell } from "@/components/layout/header-shell";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopBar } from "@/components/layout/top-bar";
import { Container } from "@/components/ui/container";
import { authNav } from "@/config/navigation";

/** Dark top strip (scrolls away) and the sticky main bar under it. */
export function SiteHeader() {
  return (
    <>
      <TopBar />
      <HeaderShell>
        <Container className="flex h-[4.5rem] items-center lg:h-[5.5rem] lg:max-w-[88rem]">
          <Logo />

          <div className="ml-auto h-full lg:mx-auto">
            <DesktopNav />
          </div>

          <div className="ml-auto flex items-center gap-3 lg:ml-0">
            <span aria-hidden className="mx-5 hidden h-7 w-px bg-foreground/15 lg:block" />
            <Link
              href={authNav.login.href}
              className="hidden h-11 items-center rounded-[0.3125rem] border border-foreground/20 btn-sweep bg-white px-5 text-[0.9375rem] font-semibold text-foreground btn-sweep-invert [--sweep:var(--foreground)] lg:inline-flex"
            >
              {authNav.login.title}
            </Link>
            <Link
              href={authNav.register.href}
              className="group hidden h-11 items-center gap-2 rounded-[0.3125rem] btn-sweep bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground [--sweep:var(--primary-deep)] md:inline-flex"
            >
              {authNav.register.title}
              <ChevronRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <MobileNav />
          </div>
        </Container>
      </HeaderShell>
    </>
  );
}
