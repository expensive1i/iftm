/*
 * Countries shown on the globe, with simplified flags (stripes plus an
 * optional star or disc) drawn in code, so no flag images are loaded from
 * a third party. Nigeria is the hub every line starts from.
 * Replace or extend this list with the network's real partner countries.
 */

export type Flag = {
  dir: "h" | "v";
  stripes: { color: string; weight?: number }[];
  star?: string;
  disc?: string;
};

export type MapCountry = {
  code: string;
  name: string;
  /** Shown in the globe label, e.g. "Accra, GH · Tracking". */
  city: string;
  lon: number;
  lat: number;
  hub?: boolean;
  flag: Flag;
};

export const mapCountries: MapCountry[] = [
  {
    code: "ng", name: "Nigeria", city: "Abuja", lon: 8.7, lat: 9.1, hub: true,
    flag: { dir: "v", stripes: [{ color: "#008751" }, { color: "#fff" }, { color: "#008751" }] },
  },
  {
    code: "gh", name: "Ghana", city: "Accra", lon: -1.0, lat: 7.9,
    flag: { dir: "h", stripes: [{ color: "#ce1126" }, { color: "#fcd116" }, { color: "#006b3f" }], star: "#000" },
  },
  {
    code: "sn", name: "Senegal", city: "Dakar", lon: -14.5, lat: 14.5,
    flag: { dir: "v", stripes: [{ color: "#00853f" }, { color: "#fdef42" }, { color: "#e31b23" }], star: "#00853f" },
  },
  {
    code: "sl", name: "Sierra Leone", city: "Freetown", lon: -11.8, lat: 8.5,
    flag: { dir: "h", stripes: [{ color: "#1eb53a" }, { color: "#fff" }, { color: "#0072c6" }] },
  },
  {
    code: "cm", name: "Cameroon", city: "Yaoundé", lon: 12.4, lat: 5.7,
    flag: { dir: "v", stripes: [{ color: "#007a5e" }, { color: "#ce1126" }, { color: "#fcd116" }], star: "#fcd116" },
  },
  {
    code: "et", name: "Ethiopia", city: "Addis Ababa", lon: 39.5, lat: 9.1,
    flag: { dir: "h", stripes: [{ color: "#078930" }, { color: "#fcdd09" }, { color: "#da121a" }], disc: "#0f47af" },
  },
  {
    code: "ug", name: "Uganda", city: "Kampala", lon: 32.3, lat: 1.4,
    flag: {
      dir: "h",
      stripes: [
        { color: "#000" }, { color: "#fcdc04" }, { color: "#d90000" },
        { color: "#000" }, { color: "#fcdc04" }, { color: "#d90000" },
      ],
    },
  },
  {
    code: "ke", name: "Kenya", city: "Nairobi", lon: 37.9, lat: -0.5,
    flag: {
      dir: "h",
      stripes: [
        { color: "#000", weight: 3 }, { color: "#fff", weight: 1 }, { color: "#bb0000", weight: 4 },
        { color: "#fff", weight: 1 }, { color: "#006600", weight: 3 },
      ],
    },
  },
  {
    code: "rw", name: "Rwanda", city: "Kigali", lon: 29.9, lat: -2.3,
    flag: { dir: "h", stripes: [{ color: "#00a1de", weight: 2 }, { color: "#fad201" }, { color: "#20603d" }] },
  },
  {
    code: "mw", name: "Malawi", city: "Lilongwe", lon: 34.3, lat: -13.3,
    flag: { dir: "h", stripes: [{ color: "#000" }, { color: "#ce1126" }, { color: "#339e35" }] },
  },
  {
    code: "bw", name: "Botswana", city: "Gaborone", lon: 24.7, lat: -22.3,
    flag: {
      dir: "h",
      stripes: [
        { color: "#6da9d2", weight: 4 }, { color: "#fff", weight: 1 }, { color: "#000", weight: 2 },
        { color: "#fff", weight: 1 }, { color: "#6da9d2", weight: 4 },
      ],
    },
  },
];
