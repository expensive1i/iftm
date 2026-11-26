import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-sm font-semibold text-primary">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-muted">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Back to home
      </Link>
    </Container>
  );
}
