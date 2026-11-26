import { AppleIcon } from "@/components/brand/apple-icon";
import { GooglePlayIcon } from "@/components/brand/google-play-icon";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const BTN =
  "inline-flex h-14 items-center gap-3 rounded-[0.5rem] pr-6 pl-4 text-left whitespace-nowrap transition-colors";
const SMALL = "block text-[0.625rem] font-semibold tracking-[0.12em] uppercase";
const BIG = "mt-1 block text-[1.125rem]/none font-semibold";

/**
 * The two store buttons. Google Play links to the live listing; the App
 * Store button shows "Coming soon" until `siteConfig.iosAppUrl` is set,
 * then it becomes a normal link.
 */
export function StoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a
        href={siteConfig.appUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(BTN, "bg-foreground text-white hover:bg-black")}
      >
        <GooglePlayIcon className="size-7" />
        <span>
          <span className={cn(SMALL, "text-white/60")}>Get it on</span>
          <span className={BIG}>Google Play</span>
        </span>
      </a>

      {siteConfig.iosAppUrl ? (
        <a
          href={siteConfig.iosAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(BTN, "bg-foreground text-white hover:bg-black")}
        >
          <AppleIcon className="size-7" />
          <span>
            <span className={cn(SMALL, "text-white/60")}>Download on the</span>
            <span className={BIG}>App Store</span>
          </span>
        </a>
      ) : (
        <span
          aria-disabled
          className={cn(
            BTN,
            "relative cursor-default border-[1.5px] border-foreground/20 bg-white text-foreground/45",
          )}
        >
          <AppleIcon className="size-7" />
          <span>
            <span className={cn(SMALL, "text-foreground/40")}>
              Download on the
            </span>
            <span className={BIG}>App Store</span>
          </span>
          <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[0.625rem] font-bold tracking-wider text-white uppercase">
            Coming soon
          </span>
        </span>
      )}
    </div>
  );
}
