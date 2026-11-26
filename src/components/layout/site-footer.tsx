import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { FooterAppCard } from "@/components/layout/footer-app-card";
import { FooterWordmark } from "@/components/layout/footer-wordmark";
import { SocialIcons } from "@/components/layout/social-icons";
import { Container } from "@/components/ui/container";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

// Evaluated when the page is built, so it stays a static value.
const YEAR = new Date().getFullYear();

const HEADING = "text-xs font-semibold tracking-[0.16em] text-white/45 uppercase";
const LINK = "font-medium text-white/85 transition-colors hover:text-[#ff4d57]";

/**
 * Footer: the red app card across its top edge, then a compact dark footer
 * with the links, and the logo with "iFollowTheMoney" set huge along the bottom edge.
 */
export function SiteFooter() {
  return (
    <footer className="relative isolate bg-foreground text-white">
      <FooterAppCard />

      {/* Top row: logo on the left, social icons on the right */}
      <Container className="flex items-center justify-between gap-6 border-b border-white/10 pt-14 pb-10 lg:max-w-[88rem]">
        {/* Official white logo for dark backgrounds */}
        <Link href="/" className="inline-flex shrink-0">
          <Image
            src="/brand/ftm-logo-white.png"
            alt={siteConfig.name}
            width={2442}
            height={814}
            className="h-11 w-auto sm:h-12"
          />
        </Link>
        <SocialIcons className="gap-5 text-white [&_a]:opacity-70 [&_svg]:size-5" />
      </Container>

      {/* Four even columns, each opening with the same heading style */}
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:max-w-[88rem] lg:grid-cols-4 lg:gap-12">
        <div>
          <h3 className={HEADING}>About</h3>
          <p className="mt-5 max-w-xs text-[0.9375rem]/7 text-white/60">{siteConfig.description}</p>
        </div>

        {footerNav.map((group) => (
          <div key={group.title}>
            <h3 className={HEADING}>{group.title}</h3>
            <ul className="mt-5 space-y-3">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`text-[0.9375rem]/7 ${LINK}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className={HEADING}>Contact</h3>
          <ul className="mt-5 space-y-3 text-[0.9375rem]/7">
            <li>
              <a href={`mailto:${siteConfig.email}`} className={`inline-flex items-center gap-2.5 ${LINK}`}>
                <Mail aria-hidden className="size-4 shrink-0 text-white/45" />
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-2.5 text-white/60">
              <MapPin aria-hidden className="mt-1.5 size-4 shrink-0 text-white/45" />
              {siteConfig.address}
            </li>
          </ul>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-[0.8125rem] text-white/50 sm:flex-row sm:items-center sm:justify-between lg:max-w-[88rem]">
          <p>© {YEAR} Connected Development (CODE). All rights reserved.</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
            </li>
          </ul>
        </Container>
      </div>

      <FooterWordmark />
    </footer>
  );
}
