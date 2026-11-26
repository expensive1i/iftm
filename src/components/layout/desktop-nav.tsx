"use client";

import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { mainNav } from "@/config/navigation";
import { useDismiss } from "@/hooks/use-dismiss";
import { cn } from "@/lib/utils";

const linkClass =
  "group/link relative inline-flex h-[5.5rem] items-center gap-1 px-4 text-[0.9375rem] font-semibold text-foreground outline-none transition-colors hover:text-primary focus-visible:text-primary";

/** Red bar along the bottom of the header that grows out from the centre. */
function Underline({ active }: { active?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-4 bottom-0 h-[0.1875rem] origin-center bg-primary transition-transform duration-300 ease-out group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100",
        active ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}

/**
 * Main links. "About" and "Campaigns" open a full-width panel under the
 * header: a short intro, the links with one line each, and a photo card.
 */
export function DesktopNav() {
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const openedByHover = useRef(false);
  const close = useCallback(() => {
    openedByHover.current = false;
    setOpen(null);
  }, []);
  useDismiss(navRef, open !== null, close);

  return (
    <nav ref={navRef} aria-label="Main" className="hidden h-full lg:block">
      <ul className="flex h-full items-center">
        {mainNav.map((item) =>
          item.items ? (
            <li
              key={item.title}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                openedByHover.current = true;
                setOpen(item.title);
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") close();
              }}
            >
              <button
                type="button"
                aria-expanded={open === item.title}
                aria-haspopup="true"
                onClick={() => {
                  // A mouse click right after hover-open should keep it open.
                  if (openedByHover.current) {
                    openedByHover.current = false;
                    return;
                  }
                  setOpen((v) => (v === item.title ? null : item.title));
                }}
                className={cn(linkClass, open === item.title && "text-primary")}
              >
                {item.title}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "size-4 opacity-60 transition-transform",
                    open === item.title && "rotate-180",
                  )}
                />
                <Underline active={open === item.title} />
              </button>

              {open === item.title && (
                <div
                  data-menu
                  className="absolute inset-x-0 top-full border-t bg-white shadow-[0_24px_48px_-24px_rgb(0_0_0/0.3)]"
                  style={{ animation: "ftm-menu-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both" }}
                >
                  <Container className="grid gap-12 py-10 lg:max-w-[88rem] lg:grid-cols-[0.9fr_1.3fr_1fr]">
                    <div>
                      <p className="font-[Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-black">
                        {item.title}
                      </p>
                      <p className="mt-3 max-w-xs text-[0.9375rem]/6 text-muted">{item.intro}</p>
                    </div>

                    <ul className="grid content-start gap-x-8 gap-y-1 sm:grid-cols-2">
                      {item.items.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={close}
                            {...(sub.external && { target: "_blank", rel: "noopener noreferrer" })}
                            className="group block border-b py-4 outline-none"
                          >
                            <span className="flex items-center justify-between gap-3 text-base font-semibold transition-colors group-hover:text-primary group-focus-visible:text-primary">
                              {sub.title}
                              {sub.external ? (
                                <ArrowUpRight aria-hidden className="size-4 shrink-0" />
                              ) : (
                                <ArrowRight
                                  aria-hidden
                                  className="size-4 shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                />
                              )}
                            </span>
                            {sub.description && (
                              <span className="mt-1 block text-sm text-muted">
                                {sub.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={item.feature.href}
                      onClick={close}
                      className="group relative block aspect-[4/3] overflow-hidden bg-neutral-900 text-white"
                    >
                      <Image
                        src={item.feature.image}
                        alt=""
                        fill
                        sizes="400px"
                        className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.85),transparent_65%)]" />
                      <span className="absolute inset-x-5 bottom-5">
                        <span className="block font-display text-lg/6 font-bold">
                          {item.feature.title}
                        </span>
                        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white">
                          {item.feature.cta}
                          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </span>
                    </Link>
                  </Container>
                </div>
              )}
            </li>
          ) : (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.title}
                <Underline />
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
