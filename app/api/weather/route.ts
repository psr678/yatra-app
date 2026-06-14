export const maxDuration = 30;

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ── Derive helpers ────────────────────────────────────────────────

function toIcon(high: number, precipMm: number): string {
  if (precipMm > 150) return '⛈️';
  if (precipMm > 80)  return '🌧️';
  if (precipMm > 30)  return '🌦️';
  if (high > 38)      return '☀️';
  if (high > 28)      return '⛅';
  return '🌤️';
}

function toCondition(high: number, precipMm: number): string {
  if (precipMm > 150) return 'Heavy Monsoon';
  if (precipMm > 80)  return 'Rainy';
  if (precipMm > 30)  return 'Partly Rainy';
  if (high > 40)      return 'Very Hot & Dry';
  if (high > 35)      return 'Hot & Sunny';
  if (high > 28)      return 'Warm & Pleasant';
  if (high > 22)      return 'Cool & Dry';
  return 'Cold & Clear';
}

function toRain(precipMm: number): string {
  if (precipMm < 30)  return 'Low';
  if (precipMm < 100) return 'Moderate';
  if (precipMm < 200) return 'High';
  return 'Very High';
}

function toCrowd(precipMm: number, monthIdx: number): string {
  if (precipMm > 150) return 'Low';
  if (precipMm > 80)  return 'Moderate';
  // India peak tourist: Oct–Mar
  if (monthIdx >= 9 || monthIdx <= 2) return 'High';
  // School holidays: May–Jun
  if (monthIdx === 4 || monthIdx === 5) return 'Moderate';
  return 'Low';
}

function toRating(high: number, precipMm: number): number {
  if (precipMm > 150) return 1;
  if (precipMm > 80)  return 2;
  if (precipMm > 30)  return 3;
  if (high > 40)      return 2;
  if (high > 36)      return 3;
  if (high >= 22 && high <= 33) return 5;
  if (high < 22)      return 4;
  return 3;
}

// ── Route handler ─────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city')?.trim();
  if (!city) return Response.json({ error: 'city param required' }, { status: 400 });

  // 1. Geocode city → lat/lon (Open-Meteo, free, no API key)
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    { next: { revalidate: 86400 } }   // cache 24h
  );
  const geo = await geoRes.json();
  if (!geo.results?.length) {
    return Response.json({ error: `Could not locate "${city}"` }, { status: 404 });
  }
  const { latitude, longitude, name } = geo.results[0];

  // 2. Fetch 2 years of daily archive data (2022–2023)
  const archiveRes = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}` +
    `&start_date=2022-01-01&end_date=2023-12-31` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
    { next: { revalidate: 86400 } }
  );
  const archive = await archiveRes.json();

  if (!archive.daily?.time?.length) {
    return Response.json({ error: 'No climate data available' }, { status: 502 });
  }

  // 3. Bucket daily data by calendar month and average
  const buckets: { maxT: number[]; minT: number[]; precip: number[] }[] =
    Array.from({ length: 12 }, () => ({ maxT: [], minT: [], precip: [] }));

  archive.daily.time.forEach((date: string, i: number) => {
    const m = new Date(date).getMonth();
    const hi = archive.daily.temperature_2m_max[i];
    const lo = archive.daily.temperature_2m_min[i];
    const pr = archive.daily.precipitation_sum[i];
    if (hi != null) buckets[m].maxT.push(hi);
    if (lo != null) buckets[m].minT.push(lo);
    if (pr != null) buckets[m].precip.push(pr);
  });

  const avg = (arr: number[]) =>
    arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

  const months = buckets.map((b, i) => {
    const high = avg(b.maxT);
    const low  = avg(b.minT);
    // Sum daily precip → monthly total, averaged over 2 years
    const monthlyPrecip = Math.round(b.precip.reduce((s, v) => s + v, 0) / 2);
    return {
      month:     MONTH_NAMES[i],
      icon:      toIcon(high, monthlyPrecip),
      condition: toCondition(high, monthlyPrecip),
      high,
      low,
      rain:      toRain(monthlyPrecip),
      crowd:     toCrowd(monthlyPrecip, i),
      rating:    toRating(high, monthlyPrecip),
      precipMm:  monthlyPrecip,
    };
  });

  // 4. Derive best/avoid months from rating
  const sorted = [...months].sort((a, b) => b.rating - a.rating);
  const bestMonths  = sorted.slice(0, 3).map(m => m.month.slice(0, 3));
  const avoidMonths = sorted.slice(-2).map(m => m.month.slice(0, 3));

  return Response.json({
    destination: name,
    bestMonths,
    avoidMonths,
    months,
    // tips/verdict/festivals/packing left empty — filled by optional AI insights
    tips: [],
    packingEssentials: [],
    festivals: [],
    verdict: '',
  });
}
