"use client";

import { ChevronRight, CircleCheck } from "lucide-react";
import { useId, useState } from "react";

import { TextAreaField, TextField } from "@/components/ui/text-field";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const topics = [
  "General question",
  "Partnership",
  "Press and media",
  "A project in my community",
  "Help with the app",
] as const;

type Field = "first" | "last" | "email" | "message";

/**
 * The contact form. There is no mail service behind the site yet, so on
 * "Send" it checks the fields, then opens the visitor's own email app with
 * the message written out to the team's address (subject and body filled
 * in). The form says so, and the address is shown if no email app opens.
 * Swap `send` for a server action when a mail service is added.
 */
export function ContactForm() {
  const uid = useId();
  const [topic, setTopic] = useState<(typeof topics)[number]>(topics[0]);
  const [values, setValues] = useState({
    first: "",
    last: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const id = (f: string) => `${uid}-${f}`;
  const set =
    (f: Field) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((s) => ({ ...s, [f]: e.target.value }));

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!values.first.trim()) e.first = "Please add your first name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      e.email = "Please add a valid email address.";
    if (values.message.trim().length < 10)
      e.message = "Please write a little more (at least 10 characters).";
    setErrors(e);
    return e;
  }
  const recheck = (f: Field) => () => {
    if (errors[f]) validate();
  };

  function send(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    const first = (["first", "email", "message"] as Field[]).find((f) => e[f]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    const name = `${values.first.trim()} ${values.last.trim()}`.trim();
    const subject = `${topic}: message from ${name}`;
    const body = `${values.message.trim()}\n\n—\n${name}\n${values.email.trim()}`;
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div
        className="flex min-h-[24rem] flex-col items-start justify-center"
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
            setValues({ first: "", last: "", email: "", message: "" });
          }}
          className="mt-6 text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={send}
      aria-describedby={id("how")}
      className="space-y-6"
    >
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
                "cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:border-primary",
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

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
        <TextField
          id={id("first")}
          label="First name"
          required
          autoComplete="given-name"
          value={values.first}
          onChange={set("first")}
          onBlur={recheck("first")}
          error={errors.first}
        />
        <TextField
          id={id("last")}
          label="Last name"
          autoComplete="family-name"
          value={values.last}
          onChange={set("last")}
        />
      </div>
      <TextField
        id={id("email")}
        label="Email address"
        type="email"
        required
        autoComplete="email"
        value={values.email}
        onChange={set("email")}
        onBlur={recheck("email")}
        error={errors.email}
      />
      <div>
        <TextAreaField
          id={id("message")}
          label="Your message"
          maxLength={2000}
          required
          value={values.message}
          onChange={set("message")}
          onBlur={recheck("message")}
          error={errors.message}
        />
        <p className="mt-1.5 px-1 text-right text-xs text-muted tabular-nums">
          {values.message.length} / 2000
        </p>
      </div>

      {/* The note runs the full width; the button sits on its own line */}
      <div className="space-y-5 pt-1">
        <p id={id("how")} className="text-[0.875rem]/6 text-muted">
          Sending opens your email app with this message ready to go to{" "}
          <span className="font-semibold text-foreground">
            {siteConfig.email}
          </span>
          .
        </p>
        <button
          type="submit"
          className="btn-sweep inline-flex h-13 w-full items-center justify-center gap-1.5 rounded-[0.3125rem] bg-primary pr-5 pl-7 text-base font-semibold text-primary-foreground sm:w-auto"
        >
          Send message <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </form>
  );
}
