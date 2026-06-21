export interface Festival {
  name: string;
  emoji: string;
  month: number; // 1-12
  destinations: string[];
  desc: string;
  type: 'religious' | 'cultural' | 'nature' | 'harvest';
}

// Cultural & religious festivals — where to GO to attend/experience them.
// National public holidays (Republic Day, Independence Day, Diwali, Dussehra, Christmas etc.)
// are handled by weekend-escapes-data.ts to avoid duplication.
export const festivals: Festival[] = [
  { name: 'Lohri', emoji: '🔥', month: 1, destinations: ['Amritsar', 'Chandigarh', 'Ludhiana'], desc: 'Bonfire festival in Punjab — folk songs, rewri and peanuts around the fire', type: 'cultural' },
  { name: 'Pongal / Makar Sankranti', emoji: '🌾', month: 1, destinations: ['Chennai', 'Madurai', 'Ahmedabad'], desc: 'Harvest festival celebrated with kite flying, kolams and sweet pongal', type: 'harvest' },
  { name: 'Goa Carnival', emoji: '🎭', month: 2, destinations: ['Goa'], desc: 'Vibrant Portuguese-inspired carnival with floats, parades & music on Panjim streets', type: 'cultural' },
  { name: 'Maha Shivaratri', emoji: '🙏', month: 2, destinations: ['Varanasi', 'Rishikesh', 'Ujjain'], desc: 'Night of Shiva — all-night vigils and massive celebrations at major temples', type: 'religious' },
  { name: 'Holi', emoji: '🌈', month: 3, destinations: ['Mathura', 'Vrindavan', 'Barsana', 'Jaipur', 'Pushkar'], desc: 'Festival of colours — Lathmar Holi in Barsana and flower Holi in Vrindavan temples', type: 'religious' },
  { name: 'Baisakhi', emoji: '💛', month: 4, destinations: ['Amritsar', 'Chandigarh', 'Ludhiana'], desc: 'Punjabi New Year & harvest festival — bhangra, melas and Golden Temple celebrations', type: 'harvest' },
  { name: 'Eid ul-Fitr', emoji: '🌙', month: 4, destinations: ['Hyderabad', 'Lucknow', 'Old Delhi', 'Mumbai'], desc: 'End of Ramadan — streets alive with Mughlai food, illuminated mosques and festivity', type: 'religious' },
  { name: 'Buddha Purnima', emoji: '☮️', month: 5, destinations: ['Bodh Gaya', 'Sarnath', 'Leh'], desc: 'Birth of Buddha — serene candlelit processions at Bodh Gaya and Sarnath', type: 'religious' },
  { name: 'Rath Yatra', emoji: '🛕', month: 7, destinations: ['Puri', 'Ahmedabad'], desc: 'Grand chariot festival of Lord Jagannath — 45-foot wooden chariots pulled by thousands', type: 'religious' },
  { name: 'Onam', emoji: '🌸', month: 8, destinations: ['Thiruvananthapuram', 'Thrissur', 'Kochi'], desc: 'Kerala\'s harvest festival — floral rangolis, snake boat races and grand Onam Sadhya feast', type: 'harvest' },
  { name: 'Ganesh Chaturthi', emoji: '🐘', month: 9, destinations: ['Mumbai', 'Pune', 'Hyderabad'], desc: '10-day elephant god festival — grandest in Mumbai with 150,000+ pandals', type: 'religious' },
  { name: 'Navratri', emoji: '💃', month: 10, destinations: ['Ahmedabad', 'Vadodara', 'Jaipur'], desc: '9 nights of garba & dandiya — biggest in Gujarat, declared UNESCO Intangible Heritage', type: 'religious' },
  { name: 'Pushkar Camel Fair', emoji: '🐪', month: 11, destinations: ['Pushkar', 'Ajmer'], desc: 'World-famous camel fair — 50,000 camels, folk music, balloon rides and desert culture', type: 'cultural' },
];

export function getCurrentSeasonKey(): 'winter' | 'summer' | 'monsoon' {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 7 && month <= 9) return 'monsoon';
  if (month >= 3 && month <= 6) return 'summer';
  return 'winter';
}

export function getUpcomingFestivals(count = 3): Festival[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const sorted = [...festivals].sort((a, b) => {
    const aOffset = ((a.month - currentMonth + 12) % 12);
    const bOffset = ((b.month - currentMonth + 12) % 12);
    return aOffset - bOffset;
  });
  return sorted.slice(0, count);
}

export function getThisMonthFestivals(): Festival[] {
  const month = new Date().getMonth() + 1;
  return festivals.filter(f => f.month === month);
}

export const seasonalPicks: Record<'winter' | 'summer' | 'monsoon', { destinations: string[]; tip: string }> = {
  winter: {
    destinations: ['Rajasthan', 'Goa', 'Kerala', 'Varanasi', 'Agra', 'Andaman Islands', 'Amritsar'],
    tip: 'Oct–Feb is peak season. Book 2–3 months ahead. Perfect weather across India!',
  },
  summer: {
    destinations: ['Shimla & Manali', 'Ladakh', 'Darjeeling', 'Rishikesh & Haridwar', 'Munnar', 'Ooty'],
    tip: 'Escape the heat at hill stations. Ladakh opens in May. Best for Himalayan adventures!',
  },
  monsoon: {
    destinations: ['Kerala', 'Coorg', 'Goa', 'Rishikesh & Haridwar'],
    tip: 'Lush greens & 30–50% hotel discounts. Perfect for Ayurveda retreats in Kerala!',
  },
};
