import type { ComponentProps, ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section">;

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-24", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-pretty text-muted">{description}</p>
      )}
    </div>
  );
}
