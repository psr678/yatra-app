import type { PlannerFormData, TripSelection } from '@/types';
import { getCircuitById } from './circuits-data';

const budgetRanges: Record<string, string> = {
  budget: '₹2,000–5,000 per person/day',
  moderate: '₹5,000–15,000 per person/day',
  premium: '₹15,000–40,000 per person/day',
  luxury: '₹40,000+ per person/day',
};

export function buildItineraryPrompt(data: PlannerFormData): string {
  const { from, to, numDays, month, budget, age, interests, people, travellerType, womenFriendly, spiritual, adventure, senior } = data;

  const flags = [
    womenFriendly ? 'women-friendly' : '',
    spiritual ? 'spiritual focus' : '',
    adventure ? 'adventure activities' : '',
    senior ? 'senior-citizen friendly' : '',
  ].filter(Boolean).join(', ');

  const budgetLabel = budgetRanges[budget] || 'moderate (₹5,000–15,000 per person/day)';

  // Determine if intercity travel costs apply
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  const sameCity = !from || normalize(from) === normalize(to);

  return `Create a comprehensive ${numDays}-day travel plan for ${people} ${people === 1 ? 'person' : 'people'} (${travellerType || 'travellers'}) going from ${from || 'India'} to ${to}${month ? ' in ' + month : ''}.

**Trip Details:**
- Travellers: ${people} ${people === 1 ? 'person' : 'people'} (${travellerType || 'group'})
- Budget: ${budgetLabel}
- Age Group: ${age || 'adults'}
- Special focus: ${flags || 'general travel'}
- Interests: ${interests || 'general sightseeing'}

FORMATTING RULES — follow these strictly:
1. Every named place (attraction, restaurant, hotel, market, temple, area): embed a Google Maps link on the name: [Place Name](https://www.google.com/maps/search/Place+Name+${encodeURIComponent(to)}+India)
2. Use **bold** for: place names, dish names, hotel names, prices, timings, key warnings.
3. Use *italic* for: local words, neighbourhood vibes, cuisine descriptions.
4. In the day-by-day section, label each time block as **Morning**, **Afternoon**, **Evening** in bold.
5. Keep each bullet tight — one sentence max. No padding text.

Please respond with ALL of the following sections:

---

## 📅 Day-by-Day Itinerary
For each of the ${numDays} days provide **Morning / Afternoon / Evening** with specific named places (each linked to Google Maps as instructed above).

---

## 🍽️ Local Food Guide

### 🥗 Vegetarian Must-Tries
List 5–6 dishes with a one-line description each.

### 🍗 Non-Vegetarian Must-Tries
List 5–6 dishes with a one-line description each.

### 🏪 Where to Eat
List 4–5 specific restaurants or street food spots with their name linked to Google Maps, price range, and one-line description.

---

## 🏨 Where to Stay
List 3 specific hotels or guesthouses matching the ${budgetLabel} budget. Link each hotel name to Google Maps. Include price per night estimate.

---

## 💡 Tips & Essentials
${womenFriendly ? '- Women safety tips for ' + to + '\n' : ''}${senior ? '- Senior citizen notes\n' : ''}- Cultural tips and local customs
- Must-have apps for this trip (transport, maps, translation, etc.)
- What to avoid / common tourist mistakes`;
}

export function buildChecklistPrompt(to: string, month: string, age: string, womenFriendly: boolean): string {
  return `Give a smart, context-specific packing list for travelling to ${to || 'India'} in ${month || 'upcoming trip'}. ${age ? 'Traveller age group: ' + age + '.' : ''} ${womenFriendly ? 'Female traveller.' : ''} Include destination-specific items, weather-appropriate clothing, local tips. Format as clear sections.`;
}

export function buildSeasonalTipPrompt(to: string, month: string): string {
  return `You are a concise Indian travel expert. Give seasonal travel advice for visiting ${to} in ${month}. Format your response in markdown with these sections:

## 🌤️ Best Time to Visit
One paragraph — when to go and why.

## ✅ Why ${month} Works (or Doesn't)
2–3 bullet points on what to expect this month specifically.

## 🎒 What to Pack
4–5 essential items as a bullet list.

## 🎉 Festivals & Events
1–3 relevant festivals or events near this time, if any.

## 💡 Local Tips
2–3 quick destination-specific tips.

Keep each bullet under 15 words. Be specific to ${to}, not generic India advice.`;
}

// Minimal prompt — ~150 tokens in, ~200 out. Used by the WeatherCard "AI Insights" button.
export function buildWeatherInsightsPrompt(to: string): string {
  return `You are a concise Indian travel expert. For the destination "${to}", respond with ONLY valid JSON, no markdown:
{"verdict":"One sentence on best time to visit and why.","tips":["Tip 1","Tip 2","Tip 3"],"packingEssentials":["Item 1","Item 2","Item 3","Item 4"],"festivals":[{"name":"Festival","month":"Mon","note":"short note"}]}
Keep each tip under 15 words. List 1–3 key festivals only. Output ONLY the JSON object.`;
}

