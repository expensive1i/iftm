// Contact details and social links are taken from the current
// ifollowthemoney.org footer.
export const siteConfig = {
  name: "iFollowTheMoney",
  shortName: "IFTM",
  description:
    "A network of grassroots citizens tracking government and international aid spending in their communities across Africa.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  appUrl:
    "https://play.google.com/store/apps/details?id=com.followthemoney.app",
  // No App Store listing yet: set this to the listing URL when the iOS
  // app is published and every App Store button switches on.
  iosAppUrl: null as string | null,
  email: "hello@ifollowthemoney.org",
  // From the current ifollowthemoney.org Contact page
  phone: "+234 (09) 291 7545",
  phoneHref: "tel:+23492917545",
  address: "3rd Floor, D Wing, Bassan Plaza, Central Area, Abuja",
  socials: {
    youtube: "https://www.youtube.com/channel/UCkY8c7LiVNqLCdZ47nL3aBg",
    instagram: "https://www.instagram.com/ifollowthemoney/",
    facebook: "https://www.facebook.com/followthemoneyng",
  },
} as const;

export type SiteConfig = typeof siteConfig;
