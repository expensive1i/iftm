import { FlagIcon } from "@/components/sections/flag-icon";
import { Globe } from "@/components/sections/globe";
import { mapCountries } from "@/components/sections/map-countries";

const SHOWN = 7; // flags in the stack
const TOTAL_COUNTRIES = 54; // "54+ countries" from the current site
import { Container } from "@/components/ui/container";

/**
 * The globe does the talking (after the pxxl.app hero): a dotted globe
 * facing Africa fills the section, with only a short title at the
 * bottom-left edge.
 */
export function Monitoring() {
  return (
    <section
      aria-labelledby="monitoring-title"
      className="relative isolate flex h-[min(calc(100svh-4.5rem),40rem)] min-h-[32rem] items-end overflow-hidden bg-[linear-gradient(to_bottom,#0c0c0c_45%,#170204_85%,#22030a)] text-white lg:h-[min(calc(100svh-5.5rem),52rem)] lg:min-h-[36rem]"
    >
      <Globe className="absolute inset-0 -z-10" />

      {/* Fade the globe out toward the right edge and along the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_left,#0c0c0c_0%,rgb(12_12_12/0.85)_12%,transparent_45%),linear-gradient(to_bottom,#0c0c0c_0%,transparent_18%)]"
      />

      {/* Darken the bottom-left so the title reads over the globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_28rem_at_0%_100%,rgb(20_2_4/0.75)_25%,transparent_75%)]"
      />

      <Container className="pointer-events-none flex flex-col gap-8 pb-14 sm:pb-16 lg:max-w-[80rem] lg:flex-row lg:items-end lg:justify-between lg:pb-20">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-white/55 uppercase">
            Across Africa
          </p>
          <h2
            id="monitoring-title"
            className="mt-3 max-w-[16ch] [font-family:Cambria,Georgia,serif] text-[2.25rem]/[2.75rem] font-medium text-balance sm:text-[2.75rem]/[3.25rem] lg:text-[3.25rem]/[3.75rem]"
          >
            Watching public money, country by country.
          </h2>
        </div>

        {/* Bottom-right row of flags, like pxxl's logo row */}
        <div className="lg:text-right">
          <p className="text-[0.8125rem] text-white/50">Trackers reporting from</p>
          {/* Overlapping stack, then a "+N" chip for the rest of the 54+ countries */}
          <ul className="mt-3 flex items-center -space-x-2 lg:justify-end">
            {mapCountries.slice(0, SHOWN).map((c) => (
              <li key={c.code} title={c.name}>
                <FlagIcon flag={c.flag} className="size-8 rounded-full ring-[3px] ring-[#1d0306]" />
                <span className="sr-only">{c.name}</span>
              </li>
            ))}
            <li className="grid h-8 min-w-8 place-items-center rounded-full bg-white/10 px-2.5 text-[0.8125rem] font-semibold text-white ring-[3px] ring-[#1d0306] backdrop-blur">
              +{TOTAL_COUNTRIES - SHOWN}
              <span className="sr-only"> more countries</span>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
