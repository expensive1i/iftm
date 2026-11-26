import { Mail, MapPin, Smartphone } from "lucide-react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SocialIcons } from "@/components/layout/social-icons";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

/** Thin dark strip above the main navbar: contact, app, socials, language. */
export function TopBar() {
  return (
    <div className="hidden bg-primary-deep text-[0.8125rem] text-white lg:block">
      <Container className="flex h-10 items-center justify-between gap-6 lg:max-w-[88rem]">
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
          >
            <Mail aria-hidden className="size-3.5" />
            {siteConfig.email}
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden className="size-3.5" />
            {siteConfig.address}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={siteConfig.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
          >
            <Smartphone aria-hidden className="size-3.5" />
            Get the Android app
          </a>
          <span aria-hidden className="h-4 w-px bg-white/20" />
          <SocialIcons />
          <span aria-hidden className="h-4 w-px bg-white/20" />
          <LanguageSwitcher tone="dark" />
        </div>
      </Container>
    </div>
  );
}
