import { Container } from "@/components/ui/container";

const facts = [
  { label: "Founded", value: "2012" },
  { label: "Type", value: "Non-governmental organisation" },
  { label: "Approach", value: "Mobile and web tools that close the feedback loop between citizens and government" },
];

/**
 * About CODE: the organisation behind Follow The Money, on a dark band with
 * the brand gear. Copy from the current ifollowthemoney.org About page.
 */
export function AboutCode() {
  return (
    <section
      aria-labelledby="code-title"
      className="relative isolate overflow-hidden bg-[linear-gradient(120deg,#141414_0%,#1c1c1c_55%,#3a0005_100%)] text-white"
    >
      {/* Large brand gear, faint, at the right edge */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/motif-gear-red.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-40 -z-10 hidden size-[34rem] -translate-y-1/2 opacity-[0.12] lg:block"
      />

      <Container className="grid gap-12 py-20 sm:py-24 lg:max-w-[80rem] lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-28">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white/55 uppercase">The team behind it</p>
          <h2
            id="code-title"
            className="mt-4 [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance sm:text-[2.75rem]/[3.375rem]"
          >
            An initiative of Connected Development (CODE).
          </h2>
          <p lang="en" className="mt-6 max-w-xl text-base/[1.8rem] text-justify hyphens-manual text-white/70 sm:text-lg/8">
            {"CODE gives mar­gin­alised com­mu­ni­ties in Af­rica the means to am­plify " +
              "their voices, get in­for­ma­tion and hold gov­ern­ments to ac­count for " +
              "con­stituency proj­ects. Fol­low The Money is its ac­tion-ad­vo­cacy " +
              "ini­tia­tive, track­ing gov­ern­ment and in­ter­na­tional aid funds " +
              "in grass­roots com­mu­ni­ties."}
          </p>
        </div>

        <dl className="self-center rounded-[1rem] border border-white/10 bg-white/[0.04]">
          {facts.map((f, i) => (
            <div key={f.label} className={`px-6 py-5 sm:px-7 ${i > 0 ? "border-t border-white/10" : ""}`}>
              <dt className="text-xs font-semibold tracking-[0.16em] text-[#ff6b73] uppercase">{f.label}</dt>
              <dd className="mt-1.5 text-[1.0625rem]/7 text-white/90">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
