import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Campaign } from "@/config/campaigns";

const fmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/**
 * Listing-style card: a rounded photo on top with the country chip, and a
 * white info panel that overlaps the photo's lower edge, set in a little
 * from the sides and sitting on a solid offset block (no blur shadow).
 * Hover lifts the panel and zooms the photo.
 */
export function CampaignCard({ campaign: c }: { campaign: Campaign }) {
  return (
    <Link
      href={`/campaigns/${c.slug}`}
      className="group flex h-full flex-col rounded-[0.75rem] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
    >
      {/* Photo */}
      <div className="relative aspect-[5/4] overflow-hidden rounded-[0.75rem] bg-[#121212]">
        {c.image ? (
          <Image
            src={c.image.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 85vw"
            className={
              c.image.fit === "contain"
                ? "bg-white object-contain p-8 pb-20 transition-transform duration-700 group-hover:scale-105"
                : "object-cover transition-transform duration-700 group-hover:scale-105"
            }
            style={c.image.position ? { objectPosition: c.image.position } : undefined}
          />
        ) : (
          <BrandCover />
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-foreground backdrop-blur">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {c.country}
        </span>
      </div>

      {/* Info panel over the photo's lower edge, on an offset block */}
      <div className="relative z-10 mx-2.5 -mt-14 flex flex-1 flex-col rounded-[0.625rem] border border-foreground/10 bg-white px-4 pt-4 pb-3.5 shadow-[5px_6px_0_var(--foreground)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[6px_9px_0_var(--primary-deep)]">
        <h3 className="line-clamp-2 [font-family:Cambria,Georgia,serif] text-[1.125rem]/[1.45rem] font-medium [overflow-wrap:anywhere] text-black transition-colors group-hover:text-primary">
          {c.title}
        </h3>
        <p className="mt-1.5 mb-4 truncate text-[0.8125rem] text-muted">By {c.author}</p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-foreground/10 pt-3">
          <time
            dateTime={c.date}
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted"
          >
            <CalendarDays aria-hidden className="size-3.5" />
            {fmt.format(new Date(c.date))}
          </time>
          <span
            aria-hidden
            className="grid h-7 w-9 shrink-0 place-items-center rounded-full bg-foreground text-white transition-colors group-hover:bg-primary"
          >
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** No photo yet: a branded cover with the dot pattern and gear mark. */
function BrandCover() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_110%,rgb(211_0_15/0.35),transparent_60%)]">
      <div className="absolute inset-0 bg-[url(/brand/pattern-dots.svg)] bg-size-[1.25rem] opacity-40 invert" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/motif-gear-red.svg"
        alt=""
        className="absolute -top-6 -right-8 size-44 opacity-90 transition-transform duration-700 group-hover:rotate-12"
      />
    </div>
  );
}
