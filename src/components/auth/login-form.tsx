"use client";

import { LoaderCircle, Lock, Mail, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { AuthHeading, NotConnected } from "@/components/auth/auth-ui";
import {
  CheckboxField,
  PasswordField,
  TextField,
} from "@/components/ui/text-field";

type Errors = Partial<Record<"login" | "password", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[\d\s()-]{7,}$/;

/** "Good morning / afternoon / evening", from the visitor's own clock. */
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
const noSubscribe = () => () => {};

/** Each block rises in a little after the one before it. */
const rise = (i: number) => ({
  className: "ftm-rise",
  style: { animationDelay: `${i * 70}ms` },
});

/**
 * Log in: email or phone (the icon in the field follows what you type),
 * password (with show/hide and a Caps Lock note), remember me, forgot
 * password. The heading greets by time of day; the server renders "Welcome
 * back" and the browser swaps in the greeting, so nothing reads the clock
 * during prerender.
 */
export function LoginForm() {
  const hello = useSyncExternalStore(
    noSubscribe,
    greeting,
    () => "Welcome back",
  );
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const v = login.trim();
  const looksLikePhone = /^[+\d\s()-]+$/.test(v) && /\d/.test(v);

  function validate() {
    const e: Errors = {};
    if (!v) e.login = "Please enter your email or phone number.";
    else if (!EMAIL.test(v) && !PHONE.test(v))
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
    setBusy(true);
    setDone(false);
    window.setTimeout(() => {
      setBusy(false);
      setDone(true);
    }, 600);
  }

  return (
    <div>
      <div {...rise(0)}>
        <AuthHeading title={hello}>
          Welcome back. Log in to pick up where you left off.
        </AuthHeading>
      </div>

      <form noValidate onSubmit={submit} className="mt-9 space-y-5">
        <div {...rise(1)}>
          <TextField
            id="login"
            label="Email or phone"
            autoComplete="username"
            inputMode={looksLikePhone ? "tel" : "email"}
            leading={looksLikePhone ? <Smartphone /> : <Mail />}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            onBlur={() => errors.login && validate()}
            error={errors.login}
          />
        </div>
        <div {...rise(2)}>
          <PasswordField
            id="password"
            label="Password"
            autoComplete="current-password"
            leading={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => errors.password && validate()}
            error={errors.password}
          />
        </div>
        <div
          {...rise(3)}
          className="ftm-rise flex items-center justify-between gap-4"
        >
          <CheckboxField label="Remember me" name="remember" />
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {done && <NotConnected action="log in" path="/login" />}
        <div {...rise(4)}>
          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="btn-sweep inline-flex h-13 w-full items-center justify-center gap-2 rounded-[0.625rem] bg-primary text-base font-semibold text-primary-foreground disabled:cursor-progress disabled:opacity-90"
          >
            {busy ? (
              <>
                <LoaderCircle aria-hidden className="size-5 animate-spin" />{" "}
                Checking…
              </>
            ) : (
              "Log in"
            )}
          </button>
        </div>
      </form>

      <p
        {...rise(5)}
        className="ftm-rise mt-8 border-t border-foreground/10 pt-6 text-center text-[0.9375rem] text-muted"
      >
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
