import type { Metadata } from "next";

import { AnalyticsBanner } from "@/components/analytics/analytics-banner";
import { AnalyticsDashboard } from "@/components/analytics/dashboard";
import { JoinBand } from "@/components/about/join-band";
import { type CountryAnalytics, getCountryAnalytics, getOverview, type Overview } from "@/lib/analytics/data";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Live figures from citizen campaigns on iFollowTheMoney: campaigns, budgets and spending tracked in 54 African countries.",
};

/*
 * The page opens on the country with the most campaigns, read on the
 * server from the cached data layer (src/lib/analytics/data.ts). If the
 * platform does not answer, the dashboard still renders and loads in the
 * browser instead.
 */
export default async function AnalyticsPage() {
  let overview: Overview | null = null;
  let initial: CountryAnalytics | null = null;
  try {
    overview = await getOverview();
    const busiest = Number(Object.entries(overview.counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 1);
    initial = await getCountryAnalytics(busiest);
  } catch {
    // Leave it to the dashboard to load (and show a retry if it fails)
  }

  return (
    <>
      <AnalyticsBanner />
      <AnalyticsDashboard overview={overview} initial={initial} />
      <JoinBand />
    </>
  );
}
