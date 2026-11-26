"use client";

import { ArrowRight, CircleCheck, Mail } from "lucide-react";
import { useId, useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const topics = [
  "General question",
  "Partnership",
  "Press and media",
  "A project in my community",
  "Help with the app",
] as const;

type Field = "name" | "email" | "message";

/**
 * The contact form. There is no mail service behind the site yet, so on
 * "Send" it checks the fields, then opens the visitor's own email app with
 * the message written out to the team's address (subject and body filled
 * in). The form says so, and the address is shown to copy if no email app
 * opens. Swap `send` for a server action when a mail service is added.
 */
export function ContactForm() {
  const uid = useId();
  const [topic, setTopic] = useState<(typeof topics)[number]>(topics[0]);
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const id = (f: string) => `${uid}-${f}`;

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) e.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      e.email = "Please add a valid email address.";
    if (values.message.trim().length < 10)
      e.message = "Please write a little more (at least 10 characters).";
    setErrors(e);
    return e;
  }

  function send(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    const first = (Object.keys(e) as Field[])[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    const subject = `${topic}: message from ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n—\n${values.name.trim()}\n${values.email.trim()}`;
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const input =
    "mt-2 block w-full rounded-[0.3125rem] border bg-white px-4 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-primary focus:shadow-[0_0_0_3px_rgb(211_0_15/0.15)]";

  if (sent) {
    return (
      <div
        className="flex min-h-[26rem] flex-col items-start justify-center"
        role="status"
      >
        <span className="grid size-14 place-items-center rounded-full bg-[#e3f6ee] text-[#16875f]">
          <CircleCheck aria-hidden className="size-7" />
        </span>
        <h3 className="mt-5 [font-family:Cambria,Georgia,serif] text-[1.75rem]/tight font-medium text-black">
          Your message is ready to send.
        </h3>
        <p className="mt-3 max-w-md text-[0.9375rem]/7 text-muted">
          Your email app should have opened with everything filled in. Press
          send there and it will reach the team. If nothing opened, email us at{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            {siteConfig.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setValues({ name: "", email: "", message: "" });
          }}
          className="mt-6 text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={send} aria-describedby={id("how")}>
      {/* Topic */}
      <fieldset>
        <legend className="text-sm font-semibold text-foreground">
          What is it about?
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label
              key={t}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40",
                topic === t
                  ? "border-primary bg-primary text-white"
                  : "border-foreground/15 text-foreground hover:border-foreground/40",
              )}
            >
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {(
          [
            ["name", "Your name", "text", "name", "Amina Bello"],
            ["email", "Email address", "email", "email", "you@example.com"],
          ] as const
        ).map(([f, label, type, auto, ph]) => (
          <div key={f}>
            <label
              htmlFor={id(f)}
              className="text-sm font-semibold text-foreground"
            >
              {label}
            </label>
            <input
              id={id(f)}
              type={type}
              autoComplete={auto}
              placeholder={ph}
              value={values[f]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f]: e.target.value }))
              }
              onBlur={() => errors[f] && validate()}
              aria-invalid={!!errors[f]}
              aria-describedby={errors[f] ? id(`${f}-err`) : undefined}
              className={cn(
                input,
                "h-12",
                errors[f] ? "border-primary" : "border-foreground/15",
              )}
            />
            {errors[f] && (
              <p
                id={id(`${f}-err`)}
                className="mt-1.5 text-[0.8125rem] text-primary"
              >
                {errors[f]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={id("message")}
            className="text-sm font-semibold text-foreground"
          >
            Message
          </label>
          <span className="text-xs text-muted tabular-nums">
            {values.message.length} / 2000
          </span>
        </div>
        <textarea
          id={id("message")}
          rows={6}
          maxLength={2000}
          placeholder="Tell us what you need, or about the project you want to follow."
          value={values.message}
          onChange={(e) =>
            setValues((v) => ({ ...v, message: e.target.value }))
          }
          onBlur={() => errors.message && validate()}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? id("message-err") : undefined}
          className={cn(
            input,
            "resize-y py-3 leading-7",
            errors.message ? "border-primary" : "border-foreground/15",
          )}
        />
        {errors.message && (
          <p
            id={id("message-err")}
            className="mt-1.5 text-[0.8125rem] text-primary"
          >
            {errors.message}
          </p>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          id={id("how")}
          className="flex items-start gap-2 text-[0.8125rem]/5 text-muted sm:max-w-xs"
        >
          <Mail aria-hidden className="mt-0.5 size-4 shrink-0" />
          Sending opens your email app with this message ready to go to{" "}
          {siteConfig.email}.
        </p>
        <button
          type="submit"
          className="btn-sweep inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-[0.3125rem] bg-primary px-7 text-base font-semibold text-primary-foreground"
        >
          Send message <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
    </form>
  );
}
