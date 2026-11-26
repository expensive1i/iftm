"use client";

import { Check, ChevronDown, Eye, EyeOff } from "lucide-react";
import { type ComponentProps, type ReactNode, useId, useState } from "react";

import { cn } from "@/lib/utils";

/*
 * The site's form fields, shared by the Contact and auth pages.
 *
 * Floating label: the label sits inside the box and moves up onto the
 * border (in red) when the field is focused or filled. Focus is shown by
 * the border alone, one colour, no glow. Errors turn the border and label
 * red and show a message under the field, linked with aria-describedby.
 */

const BOX =
  "peer block w-full rounded-[0.625rem] border-[1.5px] bg-white px-4 text-[0.9375rem] text-foreground outline-none transition-colors placeholder:text-transparent disabled:cursor-not-allowed disabled:opacity-60";
const BOX_OK =
  "border-foreground/20 hover:border-foreground/35 focus:border-primary";
const BOX_ERR = "border-primary";
const LABEL =
  "pointer-events-none absolute left-3 bg-white px-1 text-[0.9375rem] transition-all duration-200";
const FLOATED =
  "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-semibold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold";

function Message({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: ReactNode;
}) {
  if (error)
    return (
      <p id={`${id}-msg`} className="mt-1.5 px-1 text-[0.8125rem] text-primary">
        {error}
      </p>
    );
  if (hint)
    return (
      <p id={`${id}-msg`} className="mt-1.5 px-1 text-[0.8125rem] text-muted">
        {hint}
      </p>
    );
  return null;
}

type FieldBase = {
  label: string;
  error?: string;
  /** Small help text under the field (hidden while there is an error). */
  hint?: ReactNode;
  /** A control inside the right edge of the box, e.g. a show-password button. */
  trailing?: ReactNode;
  className?: string;
};

export type TextFieldProps = FieldBase &
  Omit<ComponentProps<"input">, "placeholder" | "className">;

/** A one-line text field with a floating label. */
export function TextField({
  label,
  error,
  hint,
  trailing,
  className,
  id,
  required,
  ...props
}: TextFieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      <div className="relative">
        <input
          {...props}
          id={fid}
          required={required}
          placeholder={label}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${fid}-msg` : undefined}
          className={cn(
            BOX,
            "h-14",
            trailing && "pr-12",
            error ? BOX_ERR : BOX_OK,
          )}
        />
        <label
          htmlFor={fid}
          className={cn(
            LABEL,
            "top-1/2 -translate-y-1/2",
            FLOATED,
            error ? "text-primary" : "text-muted peer-focus:text-primary",
          )}
        >
          {label}
          {required && " *"}
        </label>
        {trailing && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {trailing}
          </div>
        )}
      </div>
      <Message id={fid} error={error} hint={hint} />
    </div>
  );
}

export type TextAreaFieldProps = FieldBase &
  Omit<ComponentProps<"textarea">, "placeholder" | "className">;

/** A multi-line text field with a floating label. */
export function TextAreaField({
  label,
  error,
  hint,
  className,
  id,
  required,
  rows = 6,
  ...props
}: TextAreaFieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          {...props}
          id={fid}
          rows={rows}
          required={required}
          placeholder={label}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${fid}-msg` : undefined}
          className={cn(
            BOX,
            "min-h-40 resize-y pt-5 pb-3 leading-7",
            error ? BOX_ERR : BOX_OK,
          )}
        />
        <label
          htmlFor={fid}
          className={cn(
            LABEL,
            "top-[1.15rem]",
            FLOATED,
            error ? "text-primary" : "text-muted peer-focus:text-primary",
          )}
        >
          {label}
          {required && " *"}
        </label>
      </div>
      <Message id={fid} error={error} hint={hint} />
    </div>
  );
}

/** Rough strength score 0–4 for a password. */
function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STRENGTH = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["#d3000f", "#d3000f", "#eda100", "#1baf7a", "#16875f"];

/**
 * A password field with a show/hide button. With `meter`, a four-step
 * strength bar shows under it while typing (for creating a password).
 */
export function PasswordField({
  meter,
  value,
  ...props
}: Omit<TextFieldProps, "type" | "trailing"> & { meter?: boolean }) {
  const [shown, setShown] = useState(false);
  const pw = typeof value === "string" ? value : "";
  const score = strength(pw);
  return (
    <div>
      <TextField
        {...props}
        value={value}
        type={shown ? "text" : "password"}
        trailing={
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:text-foreground"
          >
            {shown ? (
              <EyeOff aria-hidden className="size-5" />
            ) : (
              <Eye aria-hidden className="size-5" />
            )}
          </button>
        }
      />
      {meter && pw.length > 0 && (
        <div className="mt-2 flex items-center gap-3 px-1" aria-live="polite">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded-full bg-foreground/10 transition-colors"
                style={
                  i < score ? { background: STRENGTH_COLOR[score] } : undefined
                }
              />
            ))}
          </div>
          <span className="w-16 text-right text-xs font-medium text-muted">
            {STRENGTH[score]}
          </span>
        </div>
      )}
    </div>
  );
}

export type SelectFieldProps = FieldBase &
  Omit<ComponentProps<"select">, "className"> & {
    options: { value: string; label: string }[];
    /** Shown as the first, empty choice. */
    placeholderOption?: string;
  };

/** A native select styled to match, with its label always on the border. */
export function SelectField({
  label,
  error,
  hint,
  className,
  id,
  required,
  options,
  placeholderOption = "Choose…",
  ...props
}: SelectFieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      <div className="relative">
        <select
          {...props}
          id={fid}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error || hint ? `${fid}-msg` : undefined}
          className={cn(
            BOX,
            "h-14 cursor-pointer appearance-none pr-11",
            error ? BOX_ERR : BOX_OK,
          )}
        >
          <option value="">{placeholderOption}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={fid}
          className={cn(
            LABEL,
            "top-0 -translate-y-1/2 text-xs font-semibold",
            error ? "text-primary" : "text-muted peer-focus:text-primary",
          )}
        >
          {label}
          {required && " *"}
        </label>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted"
        />
      </div>
      <Message id={fid} error={error} hint={hint} />
    </div>
  );
}

/** A checkbox with a custom box and a label that can hold links. */
export function CheckboxField({
  label,
  error,
  className,
  id,
  ...props
}: { label: ReactNode; error?: string; className?: string } & Omit<
  ComponentProps<"input">,
  "type" | "className"
>) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      <label
        htmlFor={fid}
        className="flex cursor-pointer items-start gap-3 text-sm/6 text-foreground"
      >
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            {...props}
            id={fid}
            type="checkbox"
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${fid}-msg` : undefined}
            className={cn(
              "peer size-5 cursor-pointer appearance-none rounded-[0.3125rem] border-[1.5px] bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:border-primary",
              error ? "border-primary" : "border-foreground/25",
            )}
          />
          <Check
            aria-hidden
            className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p
          id={`${fid}-msg`}
          className="mt-1.5 pl-8 text-[0.8125rem] text-primary"
        >
          {error}
        </p>
      )}
    </div>
  );
}
