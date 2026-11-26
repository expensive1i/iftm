import type { Metadata } from "next";

import { AboutBanner } from "@/components/about/about-banner";
import { AboutCode } from "@/components/about/about-code";
import { JoinBand } from "@/components/about/join-band";
import { Results } from "@/components/about/results";
import { StoryTimeline } from "@/components/about/story-timeline";
import { WhoWeAre } from "@/components/about/who-we-are";
import { Stats } from "@/components/sections/stats";

export const metadata: Metadata = {
  title: "About",
  description:
    "Follow The Money is Africa’s largest citizen-led accountability movement, an initiative of Connected Development (CODE).",
};

// About page order: who we are at a glance → impact numbers → the people in
// the network → how it began → what it has delivered → CODE → join us.
export default function AboutPage() {
  return (
    <>
      <AboutBanner />
      <Stats />
      <WhoWeAre />
      <StoryTimeline />
      <Results />
      <AboutCode />
      <JoinBand />
    </>
  );
}
