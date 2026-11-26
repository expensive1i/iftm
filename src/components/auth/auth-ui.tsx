import { ChevronRight, Info } from "lucide-react";
import type { ReactNode } from "react";

/*
 * Small shared pieces for the auth forms.
 *
 * Accounts live on the current ifollowthemoney.org platform and this site
 * has no sign-in service of its own yet, so after a form checks its fields
 * it shows <NotConnected>, which says so and links to the same step on the
 * platform. Replace that with the real call when the API is connected.
 */
export const PLATFORM = "https://ifollowthemoney.org";

/** "Welcome back." with the brand red full stop, and a line under it. */
export function AuthHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <h1 className="[font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-black sm:text-[2.5rem]/[3rem]">
        {title}
        <span className="text-primary">.</span>
      </h1>
      {children && (
        <p className="mt-2 text-[0.9375rem]/7 text-muted">{children}</p>
      )}
    </div>
  );
}

/** The full-width red submit button with a chevron. */
export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="btn-sweep inline-flex h-13 w-full items-center justify-center gap-1.5 rounded-[0.625rem] bg-primary text-base font-semibold text-primary-foreground"
    >
      {children}
      <ChevronRight aria-hidden className="size-5" />
    </button>
  );
}

/** Shown after a valid submit while this site is not connected to accounts. */
export function NotConnected({
  action,
  path,
}: {
  action: string;
  path: string;
}) {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-[0.625rem] border-[1.5px] border-[#eda100]/50 bg-[#FFF8E6] p-4 text-sm/6"
    >
      <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-[#b07800]" />
      <p className="text-foreground">
        Accounts aren’t connected to this new site yet. For now, {action} on the
        current platform:{" "}
        <a
          href={`${PLATFORM}${path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          ifollowthemoney.org{path}
        </a>
      </p>
    </div>
  );
}

/** A thin line with a word in the middle. */
export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted">
      <span className="h-px flex-1 bg-foreground/10" />
      {children}
      <span className="h-px flex-1 bg-foreground/10" />
    </div>
  );
}
