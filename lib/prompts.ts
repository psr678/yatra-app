import type { PlannerFormData } from '@/types';

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
  return `You are a travel weather expert. Return ONLY a valid JSON object — no markdown, no explanation, no code fences — for visiting ${to} around ${month}.

The JSON must follow this exact shape:
{
  "destination": "string",
  "bestMonths": ["Jan", "Feb"],
  "avoidMonths": ["Jul", "Aug"],
  "months": [
    {
      "month": "Jan",
      "icon": "☀️",
      "condition": "Sunny & Cool",
      "high": 28,
      "low": 14,
      "rain": "Low",
      "crowd": "High",
      "rating": 5
    }
  ],
  "tips": [
    "Tip 1",
    "Tip 2"
  ],
  "packingEssentials": ["Item 1", "Item 2"],
  "festivals": [
    { "name": "Festival Name", "month": "Jan", "note": "short description" }
  ],
  "verdict": "One sentence summary of the best time to visit."
}

Rules:
- "months" must contain all 12 months Jan–Dec in order
- "icon" must be one of: ☀️ 🌤️ ⛅ 🌦️ 🌧️ ⛈️ 🌨️ 🌫️
- "condition" is 2–4 words e.g. "Hot & Humid", "Cool & Dry", "Heavy Rain"
- "high" and "low" are integers in Celsius
- "rain" is one of: Low / Moderate / High / Very High
- "crowd" is one of: Low / Moderate / High / Very High
- "rating" is 1–5 (5 = best time to visit)
- "tips" must have 4–6 bullet points
- "packingEssentials" must have 4–6 items
- Output ONLY the JSON. No other text.`;
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

export function buildWomenTipPrompt(to: string): string {
  return `Provide comprehensive women's travel safety guide for ${to}, India. Include: safe areas to stay, women-friendly hotels/guesthouses, safety tips, local customs to respect, how to get around safely, what to wear, emergency numbers, apps to download, and general confidence-building travel tips for women travellers.`;
}
