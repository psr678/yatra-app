export type EventType = 'pilgrimage' | 'cultural' | 'nature' | 'adventure' | 'spiritual';
export type EventScale = 'massive' | 'national' | 'regional';
export type EventFrequency = 'annual' | '3-yearly' | '6-yearly' | '12-yearly' | 'rare';

export interface MajorEvent {
  id: string;
  name: string;
  emoji: string;
  type: EventType;
  frequency: EventFrequency;
  /** ISO date YYYY-MM-DD */
  startDate: string;
  endDate: string;
  destinations: string[];
  /** Links to a circuit id for "Plan this trip" */
  circuitId?: string;
  description: string;
  scale: EventScale;
  highlights: string[];
  tips: string[];
}

// ── Helper — compare to today ─────────────────────────────────────────────────

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseDate(iso: string): Date {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── Major Events Data ─────────────────────────────────────────────────────────
// Covers 2025–2029. Add new entries when dates are confirmed.
// Pushkaram dates are based on Jupiter (Brihaspati) transit into each zodiac rasi.

export const MAJOR_EVENTS: MajorEvent[] = [

  // ── KUMBH MELA SERIES ────────────────────────────────────────────────────
  {
    id: 'maha-kumbh-prayagraj-2025',
    name: 'Maha Kumbh Mela — Prayagraj',
    emoji: '🕉️',
    type: 'pilgrimage',
    frequency: '12-yearly',
    startDate: '2025-01-13',
    endDate: '2025-02-26',
    destinations: ['Prayagraj', 'Varanasi', 'Ayodhya'],
    circuitId: 'khajuraho-varanasi',
    description: 'The world\'s largest human gathering — held once every 12 years at the Triveni Sangam. Over 400 million pilgrims expected. Shahi Snans (royal baths) are the holiest moments.',
    scale: 'massive',
    highlights: ['Triveni Sangam holy dip', 'Shahi Snan processions', 'Akharas & saints gathering', 'Tent city of 40 sq km'],
    tips: ['Book accommodation 6+ months ahead', 'Arrive a day before Shahi Snan dates', 'Carry ID proof at all times', 'Pre-dawn bathing is less crowded'],
  },
  {
    id: 'nashik-kumbh-2027',
    name: 'Kumbh Mela — Nashik & Trimbakeshwar',
    emoji: '🕉️',
    type: 'pilgrimage',
    frequency: '12-yearly',
    startDate: '2027-07-14',
    endDate: '2027-09-13',
    destinations: ['Nashik', 'Trimbakeshwar', 'Pune'],
    description: 'The Godavari Kumbh Mela held on the banks of the Godavari river. Trimbakeshwar Jyotirlinga is the epicentre. Millions gather for the holy dip at Ramkund.',
    scale: 'massive',
    highlights: ['Ramkund bathing ghat', 'Trimbakeshwar Jyotirlinga', 'Peshwa-era ghats', 'Naga Sadhu processions'],
    tips: ['July–August is monsoon — carry rain gear', 'Trimbakeshwar is 28 km from Nashik — plan travel', 'Booking fills up 3+ months ahead'],
  },
  {
    id: 'haridwar-kumbh-2028',
    name: 'Kumbh Mela — Haridwar',
    emoji: '🕉️',
    type: 'pilgrimage',
    frequency: '12-yearly',
    startDate: '2028-03-12',
    endDate: '2028-04-27',
    destinations: ['Haridwar', 'Rishikesh', 'Dehradun'],
    circuitId: 'char-dham',
    description: 'The Haridwar Kumbh on the banks of the Ganga — where the river descends to the plains. Har Ki Pauri ghat is the main bathing point. Considered highly auspicious as Ganga is in her most powerful form here.',
    scale: 'massive',
    highlights: ['Har Ki Pauri Shahi Snan', 'Ganga Aarti spectacle', 'Rishikesh ashrams nearby', 'Akharas grand processions'],
    tips: ['March–April weather is ideal', 'Combine with Rishikesh yoga retreat', 'Pre-book train to Haridwar — fills up fast'],
  },

  // ── PUSHKARAMS ────────────────────────────────────────────────────────────
  // 12-day festival when Jupiter enters a specific zodiac sign (one river per sign)
  {
    id: 'godavari-pushkaram-2027',
    name: 'Godavari Pushkaram',
    emoji: '🌊',
    type: 'spiritual',
    frequency: '12-yearly',
    startDate: '2027-07-14',
    endDate: '2027-07-25',
    destinations: ['Nashik', 'Rajahmundry', 'Bhadrachalam'],
    description: 'Sacred 12-day festival on the Godavari river when Jupiter transits into Aquarius. Rajahmundry on the Godavari delta is the main site — millions gather to bathe in the holy river. First 3 and last 3 days are most auspicious.',
    scale: 'massive',
    highlights: ['Holy dip at Godavari Pushkar Ghat', 'Rajahmundry rail-road bridge views', 'Bhadrachalam Rama Temple', 'Cultural performances & discourses'],
    tips: ['Rajahmundry is easily reachable by train from Hyderabad (5 hrs)', 'First day (Adi Pushkaram) is most crowded', 'Book accommodation in Rajahmundry or Kakinada'],
  },
  {
    id: 'krishna-pushkaram-2028',
    name: 'Krishna Pushkaram',
    emoji: '🌊',
    type: 'spiritual',
    frequency: '12-yearly',
    startDate: '2028-08-18',
    endDate: '2028-08-29',
    destinations: ['Vijayawada', 'Hampi', 'Srisailam'],
    description: 'Sacred 12-day festival on the Krishna river when Jupiter transits into Pisces. Vijayawada and Hampi on the Krishna banks are the key sites. Srisailam Jyotirlinga is a major pilgrimage point during Pushkaram.',
    scale: 'massive',
    highlights: ['Kanaka Durga Temple Vijayawada', 'Hampi ruins on Krishna banks', 'Srisailam Mallikarjuna Jyotirlinga', 'Nagarjuna Sagar nearby'],
    tips: ['August is monsoon — river levels are high', 'Vijayawada is 5 hrs from Hyderabad by train', 'Combine with Hampi sightseeing'],
  },
  {
    id: 'ganga-pushkaram-2029',
    name: 'Ganga Pushkaram',
    emoji: '🌊',
    type: 'spiritual',
    frequency: '12-yearly',
    startDate: '2029-09-05',
    endDate: '2029-09-16',
    destinations: ['Haridwar', 'Varanasi', 'Prayagraj', 'Rishikesh'],
    circuitId: 'khajuraho-varanasi',
    description: 'The most sacred of all Pushkarams — on the Ganga, considered the holiest river. Jupiter transiting into Aries triggers 12 days of mass bathing along the entire Ganga from Haridwar to Varanasi. The divine energy is said to be at its peak.',
    scale: 'massive',
    highlights: ['Haridwar Har Ki Pauri dip', 'Varanasi Dashashwamedh Ghat', 'Prayagraj Triveni Sangam', 'Dawn Ganga Aarti spectacle'],
    tips: ['September is post-monsoon — cooler and greener', 'Varanasi and Haridwar can be done in one circuit', 'Pre-book everything 6 months ahead'],
  },

  // ── ANNUAL SIGNATURE EVENTS ───────────────────────────────────────────────
  {
    id: 'hornbill-festival-2026',
    name: 'Hornbill Festival — Nagaland',
    emoji: '🦅',
    type: 'cultural',
    frequency: 'annual',
    startDate: '2026-12-01',
    endDate: '2026-12-10',
    destinations: ['Kohima', 'Kisama Heritage Village'],
    circuitId: 'northeast-explorer',
    description: 'The "Festival of Festivals" — all 16 Naga tribes perform together at Kisama Heritage Village near Kohima. Tribal dances, traditional games, local cuisine, crafts and music. The most accessible window into Nagaland\'s ancient culture.',
    scale: 'national',
    highlights: ['16 Naga tribes performing together', 'Naga Morungs (traditional huts)', 'Fire-eating & warrior dances', 'Organic Naga cuisine stalls'],
    tips: ['Fly into Dimapur (nearest airport)', 'Book hotels in Kohima — fills up fast', 'Carry a jacket — December nights are cold', 'Photography is encouraged & welcomed'],
  },
  {
    id: 'rann-utsav-2026',
    name: 'Rann Utsav — Kutch',
    emoji: '🏜️',
    type: 'cultural',
    frequency: 'annual',
    startDate: '2026-11-01',
    endDate: '2027-02-28',
    destinations: ['Dhordo', 'Bhuj', 'Rann of Kutch'],
    circuitId: 'gujarat-heritage',
    description: 'A 3-month carnival on the white salt desert of the Great Rann of Kutch. Full-moon nights turn the salt flats ethereal silver. Handicrafts, folk music, camel rides, cultural performances, and Gujarat\'s finest cuisine.',
    scale: 'national',
    highlights: ['White salt desert full-moon walks', 'Kutchi folk music & Garba', 'Handicraft bazaars', 'Tent city accommodation'],
    tips: ['Full moon nights are magical — plan dates around them', 'Book the tent city packages early', 'Bhuj to Dhordo is 80 km — hire a cab', 'Best months: Nov–Jan for cooler days'],
  },
  {
    id: 'jaisalmer-desert-festival-2027',
    name: 'Jaisalmer Desert Festival',
    emoji: '🐫',
    type: 'cultural',
    frequency: 'annual',
    startDate: '2027-02-08',
    endDate: '2027-02-10',
    destinations: ['Jaisalmer', 'Sam Sand Dunes'],
    circuitId: 'rajasthan-heritage',
    description: 'Three days of desert culture against the backdrop of Sam sand dunes and the golden Jaisalmer fort. Camel races, turban-tying contests, folk dancers, fire shows, and Miss Desert pageant. Culminates in a spectacular sunset at the dunes.',
    scale: 'national',
    highlights: ['Camel polo & racing', 'Folk music at Sam dunes sunset', 'Turban-tying contest', 'Snake charmers & puppeteers'],
    tips: ['Coincides with Purnima (full moon) — extra magical', 'February is ideal weather', 'Book Jaisalmer hotels 3+ months ahead', 'Sam dunes are 40 km from town'],
  },
  {
    id: 'hemis-festival-2027',
    name: 'Hemis Festival — Ladakh',
    emoji: '🙏',
    type: 'cultural',
    frequency: 'annual',
    startDate: '2027-06-22',
    endDate: '2027-06-23',
    destinations: ['Leh', 'Hemis Monastery'],
    circuitId: 'ladakh-leh',
    description: 'The largest monastic festival in Ladakh, celebrating the birth of Guru Padmasambhava. Monks perform the Cham masked dance at Hemis Monastery in elaborate costumes. Coincides with Ladakh\'s summer when roads and the monastery are fully accessible.',
    scale: 'regional',
    highlights: ['Cham masked dances by monks', 'Hemis Monastery thangkas', 'Traditional Ladakhi music', 'Rare giant thangka unveiled every 12 years'],
    tips: ['Acclimatise in Leh for 2 days first', 'Hemis is 45 km from Leh', 'Festival lasts only 2 days — book early', 'Carry warm layers even in June'],
  },
  {
    id: 'thrissur-pooram-2027',
    name: 'Thrissur Pooram — Kerala',
    emoji: '🐘',
    type: 'cultural',
    frequency: 'annual',
    startDate: '2027-04-30',
    endDate: '2027-04-30',
    destinations: ['Thrissur', 'Kochi'],
    circuitId: 'kerala-complete',
    description: 'The "mother of all temple festivals" — 30 caparisoned elephants, competing percussion ensembles, and a dazzling fireworks display in Thrissur town. A single day of unbelievable spectacle that draws lakhs of visitors every April/May.',
    scale: 'national',
    highlights: ['30 decorated elephants facing off', 'Panchavadyam percussion battle', 'Kudamattam umbrella exchange ritual', 'Pre-dawn fireworks display'],
    tips: ['Arrive a day early and find your spot', 'April in Kerala is hot — carry water', 'Kochi is 75 km away — day trip possible', 'Best viewing from rooftops nearby'],
  },
  {
    id: 'ziro-music-festival-2026',
    name: 'Ziro Music Festival — Arunachal',
    emoji: '🎸',
    type: 'cultural',
    frequency: 'annual',
    startDate: '2026-09-24',
    endDate: '2026-09-27',
    destinations: ['Ziro Valley', 'Itanagar'],
    circuitId: 'northeast-explorer',
    description: 'India\'s coolest outdoor music festival set in the pine-forested Ziro Valley of Arunachal Pradesh — home of the Apatani tribe. Indie bands, folk fusion, and local cultural performances under open skies. One of the most scenic festival venues in Asia.',
    scale: 'national',
    highlights: ['Indie & folk music under pine trees', 'Apatani tribal culture & homestays', 'Zero light pollution night sky', 'Local Apong rice beer'],
    tips: ['Inner Line Permit (ILP) required for Arunachal', 'Fly into Lilabari (Assam) and drive 3 hrs', 'September weather is post-monsoon & beautiful', 'Book camping passes months in advance'],
  },
  {
    id: 'gangasagar-mela-2027',
    name: 'Gangasagar Mela',
    emoji: '🌊',
    type: 'pilgrimage',
    frequency: 'annual',
    startDate: '2027-01-13',
    endDate: '2027-01-15',
    destinations: ['Sagar Island', 'Kolkata'],
    description: 'The second largest human gathering in the world after Kumbh — on Sagar Island where the Ganga meets the Bay of Bengal. Makar Sankranti brings millions to take a holy dip at the Kapil Muni Ashram. A logistically extraordinary event involving ferries and massive tent cities.',
    scale: 'massive',
    highlights: ['Holy dip at Ganga–Bay of Bengal confluence', 'Kapil Muni Ashram temple', 'Ferry ride to Sagar Island', 'Sadhus from across India'],
    tips: ['Kolkata to Namkhana by train, then ferry to Sagar', 'January 14 (Makar Sankranti) is the peak day', 'Start at 3 AM for less crowded bathing', 'Return same day to avoid accommodation crunch'],
  },
];

// ── Helper functions ──────────────────────────────────────────────────────────

/** Events currently happening (today falls within their window) */
export function getOngoingEvents(): MajorEvent[] {
  const t = today();
  return MAJOR_EVENTS.filter(e => {
    const start = parseDate(e.startDate);
    const end = parseDate(e.endDate);
    return t >= start && t <= end;
  });
}

/** Events starting within the next `daysAhead` days */
export function getUpcomingMajorEvents(daysAhead = 180): MajorEvent[] {
  const t = today();
  const cutoff = new Date(t);
  cutoff.setDate(cutoff.getDate() + daysAhead);
  return MAJOR_EVENTS
    .filter(e => {
      const start = parseDate(e.startDate);
      return start > t && start <= cutoff;
    })
    .sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime());
}

