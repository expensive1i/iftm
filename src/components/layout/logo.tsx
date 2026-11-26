import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
        className,
      )}
    >
      <Image
        src="/brand/logo.webp"
        alt={siteConfig.name}
        width={842}
        height={286}
        priority
        className="h-12 w-auto lg:h-[3.75rem]"
      />
    </Link>
  );
}
