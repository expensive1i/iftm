import { WriteOn } from "@/components/ui/write-on";
import { Container } from "@/components/ui/container";

/**
 * About CODE: the organisation behind Follow The Money, in one full-width
 * column (title and text), on a light band
 * (so it stays apart from the dark photo band that follows) with a faint
 * brand gear at the right edge. Copy from the current ifollowthemoney.org About page.
 */
export function AboutCode() {
  return (
    <section
      aria-labelledby="code-title"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Large brand gear, faint, at the right edge */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/motif-gear-red.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-40 -z-10 hidden size-[34rem] -translate-y-1/2 opacity-[0.06] lg:block"
      />

      <Container className="py-20 sm:py-24 lg:max-w-[80rem] lg:py-28">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">The team behind it</p>
          <WriteOn
            id="code-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance text-black sm:text-[2.75rem]/[3.375rem]"
            text="An initiative of Connected Development (CODE)."
          />
          <p lang="en" className="mt-6 text-base/[1.8rem] text-justify hyphens-manual text-muted sm:text-lg/8">
            {"CODE gives mar­gin­alised com­mu­ni­ties in Af­rica the means to am­plify " +
              "their voices, get in­for­ma­tion and hold gov­ern­ments to ac­count for " +
              "con­stituency proj­ects. Fol­low The Money is its ac­tion-ad­vo­cacy " +
              "ini­tia­tive, track­ing gov­ern­ment and in­ter­na­tional aid funds " +
              "in grass­roots com­mu­ni­ties."}
          </p>
        </div>
      </Container>
    </section>
  );
}
