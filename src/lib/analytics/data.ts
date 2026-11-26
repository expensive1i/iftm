import { cacheLife } from "next/cache";

/*
 * Analytics data from the live ifollowthemoney.org API, read on the server
 * and cached for a few minutes (`use cache`, "minutes" profile), so visitors
 * never wait on the platform and it is not called on every page view.
 *
 * Only campaign-level fields are kept: no author or other personal details
 * leave this file.
 *
 *   /api/v1/data/campaign-summary?country_id=  totals for one country
 *   /api/v1/campaigns?country_id=&page=        the campaigns, 10 a page
 */

const API = "https://ifollowthemoney.org/api/v1";
const MAX_PAGES = 30; // up to 300 campaigns per country

export type Campaign = {
  id: number;
  countryId: number;
  title: string;
  state: string | null;
  createdAt: string;
  currency: string;
  hasBudget: boolean;
  budget: number;
  spent: number;
  views: number;
  likes: number;
  comments: number;
  link: string;
};

export type Summary = {
  campaigns: number;
  budget: number;
  spent: number;
  withBudget: number;
};

export type CountryAnalytics = {
  countryId: number;
  summary: Summary;
  campaigns: Campaign[];
  fetchedAt: string;
};

export type Overview = {
  /** Campaign count per country id (countries with none are left out). */
  counts: Record<number, number>;
  total: number;
  fetchedAt: string;
};

type RawCampaign = {
  id: number;
  country_id: number;
  title: string;
  currency?: string | null;
  has_budget?: boolean;
  project_budget?: number | string | null;
  budget_spent?: number | string | null;
  view_count?: number | null;
  likes_count?: number | null;
  comments_count?: number | null;
  created_at: string;
  link?: string;
  slug?: string;
  state?: { state_name?: string | null } | null;
};

const num = (v: unknown) => {
  const n =
    typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
};

/** "KANO" → "Kano", "FCT" stays as it is. */
function tidyState(name?: string | null) {
  if (!name) return null;
  const s = name.trim();
  if (s.length <= 3) return s.toUpperCase();
  return s.toLowerCase().replace(/(^|[\s-])\p{L}/gu, (m) => m.toUpperCase());
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} from ${url}`);
  return (await res.json()) as T;
}

function toCampaign(c: RawCampaign): Campaign {
  return {
    id: c.id,
    countryId: c.country_id,
    title: c.title.trim(),
    state: tidyState(c.state?.state_name),
    createdAt: c.created_at,
    currency: c.currency ?? "",
    hasBudget: Boolean(c.has_budget),
    budget: num(c.project_budget),
    spent: num(c.budget_spent),
    views: num(c.view_count),
    likes: num(c.likes_count),
    comments: num(c.comments_count),
    link: c.link ?? `https://ifollowthemoney.org/campaigns/${c.slug ?? c.id}`,
  };
}

async function allCampaigns(query: string): Promise<Campaign[]> {
  type Page = { data: { data: RawCampaign[]; last_page: number } };
  const first = await getJson<Page>(`${API}/campaigns?${query}page=1`);
  const last = Math.min(first.data.last_page || 1, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: last - 1 }, (_, i) =>
      getJson<Page>(`${API}/campaigns?${query}page=${i + 2}`),
    ),
  );
  return [first, ...rest].flatMap((p) => p.data.data).map(toCampaign);
}

/** Totals and campaigns for one country. */
export async function getCountryAnalytics(
  countryId: number,
): Promise<CountryAnalytics> {
  "use cache";
  cacheLife("minutes");

  type SummaryRes = {
    data: {
      campaigns_count: number;
      total_budget: string | number;
      total_budget_spent: string | number;
      has_budget_count: number;
    };
  };
  const [s, campaigns] = await Promise.all([
    getJson<SummaryRes>(`${API}/data/campaign-summary?country_id=${countryId}`),
    allCampaigns(`country_id=${countryId}&`),
  ]);
  return {
    countryId,
    summary: {
      campaigns: num(s.data.campaigns_count),
      budget: num(s.data.total_budget),
      spent: num(s.data.total_budget_spent),
      withBudget: num(s.data.has_budget_count),
    },
    campaigns: campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    fetchedAt: new Date().toISOString(),
  };
}

/** How many campaigns each country has (for the map and the picker). */
export async function getOverview(): Promise<Overview> {
  "use cache";
  cacheLife("minutes");

  const campaigns = await allCampaigns("");
  const counts: Record<number, number> = {};
  for (const c of campaigns)
    counts[c.countryId] = (counts[c.countryId] ?? 0) + 1;
  return {
    counts,
    total: campaigns.length,
    fetchedAt: new Date().toISOString(),
  };
}
