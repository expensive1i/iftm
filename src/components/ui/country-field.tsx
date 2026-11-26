"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { type Country, countries } from "@/lib/analytics/countries";
import { cn } from "@/lib/utils";

/** A round country flag from /public/flags. */
function Flag({ code, className }: { code: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      aria-hidden
      width={22}
      height={22}
      className={cn(
        "size-[1.375rem] shrink-0 rounded-full object-cover ring-1 ring-black/10",
        className,
      )}
    />
  );
}

/**
 * A country picker that matches the site's fields: the label sits on the
 * border, the chosen country shows with its flag, and opening it gives a
 * searchable list of all 54 countries with flags. Keyboard: arrows to move,
 * Enter to pick, Escape to close, type to search. The value is the
 * country's ISO2 code (e.g. "NG").
 */
export function CountryField({
  label,
  value,
  onChange,
  error,
  required,
  id,
  className,
}: {
  label: string;
  value: string;
  onChange: (iso2: string) => void;
  error?: string;
  required?: boolean;
  id?: string;
  className?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const current = countries.find((c) => c.iso2 === value);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...countries]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(
        (c) =>
          !q || c.name.toLowerCase().includes(q) || c.iso2.toLowerCase() === q,
      );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    search.current?.focus();
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  useEffect(() => {
    if (open)
      document
        .getElementById(`${fid}-opt-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, fid]);

  function pick(c: Country) {
    onChange(c.iso2);
    setOpen(false);
    setQuery("");
    document.getElementById(fid)?.focus();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (list[active]) pick(list[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      document.getElementById(fid)?.focus();
    }
  }

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <button
        id={fid}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={error ? `${fid}-msg` : undefined}
        onClick={() => {
          setOpen((o) => !o);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "flex h-14 w-full items-center gap-3 rounded-[0.625rem] border-[1.5px] bg-white pr-11 pl-4 text-left text-[0.9375rem] text-foreground transition-colors outline-none",
          error
            ? "border-primary"
            : open
              ? "border-primary"
              : "border-foreground/20 hover:border-foreground/35 focus:border-primary",
        )}
      >
        {current ? (
          <>
            <Flag code={current.iso2} />
            <span className="truncate">{current.name}</span>
          </>
        ) : (
          <span className="text-muted">Choose your country</span>
        )}
      </button>
      <span
        className={cn(
          "pointer-events-none absolute top-0 left-3 -translate-y-1/2 bg-white px-1 text-xs font-semibold",
          error ? "text-primary" : open ? "text-primary" : "text-muted",
        )}
      >
        {label}
        {required && " *"}
      </span>
      <ChevronDown
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-7 right-4 size-5 -translate-y-1/2 text-muted transition-transform",
          open && "rotate-180",
        )}
      />

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[0.625rem] border border-foreground/10 bg-white shadow-[0_24px_48px_-20px_rgb(0_0_0/0.35)]">
          <div className="flex items-center gap-2 border-b border-foreground/10 px-3">
            <Search aria-hidden className="size-4 text-muted" />
            <input
              ref={search}
              role="combobox"
              aria-expanded
              aria-controls={`${fid}-list`}
              aria-activedescendant={
                list[active] ? `${fid}-opt-${active}` : undefined
              }
              aria-label="Search countries"
              placeholder="Search countries"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKey}
              className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
          <ul
            id={`${fid}-list`}
            role="listbox"
            aria-label={label}
            className="max-h-64 overflow-y-auto p-1.5"
          >
            {list.length === 0 && (
              <li className="px-3 py-3 text-sm text-muted">
                No country matches “{query}”.
              </li>
            )}
            {list.map((c, i) => (
              <li
                key={c.iso2}
                id={`${fid}-opt-${i}`}
                role="option"
                aria-selected={c.iso2 === value}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => pick(c)}
                onPointerMove={() => setActive(i)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[0.375rem] px-2.5 py-2 text-sm text-foreground",
                  i === active && "bg-accent",
                )}
              >
                <Flag code={c.iso2} />
                <span className="flex-1 truncate">{c.name}</span>
                {c.iso2 === value && (
                  <Check aria-hidden className="size-4 text-primary" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p
          id={`${fid}-msg`}
          className="mt-1.5 px-1 text-[0.8125rem] text-primary"
        >
          {error}
        </p>
      )}
    </div>
  );
}
