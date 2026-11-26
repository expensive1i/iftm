/*
 * Campaigns shown on the home page. Titles, authors, dates and the start of
 * each summary come from the "Our Campaigns" cards on the current
 * ifollowthemoney.org home page (the full pages need a login, so summaries
 * end where the old cards cut them off). Replace with live data later.
 */
export type Campaign = {
  slug: string;
  title: string;
  excerpt: string;
  country: string;
  date: string; // ISO date
  author: string;
  image?: { src: string; fit?: "cover" | "contain"; position?: string };
};

export const campaigns: Campaign[] = [
  {
    slug: "campaign-h8YHQlSZSSR04kj9",
    title: "The Bille gas leak: citizens deserve answers",
    excerpt: "Residents of Bille Kingdom in Degema Local Government…",
    country: "Nigeria",
    date: "2026-06-15",
    author: "Obinna",
    image: { src: "/images/campaign-bille.jpg", position: "50% 40%" },
  },
  {
    slug: "campaign-82smDACjwuWb5gBT",
    title: "Track SURWASH 2021 loan project",
    excerpt: "Citizens’ Eye: let’s track our water…",
    country: "Nigeria",
    date: "2026-05-26",
    author: "Muhammad Taha",
    image: { src: "/images/campaign-surwash.jpg", fit: "contain" },
  },
  {
    slug: "campaign-wFpl3jHk0uUAXsOD",
    title: "#CleanWaterForKakulu",
    excerpt: "The campaign was to track the construction…",
    country: "Nigeria",
    date: "2024-12-03",
    author: "Yahuza Ahmed",
    image: { src: "/images/campaign-kakulu.jpg", position: "50% 55%" },
  },
  {
    slug: "campaign-KyA7h2OWoIxPp3Q8",
    title: "Where are the 3 classrooms? Demand completion",
    excerpt: "This campaign calls for the immediate completion…",
    country: "Nigeria",
    date: "2026-05-03",
    author: "Nasiru",
  },
  {
    slug: "campaign-PfBUMK9FQoVPg9sq",
    title: "Youth awareness campaign for good governance",
    excerpt: "Raising awareness of how to choose…",
    country: "Nigeria",
    date: "2026-07-09",
    author: "Nasiru Ibrahim",
  },
  {
    slug: "campaign-iMoBmrDXasSlCHCG",
    title: "#CompleteKwadonCentralMosque",
    excerpt: "The reconstruction of Kwadon Central Mosque…",
    country: "Nigeria",
    date: "2024-12-04",
    author: "Hadiya",
  },
];
