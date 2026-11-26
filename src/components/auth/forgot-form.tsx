"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  AuthHeading,
  NotConnected,
  SubmitButton,
} from "@/components/auth/auth-ui";
import { TextField } from "@/components/ui/text-field";

/** Forgot password: the account email, then a note on where to reset it. */
export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  function validate() {
    const e = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? undefined
      : "Please enter the email you signed up with.";
    setError(e);
    return e;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (validate()) return document.getElementById("forgot-email")?.focus();
    setDone(true);
  }

  return (
    <div>
      <AuthHeading title="Forgot your password">
        Enter the email on your account and we’ll help you set a new password.
      </AuthHeading>

      <form noValidate onSubmit={submit} className="mt-9 space-y-5">
        <TextField
          id="forgot-email"
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => error && validate()}
          error={error}
        />
        {done && (
          <NotConnected action="reset your password" path="/forgot-password" />
        )}
        <SubmitButton>Send reset link</SubmitButton>
      </form>

      <p className="mt-8 border-t border-foreground/10 pt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-[0.9375rem] font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          <ChevronLeft aria-hidden className="size-4" /> Back to log in
        </Link>
      </p>
    </div>
  );
}
