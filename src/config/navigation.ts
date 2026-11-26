import { siteConfig } from "@/config/site";
import type { Language, MainNavItem, NavGroup } from "@/types";

// Every page from the current ifollowthemoney.org menu, regrouped so the
// things people come to do (campaigns, data) sit at the top level.
export const mainNav: MainNavItem[] = [
  { title: "Home", href: "/" },
  {
    title: "About",
    intro:
      "A community of citizens across Africa holding governments to account for every budget line.",
    items: [
      {
        title: "About iFollowTheMoney",
        href: "/about",
        description: "Who we are, how the network started and how it works.",
      },
      {
        title: "Analytics",
        href: "/analytics",
        description: "Projects, campaigns and spending tracked by the network.",
      },
      {
        title: "Contact us",
        href: "/contact-us",
        description: "Questions, partnerships and press enquiries.",
      },
      {
        title: "Download the app",
        href: siteConfig.appUrl,
        external: true,
        description: "Track and report projects from your phone.",
      },
    ],
    feature: {
      image: "/images/about-2.jpg",
      title: "Trackers meet the communities a budget was meant for.",
      href: "/about",
      cta: "Read our story",
    },
  },
  {
    title: "Campaigns",
    intro:
      "Campaigns follow one project or budget from the promise to what was actually delivered.",
    items: [
      {
        title: "View campaigns",
        href: "/campaigns",
        description: "See what citizens are tracking right now.",
      },
      {
        title: "Create a campaign",
        href: "/campaigns/create",
        description: "Start tracking a project in your own community.",
      },
    ],
    feature: {
      image: "/images/about-4.jpg",
      title: "Every campaign starts with one question: where did the money go?",
      href: "/campaigns/create",
      cta: "Start a campaign",
    },
  },
  { title: "Analytics", href: "/analytics" },
  { title: "Contact", href: "/contact-us" },
];

export const authNav = {
  login: { title: "Log in", href: "/login" },
  register: { title: "Register", href: "/register" },
};

export const languages: Language[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "sw", label: "Kiswahili" },
  { code: "ar", label: "العربية" },
  { code: "am", label: "አማርኛ" },
  { code: "pt", label: "Português" },
];

export const footerNav: NavGroup[] = [
  {
    title: "Explore",
    items: [
      { title: "Campaigns", href: "/campaigns" },
      { title: "Analytics", href: "/analytics" },
    ],
  },
  {
    title: "Organisation",
    items: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact-us" },
    ],
  },
];
