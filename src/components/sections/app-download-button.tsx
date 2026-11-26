"use client";

import { useSyncExternalStore } from "react";

import { AppleIcon } from "@/components/brand/apple-icon";
import { GooglePlayIcon } from "@/components/brand/google-play-icon";
import { siteConfig } from "@/config/site";

// iPhone, iPad and iPod, including iPads that report themselves as a Mac.
function isAppleMobile() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}
const noSubscribe = () => () => {};

/**
 * Hero "Download the app" button that matches the visitor's device: the
 * Apple logo on iPhone and iPad, the Google Play logo everywhere else.
 * There is no App Store link yet, so on Apple devices it is a plain
 * button for now; on other devices it opens the Play Store listing.
 * The server renders the Google Play version, and Apple devices switch
 * once the page loads.
 */
export function AppDownloadButton({ className }: { className: string }) {
  const apple = useSyncExternalStore(noSubscribe, isAppleMobile, () => false);

  const label = (
    <>
      <span className="sm:hidden">Get the app</span>
      <span className="hidden sm:inline">Download the app</span>
    </>
  );

  if (apple) {
    return (
      // TODO: link to the App Store listing once the iOS app is published.
      <button type="button" className={className}>
        <AppleIcon className="-mt-0.5" />
        {label}
      </button>
    );
  }

  return (
    <a href={siteConfig.appUrl} target="_blank" rel="noopener noreferrer" className={className}>
      <GooglePlayIcon />
      {label}
    </a>
  );
}
