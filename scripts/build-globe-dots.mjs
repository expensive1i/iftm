// Builds the land dots for the hero-style globe from Natural Earth (world-atlas).
// Run once after changing STEP:  node scripts/build-globe-dots.mjs
// Output: src/components/sections/globe-dots.json  ([lon, lat] pairs, 1 decimal)
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const STEP = 1.15; // degrees between dot rows; columns are widened by 1/cos(lat) so dots stay evenly spaced on the sphere
const dots = [];
for (let lat = -58; lat <= 78; lat += STEP) {
  const lonStep = STEP / Math.max(Math.cos((lat * Math.PI) / 180), 0.2);
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (geoContains(land, [lon, lat])) dots.push([+lon.toFixed(1), +lat.toFixed(1)]);
  }
}

writeFileSync(
  new URL("../src/components/sections/globe-dots.json", import.meta.url),
  JSON.stringify(dots),
);
console.log(`Wrote ${dots.length} dots`);
