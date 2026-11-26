"use client";

import { ArrowUpRight, ChevronDown, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

import { SocialIcons } from "@/components/layout/social-icons";
import { authNav, languages, mainNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Phone menu: a clean sheet that drops in under the header. It stays
 * mounted so it can animate both ways: the sheet fades and slides, the
 * rows follow one after another, and closing plays it in reverse.
 * Groups (About, Campaigns) fold open in place instead of listing every
 * link at once. Login and Register sit at the bottom, within thumb reach.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [top, setTop] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = () => setOpen(false);
  const toggle = () => {
    // The sheet starts right under the header, wherever the header is now.
    const header = button.current?.closest("header");
    if (header) setTop(header.getBoundingClientRect().bottom);
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Each row slides in a little after the one above it (only when opening).
  const row = (i: number): CSSProperties => ({
    transitionDelay: open ? `${90 + i * 45}ms` : "0ms",
  });
  const rowClass = cn(
    "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 duration-150",
  );

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggle}
        className="relative grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
      >
        {/* Two lines that turn into a cross */}
        <span aria-hidden className="relative block h-3 w-[1.375rem]">
          <span
            className={cn(
              "absolute left-0 h-[2px] w-full rounded-full bg-current transition-[top,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
              open ? "top-[5px] rotate-45" : "top-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 h-[2px] rounded-full bg-current transition-[top,transform,width] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
              open ? "top-[5px] w-full -rotate-45" : "top-[10px] w-[70%]",
            )}
          />
        </span>
      </button>

      {/* Dim the page behind the sheet */}
      <div
        aria-hidden
        onClick={close}
        style={{ top }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-black/30 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <div
        id={panelId}
        inert={!open}
        style={{ top }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto bg-white transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0 duration-200",
        )}
      >
        <nav aria-label="Mobile" className="px-5 pt-3 sm:px-8">
          <ul className="divide-y divide-border">
            {mainNav.map((item, i) => {
              const expanded = group === item.title;
              return (
                <li key={item.title} style={row(i)} className={rowClass}>
                  {item.items ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setGroup(expanded ? null : item.title)}
                        className="flex w-full items-center justify-between py-4 text-left text-[1.0625rem] font-semibold text-foreground"
                      >
                        {item.title}
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-5 text-muted transition-transform duration-300",
                            expanded && "rotate-180 text-primary",
                          )}
                        />
                      </button>
                      {/* Folds open smoothly to its own height */}
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <ul inert={!expanded} className="overflow-hidden">
                          {item.items.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={close}
                                {...(sub.external && { target: "_blank", rel: "noopener noreferrer" })}
                                className="flex items-center justify-between gap-3 rounded-[0.375rem] px-3 py-2.5 text-[0.9375rem] font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                              >
                                {sub.title}
                                {sub.external && <ArrowUpRight aria-hidden className="size-4" />}
                              </Link>
                            </li>
                          ))}
                          <li aria-hidden className="h-3" />
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex items-center justify-between py-4 text-[1.0625rem] font-semibold text-foreground"
                    >
                      {item.title}
                      <ChevronRight aria-hidden className="size-5 text-muted" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto px-5 pt-8 pb-6 sm:px-8">
          {/* Language: one dropdown; the phone's own picker lists every option */}
          <div style={row(mainNav.length)} className={rowClass}>
            <label
              htmlFor={`${panelId}-lang`}
              className="text-xs font-semibold tracking-[0.16em] text-muted uppercase"
            >
              Language
            </label>
            <div className="relative mt-3">
              <Globe
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-4 size-[1.125rem] -translate-y-1/2 text-muted"
              />
              <select
                id={`${panelId}-lang`}
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-12 w-full appearance-none rounded-[0.3125rem] border border-border bg-white pr-11 pl-11 text-[0.9375rem] font-medium text-foreground transition-colors outline-none focus:border-foreground"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} lang={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-[1.125rem] -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div
            style={row(mainNav.length + 1)}
            className={cn(rowClass, "mt-6 grid grid-cols-2 gap-3")}
          >
            <Link
              href={authNav.login.href}
              onClick={close}
              className="btn-sweep btn-sweep-invert flex h-12 items-center justify-center rounded-[0.3125rem] border border-foreground/20 bg-white font-semibold text-foreground"
            >
              {authNav.login.title}
            </Link>
            <Link
              href={authNav.register.href}
              onClick={close}
              className="btn-sweep flex h-12 items-center justify-center rounded-[0.3125rem] bg-primary font-semibold text-primary-foreground"
            >
              {authNav.register.title}
            </Link>
          </div>

          <div
            style={row(mainNav.length + 2)}
            className={cn(rowClass, "mt-6 flex justify-center")}
          >
            <SocialIcons className="gap-6 text-muted [&_svg]:size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
