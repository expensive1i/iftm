/** Money in a country's currency, compact: "₦65M", "FCFA 1.2M", "KSh 950K". */
export function money(value: number, currency: string, compact = true) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 0,
    }).format(value);
  } catch {
    // Unknown currency code: fall back to "CODE 1.2M"
    const n = new Intl.NumberFormat("en", {
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 0,
    }).format(value);
    return currency ? `${currency} ${n}` : n;
  }
}

/** A plain count: 1,284 / 12.9K. */
export function count(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

/** "Nov 2026" */
export function monthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "3 Dec 2024" */
export function day(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Share as a whole percent, never NaN: 0–100. */
export function pct(part: number, whole: number) {
  if (!whole) return 0;
  return Math.max(0, Math.min(100, Math.round((part / whole) * 100)));
}