/** All future events sorted by start date */
export function getAllFutureEvents(): MajorEvent[] {
  const t = today();
  return MAJOR_EVENTS
    .filter(e => parseDate(e.endDate) >= t)
    .sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime());
}

/** Format a date range as human-readable string */
export function formatEventDates(event: MajorEvent): string {
  const start = parseDate(event.startDate);
  const end = parseDate(event.endDate);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  if (event.startDate === event.endDate) return start.toLocaleDateString('en-IN', opts);
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.toLocaleDateString('en-IN', opts)}`;
  }
  return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-IN', opts)}`;
}

/** Days until event starts (negative if already started) */
export function daysUntilEvent(event: MajorEvent): number {
  const t = today();
  const start = parseDate(event.startDate);
  return Math.ceil((start.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
}

/** Badge text — "Happening now", "In 3 days", "In 2 months" etc. */
export function getEventBadge(event: MajorEvent): { text: string; urgent: boolean } {
  const ongoing = getOngoingEvents().find(e => e.id === event.id);
  if (ongoing) return { text: 'Happening now', urgent: true };
  const days = daysUntilEvent(event);
  if (days <= 14) return { text: `In ${days} day${days !== 1 ? 's' : ''}`, urgent: true };
  if (days <= 60) return { text: `In ${Math.ceil(days / 7)} weeks`, urgent: false };
  const months = Math.ceil(days / 30);
  return { text: `In ${months} month${months !== 1 ? 's' : ''}`, urgent: false };
}
