import { countryById } from "@/lib/analytics/countries";
import { getCountryAnalytics } from "@/lib/analytics/data";

/*
 * GET /api/analytics/:countryId — one country's analytics for the Analytics
 * page when a visitor picks another country. The data comes from the cached
 * server-side reader (a few minutes), so this never hammers the platform.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const id = Number(country);
  if (!countryById.has(id)) {
    return Response.json({ error: "Unknown country" }, { status: 404 });
  }
  try {
    const data = await getCountryAnalytics(id);
    return Response.json(data, {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    });
  } catch {
    return Response.json({ error: "The data service did not respond. Please try again." }, { status: 502 });
  }
}
