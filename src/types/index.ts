export type NavItem = {
  title: string;
  href: string;
  external?: boolean;
  /** One line shown under the title in the full-width menus. */
  description?: string;
};

/** The photo panel on the right of a full-width menu. */
export type NavFeature = {
  image: string;
  title: string;
  href: string;
  cta: string;
};

/** A top-level navbar entry: either a plain link or a full-width menu. */
export type MainNavItem =
  | (NavItem & { items?: undefined })
  | {
      title: string;
      /** Short intro shown on the left of the menu. */
      intro: string;
      items: NavItem[];
      feature: NavFeature;
    };

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type Language = {
  code: string;
  label: string;
};
