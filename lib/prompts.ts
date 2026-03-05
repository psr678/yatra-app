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

IMPORTANT FORMATTING RULE: For every named place (attraction, restaurant, hotel, market, temple, area), embed a Google Maps hyperlink directly on the place name using this format:
[Place Name](https://www.google.com/maps/search/Place+Name+${encodeURIComponent(to)}+India)
Replace spaces in the place name with + in the URL. Always link the name itself, not a separate line.

Please respond with ALL of the following sections:

---

## 🌤️ Weather in ${to}${month ? ' – ' + month : ''}
Temperature range, what to wear, weather cautions, and best time of day to sightsee.

---

## 📅 Day-by-Day Itinerary
For each of the ${numDays} days provide **Morning / Afternoon / Evening** with specific named places (each linked to Google Maps as instructed above).

---

## 🗺️ Nearby Day Trips
List 5–6 destinations within 50–250 km of ${to} that make great day trips or short excursions. For each place:
- **[Place Name](https://www.google.com/maps/search/Place+Name+${encodeURIComponent(to)}+India)** — ~X km from ${to} (~Y hrs by road/train)
- How to get there: cab / bus / train with approximate one-way cost
- Top 2–3 things to see or do there
- Best suited for: day trip / overnight / weekend getaway

---

## 💰 Budget Breakdown
| Category | Per Person / Day | Total (${people} pax × ${numDays} days) |
|---|---|---|
${sameCity
  ? `List rows for: Accommodation, Food, Local Transport (auto/cab/bus within ${to} only), Activities, Shopping/Misc, then a **Grand Total** row.
IMPORTANT: Do NOT include any flight or intercity train costs — the traveller is already in ${to} or departing from the same city.`
  : `List rows for: Accommodation, Food, Intercity Travel (return flights or trains from ${from} to ${to}) + Local Transport, Activities, Shopping/Misc, then a **Grand Total** row.
Include estimated return flight or train fare from ${from} to ${to} in the transport row.`}
Base on: ${budgetLabel}.

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

## 🚆 Getting There & Around
How to reach ${to} from ${from || 'major cities'}, and local transport options.

---

## 💡 Tips & Essentials
${womenFriendly ? '- Women safety tips for ' + to + '\n' : ''}${senior ? '- Senior citizen notes\n' : ''}- Cultural tips and local customs
- Must-have apps for this trip (transport, maps, translation, etc.)
- What to avoid / common tourist mistakes

---

## 🆘 Emergency Contacts
Always include these with exact numbers:
- **Police:** 100
- **Ambulance / Medical Emergency:** 108
- **Fire Brigade:** 101
- **Women's Helpline:** 1091
- **Tourist Helpline (India Tourism):** 1800-11-1363 (toll-free)
- **Railway Enquiry:** 139
- **Nearest hospital or clinic** near ${to} (name + approximate location)
- Any **${to}-specific** emergency or local authority number if applicable`;
}

export function buildChecklistPrompt(to: string, month: string, age: string, womenFriendly: boolean): string {
  return `Give a smart, context-specific packing list for travelling to ${to || 'India'} in ${month || 'upcoming trip'}. ${age ? 'Traveller age group: ' + age + '.' : ''} ${womenFriendly ? 'Female traveller.' : ''} Include destination-specific items, weather-appropriate clothing, local tips. Format as clear sections.`;
}

export function buildSeasonalTipPrompt(to: string, month: string): string {
  return `Give detailed seasonal travel advice for visiting ${to} in ${month}. Include: weather conditions, what to pack, festivals happening, crowd levels, pros and cons of this time, and whether it's ideal to visit. Be practical and specific.`;
}

export function buildWomenTipPrompt(to: string): string {
  return `Provide comprehensive women's travel safety guide for ${to}, India. Include: safe areas to stay, women-friendly hotels/guesthouses, safety tips, local customs to respect, how to get around safely, what to wear, emergency numbers, apps to download, and general confidence-building travel tips for women travellers.`;
}