export function buildDayTripsPrompt(to: string): string {
  return `List 5 destinations within 50–250 km of ${to}, India as great day trips. For each:
## 🗺️ Nearby Day Trips
- **[Place](https://www.google.com/maps/search/${encodeURIComponent(to)}+India)** — ~X km (~Y hrs by road/train)
- How to get there + one-way cost
- Top 2 things to do
- Best for: day trip / overnight`;
}

export function buildGetTherePrompt(to: string, from: string): string {
  return `How to reach ${to} from ${from || 'major Indian cities'}, and local transport options within ${to}. Be concise — 3–4 bullet points per sub-section. Use ## 🚆 Getting There & Around as the heading.`;
}

/**
 * Multi-city circuit prompt — replaces the single-city prompt when a circuit is selected.
 * Allocates days across cities proportionally and includes travel days between them.
 */
export function buildCircuitPrompt(data: PlannerFormData, selection: TripSelection): string {
  const circuit = selection.circuitId ? getCircuitById(selection.circuitId) : null;
  const cities = selection.cities ?? [data.to];
  const { numDays, month, budget, age, interests, people, travellerType, womenFriendly, spiritual, adventure, senior } = data;

  const flags = [
    womenFriendly ? 'women-friendly' : '',
    spiritual ? 'spiritual focus' : '',
    adventure ? 'adventure activities' : '',
    senior ? 'senior-citizen friendly' : '',
  ].filter(Boolean).join(', ');

  const budgetLabel = budgetRanges[budget] || 'moderate (₹5,000–15,000 per person/day)';

  // Distribute days across cities (first and last get slightly more)
  const daysPerCity = distributeDays(numDays, cities.length);

  const citySchedule = cities.map((city, i) => `  - ${city}: ${daysPerCity[i]} day${daysPerCity[i] > 1 ? 's' : ''}`).join('\n');

  return `Create a comprehensive ${numDays}-day MULTI-CITY travel circuit for ${people} ${people === 1 ? 'person' : 'people'} (${travellerType || 'travellers'})${month ? ' in ' + month : ''}.

**Circuit: ${circuit?.name ?? selection.label}**
**Route:** ${cities.join(' → ')}

**Day allocation:**
${citySchedule}

**Trip Details:**
- Travellers: ${people} ${people === 1 ? 'person' : 'people'} (${travellerType || 'group'})
- Budget: ${budgetLabel}
- Age Group: ${age || 'adults'}
- Special focus: ${flags || 'general travel'}
- Interests: ${interests || 'general sightseeing'}

FORMATTING RULES — follow these strictly:
1. Every named place: embed a Google Maps link: [Place Name](https://www.google.com/maps/search/Place+Name+India)
2. Use **bold** for: place names, dish names, hotel names, prices, timings, key warnings.
3. Use *italic* for: local words, neighbourhood vibes, cuisine descriptions.
4. In the day-by-day section, label each time block as **Morning**, **Afternoon**, **Evening** in bold.
5. Include a **Travel Day** entry on the day you move between cities (how to get there, duration, cost).
6. Keep each bullet tight — one sentence max.

Please respond with ALL of the following sections:

---

## 📅 Day-by-Day Circuit Itinerary
Organise strictly by city. For each city block, show a **## 🏙️ [City Name]** heading, then day-by-day with **Morning / Afternoon / Evening**. Include one **🚌 Travel to [Next City]** day between each city showing how to get there and estimated cost.

---

## 🍽️ Food Highlights by City
For each city in the circuit, list 3 must-try dishes or restaurants.

---

## 🏨 Where to Stay
For each city, suggest 1–2 hotels matching the ${budgetLabel} budget with price per night estimate.

---

## 💡 Circuit Tips
- Best way to book intercity transport in advance
- Packing tips for this specific circuit
- Common mistakes travellers make on this route
${womenFriendly ? '- Women safety notes for each city\n' : ''}${senior ? '- Senior citizen accessibility notes\n' : ''}`;
}

function distributeDays(total: number, cities: number): number[] {
  if (cities === 1) return [total];
  // Reserve 1 travel day between each city
  const travelDays = cities - 1;
  const sightseeingDays = Math.max(total - travelDays, cities);
  const base = Math.floor(sightseeingDays / cities);
  const extra = sightseeingDays % cities;
  return Array.from({ length: cities }, (_, i) => {
    const sight = base + (i === 0 || i === cities - 1 ? Math.ceil(extra / 2) : 0);
    return sight + (i < cities - 1 ? 1 : 0); // add travel day except last city
  });
}

export function buildWomenTipPrompt(to: string): string {
  return `Provide comprehensive women's travel safety guide for ${to}, India. Include: safe areas to stay, women-friendly hotels/guesthouses, safety tips, local customs to respect, how to get around safely, what to wear, emergency numbers, apps to download, and general confidence-building travel tips for women travellers.`;
}
