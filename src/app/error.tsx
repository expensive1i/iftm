"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-4 text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <Button className="mt-8" onClick={() => retry()}>
        Try again
      </Button>
    </Container>
  );
}
