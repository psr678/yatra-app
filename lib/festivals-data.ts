export interface Festival {
  name: string;
  emoji: string;
  month: number; // 1-12
  destinations: string[];
  desc: string;
  type: 'religious' | 'cultural' | 'nature' | 'harvest';
}

export const festivals: Festival[] = [
  { name: 'Lohri & Republic Day', emoji: '🔥', month: 1, destinations: ['Amritsar', 'Delhi', 'Chandigarh'], desc: 'Bonfire festival in Punjab + patriotic celebrations across India', type: 'cultural' },
  { name: 'Pongal / Makar Sankranti', emoji: '🌾', month: 1, destinations: ['Chennai', 'Madurai', 'Ahmedabad'], desc: 'Harvest festival celebrated with kite flying and sweets', type: 'harvest' },
  { name: 'Goa Carnival', emoji: '🎭', month: 2, destinations: ['Goa'], desc: 'Vibrant Portuguese-inspired carnival with parades & music', type: 'cultural' },
  { name: 'Maha Shivaratri', emoji: '🙏', month: 2, destinations: ['Varanasi', 'Rishikesh', 'Ujjain'], desc: 'Night of Shiva — massive celebrations at major temples', type: 'religious' },
  { name: 'Holi', emoji: '🌈', month: 3, destinations: ['Mathura', 'Vrindavan', 'Jaipur', 'Delhi', 'Pushkar'], desc: 'Festival of colours — most vibrant in Mathura & Vrindavan', type: 'religious' },
  { name: 'Baisakhi', emoji: '💛', month: 4, destinations: ['Amritsar', 'Chandigarh', 'Ludhiana'], desc: 'Punjabi New Year & harvest festival with bhangra & melas', type: 'harvest' },
  { name: 'Eid ul-Fitr', emoji: '🌙', month: 4, destinations: ['Delhi', 'Hyderabad', 'Lucknow', 'Mumbai'], desc: 'End of Ramadan — streets come alive with food & festivities', type: 'religious' },
  { name: 'Buddha Purnima', emoji: '☮️', month: 5, destinations: ['Bodh Gaya', 'Sarnath', 'Ladakh'], desc: 'Birth of Buddha — serene celebrations at Buddhist sites', type: 'religious' },
  { name: 'Rath Yatra', emoji: '🛕', month: 7, destinations: ['Puri', 'Ahmedabad'], desc: 'Grand chariot festival of Lord Jagannath in Odisha', type: 'religious' },
  { name: 'Independence Day', emoji: '🇮🇳', month: 8, destinations: ['Delhi', 'Mumbai', 'Kolkata'], desc: 'National celebrations with flag hoisting across India', type: 'cultural' },
  { name: 'Ganesh Chaturthi', emoji: '🐘', month: 9, destinations: ['Mumbai', 'Pune', 'Hyderabad'], desc: '10-day elephant god festival — grandest in Mumbai & Pune', type: 'religious' },
  { name: 'Navratri', emoji: '💃', month: 10, destinations: ['Ahmedabad', 'Vadodara', 'Jaipur'], desc: '9 nights of garba & dandiya — biggest in Gujarat', type: 'religious' },
  { name: 'Dasara / Dussehra', emoji: '🏹', month: 10, destinations: ['Mysuru', 'Kullu', 'Delhi', 'Varanasi'], desc: 'Victory of good over evil — Mysuru has the grandest parade', type: 'religious' },
  { name: 'Diwali', emoji: '🪔', month: 11, destinations: ['Varanasi', 'Jaipur', 'Delhi', 'Amritsar', 'Udaipur'], desc: 'Festival of lights — breathtaking on ghats of Varanasi & Udaipur', type: 'religious' },
  { name: 'Pushkar Camel Fair', emoji: '🐪', month: 11, destinations: ['Pushkar', 'Ajmer'], desc: 'World-famous camel fair — desert culture, folk music & trade', type: 'cultural' },
  { name: 'Christmas & New Year', emoji: '🎄', month: 12, destinations: ['Goa', 'Kolkata', 'Pondicherry', 'Kerala'], desc: 'Beach parties in Goa, colonial charm in Kolkata & Pondicherry', type: 'cultural' },
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
