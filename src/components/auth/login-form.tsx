"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AuthHeading,
  NotConnected,
  SubmitButton,
} from "@/components/auth/auth-ui";
import {
  CheckboxField,
  PasswordField,
  TextField,
} from "@/components/ui/text-field";

type Errors = Partial<Record<"login" | "password", string>>;

/** Log in: email or phone, password, remember me, forgot password. */
export function LoginForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  function validate() {
    const e: Errors = {};
    const v = login.trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const phone = /^\+?[\d\s()-]{7,}$/.test(v);
    if (!v) e.login = "Please enter your email or phone number.";
    else if (!email && !phone)
      e.login = "That doesn’t look like an email or phone number.";
    if (!password) e.password = "Please enter your password.";
    setErrors(e);
    return e;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (e.login) return document.getElementById("login")?.focus();
    if (e.password) return document.getElementById("password")?.focus();
    setDone(true);
  }

  return (
    <div>
      <AuthHeading title="Welcome back">
        Log in to pick up where you left off.
      </AuthHeading>

      <form noValidate onSubmit={submit} className="mt-9 space-y-5">
        <TextField
          id="login"
          label="Email or phone"
          autoComplete="username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          onBlur={() => errors.login && validate()}
          error={errors.login}
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => errors.password && validate()}
          error={errors.password}
        />
        <div className="flex items-center justify-between gap-4">
          <CheckboxField label="Remember me" name="remember" />
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {done && <NotConnected action="log in" path="/login" />}
        <SubmitButton>Log in</SubmitButton>
      </form>

      <p className="mt-8 border-t border-foreground/10 pt-6 text-center text-[0.9375rem] text-muted">
        New to iFollowTheMoney?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
