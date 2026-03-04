export interface SeasonInfo {
  title: string;
  content: string;
}

export const seasonData: Record<string, SeasonInfo> = {
  winter: {
    title: '❄️ October – February (Winter / Peak Season)',
    content: `This is the best time to visit most of India. Weather is pleasant and cool across the country.

🏆 Best Destinations:
• Rajasthan (Jaipur, Udaipur, Jaisalmer) – Perfect weather for sightseeing
• Goa – Prime beach season, festivals, lively atmosphere
• Kerala Backwaters – Comfortable and beautiful
• Varanasi & Agra – Ideal conditions
• Andaman Islands – Best sea visibility for diving
• Tamil Nadu & South India – Cool and manageable

🎉 Festivals: Diwali, Dussehra, Pushkar Camel Fair, Goa Carnival (Feb), Pongal

💡 Tips: Book 2–3 months in advance; prices are high during this peak season. Carry light woolens for North India evenings.`,
  },
  summer: {
    title: '☀️ March – June (Summer)',
    content: `Hot across plains of India. Best time for hill stations and North-East.

🏔️ Best Destinations:
• Himachal Pradesh – Shimla, Manali, Spiti Valley open up
• Uttarakhand – Rishikesh, Mussoorie, Valley of Flowers
• Ladakh – Opens from May; best for adventure
• Darjeeling & Sikkim – Ideal weather
• Munnar & Ooty – Cool escape from South India heat
• Kashmir – One of its most beautiful seasons (Apr–Jun)

⚠️ Avoid: Plains of Rajasthan, Delhi, UP (40–48°C!), Goa (off-season)

💡 Tips: Book hill stations 4–6 months ahead. Carry sunscreen, lots of water. Avoid travel during May–June school rush if possible.`,
  },
  monsoon: {
    title: '🌧️ July – September (Monsoon)',
    content: `India comes alive with green landscapes. Discounts available everywhere!

🌿 Best Destinations:
• Kerala – Monsoon ayurveda packages, lush backwaters
• Coorg & Wayanad – Coffee estates in full bloom
• Meghalaya – The wettest place on Earth, breathtaking waterfalls
• Goa – Off-season but scenic; great deals
• Lonavala & Mahabaleshwar – Day trips from Mumbai/Pune
• Rishikesh – Rafting season peaks (Jul–Sep)

⚠️ Avoid: Rajasthan (very hot + flash floods), Ladakh (landslides), East Coast (cyclone risk)

💡 Tips: Always check weather forecasts. Carry waterproof bags, ponchos. Road travel can be unpredictable. Book refundable tickets. Great for budget travellers — 30–50% off on hotels!`,
  },
};
