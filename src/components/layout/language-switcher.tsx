"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { languages } from "@/config/navigation";
import { useDismiss } from "@/hooks/use-dismiss";
import { cn } from "@/lib/utils";

// Translations are not wired up yet: this only remembers the choice on
// the page. Swap setCurrent for a router/i18n call once locales exist.
export function LanguageSwitcher({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  const label = languages.find((l) => l.code === current)?.label;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors",
          tone === "dark" ? "hover:text-white" : "text-muted hover:text-primary",
        )}
      >
        <Globe aria-hidden className="size-3.5" />
        {label}
        <ChevronDown aria-hidden className="size-3.5 opacity-60" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute top-full right-0 z-50 mt-3 min-w-44 border-t-2 border-primary bg-surface py-2 text-sm text-foreground shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)]"
        >
          {languages.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === current}>
              <button
                type="button"
                lang={lang.code}
                onClick={() => {
                  setCurrent(lang.code);
                  close();
                }}
                className={cn(
                  "block w-full px-5 py-2 text-left transition-colors hover:text-primary",
                  lang.code === current && "font-semibold text-primary",
                )}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
