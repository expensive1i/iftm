import { About } from "@/components/sections/about";
import { Campaigns } from "@/components/sections/campaigns";
import { Hero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { ImpactBand } from "@/components/sections/impact-band";
import { Monitoring } from "@/components/sections/monitoring";
import { Stats } from "@/components/sections/stats";

// Home page order: what it is → impact at a glance → the movement in one
// line → where it works → how it began → what citizens are tracking now →
// what it has achieved (fixed photo band). The footer closes with the app.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Highlights />
      <Monitoring />
      <About />
      <Campaigns />
      <ImpactBand />
    </>
  );
}
