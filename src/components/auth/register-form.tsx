"use client";

import { Camera, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AuthHeading, NotConnected } from "@/components/auth/auth-ui";
import { OfficeIcon, PeopleIcon } from "@/components/contact/contact-icons";
import { CountryField } from "@/components/ui/country-field";
import {
  CheckboxField,
  PasswordField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/text-field";
import { languages } from "@/config/navigation";
import { cn } from "@/lib/utils";

/*
 * Create an account in four steps, following the platform's own sign-up
 * (ifollowthemoney.org/register): account type → your details → where you
 * are → secure your account. Each step checks its own fields before moving
 * on; Back keeps what was entered. A stepper at the top shows progress: a
 * red line fills between the steps and finished steps get a tick.
 */

const STEPS = [
  {
    title: "Account",
    heading: "Choose your account",
    line: "Are you joining as yourself or for an organisation?",
  },
  {
    title: "Details",
    heading: "Tell us about you",
    line: "This is how others will see you on iFollowTheMoney.",
  },
  {
    title: "Location",
    heading: "Where are you?",
    line: "So we can show you the projects and campaigns near you.",
  },
  {
    title: "Security",
    heading: "Secure your account",
    line: "Choose a strong password to protect your account.",
  },
];

const ORG_TYPES = [
  "Non-governmental organisation",
  "Community-based organisation",
  "Media",
  "Academic or research",
  "Government agency",
  "Other",
].map((t) => ({ value: t, label: t }));

const LANGS = languages.map((l) => ({ value: l.code, label: l.label }));

type Kind = "personal" | "organisation";
type Values = {
  kind: Kind | "";
  first: string;
  last: string;
  org: string;
  orgType: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  region: string;
  district: string;
  language: string;
  password: string;
  confirm: string;
  bio: string;
  terms: boolean;
};
type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(step: number, v: Values): Errors {
  const e: Errors = {};
  if (step === 0 && !v.kind) e.kind = "Please choose an account type.";
  if (step === 1) {
    if (v.kind === "organisation") {
      if (!v.org.trim()) e.org = "Please add the organisation’s name.";
      if (!v.orgType) e.orgType = "Please choose a type.";
    }
    if (!v.first.trim()) e.first = "Please add your first name.";
    if (!v.last.trim()) e.last = "Please add your last name.";
    if (!EMAIL.test(v.email.trim()))
      e.email = "Please add a valid email address.";
    if (v.kind === "personal" && !v.gender) e.gender = "Please choose one.";
  }
  if (step === 2) {
    if (!v.country) e.country = "Please choose your country.";
    if (!v.region.trim()) e.region = "Please add your state or region.";
    if (!v.district.trim()) e.district = "Please add your district or LGA.";
    if (!v.language) e.language = "Please choose a language.";
  }
  if (step === 3) {
    if (v.password.length < 8) e.password = "Use at least 8 characters.";
    if (!v.confirm || v.confirm !== v.password)
      e.confirm = "The passwords don’t match.";
    if (!v.terms) e.terms = "Please accept the terms to continue.";
  }
  return e;
}

export function RegisterForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [photo, setPhoto] = useState<string | null>(null);
  const [v, setV] = useState<Values>({
    kind: "",
    first: "",
    last: "",
    org: "",
    orgType: "",
    email: "",
    phone: "",
    gender: "",
    country: "NG",
    region: "",
    district: "",
    language: "en",
    password: "",
    confirm: "",
    bio: "",
    terms: false,
  });
  const top = useRef<HTMLDivElement>(null);

  // Free the photo preview when it changes or the form unmounts
  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo);
    },
    [photo],
  );

  const put = <K extends keyof Values>(k: K, value: Values[K]) => {
    setV((s) => ({ ...s, [k]: value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const text =
    (k: keyof Values) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      put(k, e.target.value as never);

  function next(ev: React.FormEvent) {
    ev.preventDefault();
    const e = check(step, v);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      document
        .querySelector<HTMLElement>(
          `[data-field="${first}"] input, [data-field="${first}"] select, [data-field="${first}"] button`,
        )
        ?.focus();
      return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setDone(true);
    }
  }

  const s = STEPS[step];

  return (
    <div ref={top} className="scroll-mt-6">
      {/* Stepper */}
      <ol className="mb-9 flex items-center" aria-label="Sign-up steps">
        {STEPS.map((st, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li
              key={st.title}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  aria-current={state === "current" ? "step" : undefined}
                  className={cn(
                    "grid size-9 place-items-center rounded-full text-sm font-bold transition-all duration-300",
                    state === "done" && "bg-primary text-white",
                    state === "current" &&
                      "bg-primary text-white shadow-[0_0_0_5px_rgb(211_0_15/0.15)]",
                    state === "todo" &&
                      "border-[1.5px] border-foreground/20 bg-white text-muted",
                  )}
                >
                  {state === "done" ? (
                    <Check aria-hidden className="size-4" strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-[0.6875rem] font-semibold tracking-wide",
                    state === "todo" ? "text-muted" : "text-foreground",
                  )}
                >
                  {st.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="mx-1.5 mb-5 h-[3px] flex-1 overflow-hidden rounded-full bg-foreground/10"
                >
                  <span
                    className="block h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                    style={{ width: i < step ? "100%" : "0%" }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
        Step {step + 1} of {STEPS.length}
      </p>
      <div className="mt-2">
        <AuthHeading title={s.heading}>{s.line}</AuthHeading>
      </div>

      <form noValidate onSubmit={next} className="mt-8">
        <div key={step} className="ftm-rise space-y-5">
          {/* 1 — account type */}
          {step === 0 && (
            <div
              data-field="kind"
              role="radiogroup"
              aria-label="Account type"
              className="grid gap-3 sm:grid-cols-2"
            >
              {(
                [
                  [
                    "personal",
                    "Personal",
                    "For citizens tracking projects themselves.",
                    PeopleIcon,
                  ],
                  [
                    "organisation",
                    "Organisation",
                    "For NGOs, media and community groups.",
                    OfficeIcon,
                  ],
                ] as const
              ).map(([key, label, line, Icon]) => {
                const on = v.kind === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => put("kind", key)}
                    className={cn(
                      "relative rounded-[0.75rem] border-[1.5px] p-5 text-left transition-[border-color,box-shadow,transform] duration-200",
                      on
                        ? "border-primary bg-[#FFF7F7] shadow-[4px_5px_0_var(--primary-deep)]"
                        : "border-foreground/15 bg-white hover:-translate-y-0.5 hover:border-foreground/35",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-4 right-4 grid size-5 place-items-center rounded-full border-[1.5px] transition-colors",
                        on
                          ? "border-primary bg-primary text-white"
                          : "border-foreground/25",
                      )}
                    >
                      {on && (
                        <Check
                          aria-hidden
                          className="size-3"
                          strokeWidth={3.5}
                        />
                      )}
                    </span>
                    <Icon className="size-12" />
                    <span className="mt-4 block text-base font-semibold text-foreground">
                      {label}
                    </span>
                    <span className="mt-1 block text-sm/5 text-muted">
                      {line}
                    </span>
                  </button>
                );
              })}
              {errors.kind && (
                <p className="text-[0.8125rem] text-primary sm:col-span-2">
                  {errors.kind}
                </p>
              )}
            </div>
          )}

          {/* 2 — details */}
          {step === 1 && (
            <>
              {/* Optional profile photo with a round preview */}
              <label className="group flex cursor-pointer items-center gap-4">
                <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border-[1.5px] border-dashed border-foreground/25 bg-white transition-colors group-hover:border-primary">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt="Your photo"
                      className="size-full object-cover"
                    />
                  ) : (
                    <Camera
                      aria-hidden
                      className="size-6 text-muted group-hover:text-primary"
                    />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {photo ? "Change photo" : "Add a profile photo"}
                  </span>
                  <span className="block text-xs text-muted">
                    Optional. JPG or PNG.
                  </span>
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPhoto(URL.createObjectURL(f));
                  }}
                />
              </label>

              {v.kind === "organisation" && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div data-field="org">
                    <TextField
                      label="Organisation name"
                      required
                      value={v.org}
                      onChange={text("org")}
                      error={errors.org}
                    />
                  </div>
                  <div data-field="orgType">
                    <SelectField
                      label="Organisation type"
                      required
                      options={ORG_TYPES}
                      placeholderOption="Choose a type"
                      value={v.orgType}
                      onChange={text("orgType")}
                      error={errors.orgType}
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <div data-field="first">
                  <TextField
                    label={
                      v.kind === "organisation"
                        ? "Contact first name"
                        : "First name"
                    }
                    required
                    autoComplete="given-name"
                    value={v.first}
                    onChange={text("first")}
                    error={errors.first}
                  />
                </div>
                <div data-field="last">
                  <TextField
                    label={
                      v.kind === "organisation"
                        ? "Contact last name"
                        : "Last name"
                    }
                    required
                    autoComplete="family-name"
                    value={v.last}
                    onChange={text("last")}
                    error={errors.last}
                  />
                </div>
              </div>
              <div data-field="email">
                <TextField
                  label="Email address"
                  type="email"
                  required
                  autoComplete="email"
                  value={v.email}
                  onChange={text("email")}
                  error={errors.email}
                />
              </div>
              <TextField
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
                value={v.phone}
                onChange={text("phone")}
              />
              {v.kind === "personal" && (
                <fieldset data-field="gender">
                  <legend className="text-sm font-semibold text-foreground">
                    Gender *
                  </legend>
                  <div className="mt-2.5 flex gap-2">
                    {["Female", "Male"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        aria-pressed={v.gender === g}
                        onClick={() => put("gender", g)}
                        className={cn(
                          "h-11 flex-1 rounded-[0.625rem] border-[1.5px] text-sm font-semibold transition-colors",
                          v.gender === g
                            ? "border-primary bg-primary text-white"
                            : "border-foreground/20 text-foreground hover:border-foreground/40",
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="mt-1.5 px-1 text-[0.8125rem] text-primary">
                      {errors.gender}
                    </p>
                  )}
                </fieldset>
              )}
            </>
          )}

          {/* 3 — location */}
          {step === 2 && (
            <>
              <div data-field="country">
                <CountryField
                  label="Country"
                  required
                  value={v.country}
                  onChange={(c) => put("country", c)}
                  error={errors.country}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div data-field="region">
                  <TextField
                    label="State or region"
                    required
                    value={v.region}
                    onChange={text("region")}
                    error={errors.region}
                  />
                </div>
                <div data-field="district">
                  <TextField
                    label="District or LGA"
                    required
                    value={v.district}
                    onChange={text("district")}
                    error={errors.district}
                  />
                </div>
              </div>
              <div data-field="language">
                <SelectField
                  label="Language"
                  required
                  options={LANGS}
                  value={v.language}
                  onChange={text("language")}
                  error={errors.language}
                />
              </div>
            </>
          )}

          {/* 4 — security */}
          {step === 3 && (
            <>
              <div data-field="password">
                <PasswordField
                  label="Password"
                  required
                  meter
                  autoComplete="new-password"
                  value={v.password}
                  onChange={text("password")}
                  error={errors.password}
                  hint="At least 8 characters. A mix of letters, numbers and symbols is stronger."
                />
              </div>
              <div data-field="confirm">
                <PasswordField
                  label="Confirm password"
                  required
                  autoComplete="new-password"
                  value={v.confirm}
                  onChange={text("confirm")}
                  error={errors.confirm}
                />
              </div>
              <TextAreaField
                label={
                  v.kind === "organisation"
                    ? "About the organisation (optional)"
                    : "A short profile (optional)"
                }
                rows={3}
                maxLength={500}
                value={v.bio}
                onChange={text("bio")}
              />
              <div data-field="terms">
                <CheckboxField
                  checked={v.terms}
                  onChange={(e) => put("terms", e.target.checked)}
                  error={errors.terms}
                  label={
                    <>
                      I accept the{" "}
                      <Link
                        href="/terms"
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        privacy policy
                      </Link>
                      .
                    </>
                  }
                />
              </div>
              {done && (
                <NotConnected action="create your account" path="/register" />
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setDone(false);
                setStep((x) => x - 1);
              }}
              className="inline-flex h-13 items-center gap-1 rounded-[0.625rem] border-[1.5px] border-foreground/20 bg-white pr-5 pl-3.5 text-base font-semibold text-foreground transition-colors hover:border-foreground/45"
            >
              <ChevronLeft aria-hidden className="size-5" /> Back
            </button>
          )}
          <button
            type="submit"
            className="btn-sweep inline-flex h-13 flex-1 items-center justify-center gap-1.5 rounded-[0.625rem] bg-primary text-base font-semibold text-primary-foreground"
          >
            {step < STEPS.length - 1 ? "Continue" : "Create account"}
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </form>

      <p className="mt-8 border-t border-foreground/10 pt-6 text-center text-[0.9375rem] text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
