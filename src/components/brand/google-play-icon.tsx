import { cn } from "@/lib/utils";

/** The four-colour Google Play triangle. Keeps its own colours. */
export function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("size-5 shrink-0", className)}>
      <path d="M3.6 1.8 13.8 12 3.6 22.2C3.2 22 3 21.6 3 21.1V2.9c0-.5.2-.9.6-1.1Z" fill="#2196F3" />
      <path d="M13.8 12 16.9 8.9 5.1 2.1c-.5-.3-1.1-.4-1.5-.3L13.8 12Z" fill="#4CAF50" />
      <path d="m16.9 8.9 3.4 2c1.1.6 1.1 1.6 0 2.2l-3.4 2-3.1-3.1 3.1-3.1Z" fill="#FFC107" />
      <path d="M13.8 12 3.6 22.2c.4.1 1 0 1.5-.3l11.8-6.8-3.1-3.1Z" fill="#F44336" />
    </svg>
  );
}
