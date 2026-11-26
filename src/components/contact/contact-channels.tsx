"use client";

import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import { useState } from "react";

import { SocialIcons } from "@/components/layout/social-icons";
import { siteConfig } from "@/config/site";

const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Bassan Plaza, Central Area, Abuja",
)}`;

/**
 * The direct ways to reach the team in one full-width row (two by two on
 * tablets, stacked on phones): email (with a copy button), phone, the
 * office (with directions) and social channels. Details come from
 * src/config/site.ts (the current site's footer and Contact page).
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

  const cell =
    "flex flex-col border-foreground/10 py-7 sm:px-6 lg:px-8 lg:first:pl-0 lg:last:pr-0 max-sm:border-b max-sm:last:border-b-0";
  const icon =
    "grid size-12 place-items-center rounded-full bg-primary text-white";
  const label =
    "mt-5 text-[0.6875rem] font-semibold tracking-[0.14em] text-muted uppercase";
  const value =
    "mt-1.5 block text-[1.0625rem]/snug font-semibold text-foreground sm:text-[1.125rem]/snug";
  const action =
    "mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline";

  return (
    <ul className="grid border-y border-foreground/10 sm:grid-cols-2 lg:grid-cols-4 lg:[&>li:not(:last-child)]:border-r sm:max-lg:[&>li:nth-child(-n+2)]:border-b sm:max-lg:[&>li:nth-child(odd)]:border-r">
      <li className={cell}>
        <span className={icon}>
          <Mail aria-hidden className="size-5" />
        </span>
        <p className={label}>Email</p>
        <a
          href={`mailto:${siteConfig.email}`}
          className={`${value} break-all hover:text-primary`}
        >
          {siteConfig.email}
        </a>
        <button type="button" onClick={copy} className={action}>
          {copied ? (
            <Check aria-hidden className="size-4 text-[#16875f]" />
          ) : (
            <Copy aria-hidden className="size-4" />
          )}
          <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
        </button>
      </li>

      <li className={cell}>
        <span className={icon}>
          <Phone aria-hidden className="size-5" />
        </span>
        <p className={label}>Phone</p>
        <a
          href={siteConfig.phoneHref}
          className={`${value} hover:text-primary`}
        >
          {siteConfig.phone}
        </a>
        <a href={siteConfig.phoneHref} className={action}>
          Call us <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </li>

      <li className={cell}>
        <span className={icon}>
          <MapPin aria-hidden className="size-5" />
        </span>
        <p className={label}>Office</p>
        <p className={value}>{siteConfig.address}</p>
        <a
          href={MAPS}
          target="_blank"
          rel="noopener noreferrer"
          className={action}
        >
          Get directions <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </li>

      <li className={cell}>
        <span className={icon}>
          <Share2 aria-hidden className="size-5" />
        </span>
        <p className={label}>Follow the work</p>
        <p className={value}>News, stories and campaigns</p>
        <SocialIcons className="mt-auto gap-2.5 pt-3 [&_a]:grid [&_a]:size-10 [&_a]:place-items-center [&_a]:rounded-full [&_a]:border-[1.5px] [&_a]:border-foreground/15 [&_a]:text-foreground [&_a]:transition-colors [&_a:hover]:border-primary [&_a:hover]:bg-primary [&_a:hover]:text-white [&_svg]:size-4" />
      </li>
    </ul>
  );
}
