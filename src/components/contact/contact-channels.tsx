"use client";

import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { SocialIcons } from "@/components/layout/social-icons";
import { siteConfig } from "@/config/site";

const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Bassan Plaza, Central Area, Abuja",
)}`;

/**
 * The direct ways to reach the team, as large rows: email (with a copy
 * button), phone, the office (with directions) and social channels.
 * Details come from src/config/site.ts (the current site's footer and
 * Contact page).
 */
export function ContactChannels() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not allowed: the address is on screen to select by hand
    }
  }

  const row =
    "flex items-start gap-4 border-b border-foreground/10 py-6 first:pt-0";
  const icon =
    "grid size-12 shrink-0 place-items-center rounded-full bg-primary text-white";
  const label =
    "text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase";
  const value =
    "mt-1 block text-[1.125rem]/snug font-semibold text-foreground sm:text-[1.25rem]/snug";

  return (
    <ul>
      <li className={row}>
        <span className={icon}>
          <Mail aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={label}>Email</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className={`${value} break-all hover:text-primary`}
          >
            {siteConfig.email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary"
          >
            {copied ? (
              <Check aria-hidden className="size-4 text-[#16875f]" />
            ) : (
              <Copy aria-hidden className="size-4" />
            )}
            <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
          </button>
        </div>
      </li>

      <li className={row}>
        <span className={icon}>
          <Phone aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={label}>Phone</p>
          <a
            href={siteConfig.phoneHref}
            className={`${value} hover:text-primary`}
          >
            {siteConfig.phone}
          </a>
        </div>
      </li>

      <li className={row}>
        <span className={icon}>
          <MapPin aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className={label}>Office</p>
          <p className={value}>{siteConfig.address}</p>
          <a
            href={MAPS}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Get directions <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </div>
      </li>

      <li className={`${row} border-b-0`}>
        <div className="flex-1">
          <p className={label}>Follow the work</p>
          <SocialIcons className="mt-3 gap-3 [&_a]:grid [&_a]:size-11 [&_a]:place-items-center [&_a]:rounded-full [&_a]:border [&_a]:border-foreground/15 [&_a]:text-foreground [&_a]:transition-colors [&_a:hover]:border-primary [&_a:hover]:bg-primary [&_a:hover]:text-white [&_svg]:size-[1.125rem]" />
        </div>
      </li>
    </ul>
  );
}
