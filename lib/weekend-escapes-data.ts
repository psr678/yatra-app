/**
 * Long weekend & holiday escape suggestions — auto-surfaced by current date.
 * Each entry maps to an Indian public holiday / school break.
 * Escapes are 2–4 day short trips, not multi-city circuits.
 */

export interface QuickEscape {
  destination: string;
  duration: string;         // e.g. "2N/3D"
  /** Comma-separated nearest departure cities */
  from: string;
  why: string;              // one-line hook
  tags: string[];
}

export interface WeekendEscape {
  id: string;
  holiday: string;
  emoji: string;
  /** 1–12 */
  month: number;
  /** Day of month. For variable holidays (Holi, Diwali) this is an approximation */
  day: number;
  /** Calendar year if one-time; 0 = recurring annually */
  year: number;
  /**
   * Override the computed weekend length for special cases (e.g. multi-week summer
   * holidays). Leave undefined to use the auto-computed value from the day of week.
   */
  fixedDays?: number;
  tagline: string;
  escapes: QuickEscape[];
}

export const WEEKEND_ESCAPES: WeekendEscape[] = [

  // ── REPUBLIC DAY ─────────────────────────────────────────────────
  {
    id: 'republic-day',
    holiday: 'Republic Day Long Weekend',
    emoji: '🇮🇳',
    month: 1, day: 26, year: 0,
    tagline: 'Jan 26 is often a Friday or Monday — perfect for a patriotic getaway',
    escapes: [
      { destination: 'Agra', duration: '2N/3D', from: 'Delhi, Jaipur', why: 'Taj Mahal at sunrise in peak winter — clear skies, cool air', tags: ['heritage', 'romance'] },
      { destination: 'Jaipur', duration: '2N/3D', from: 'Delhi, Agra', why: 'Pink City forts and bazaars in ideal winter weather', tags: ['heritage', 'culture'] },
      { destination: 'Rishikesh', duration: '2N/3D', from: 'Delhi, Dehradun', why: 'River rafting + yoga retreat when the Ganga is calm and crisp', tags: ['adventure', 'spiritual'] },
      { destination: 'Coorg', duration: '2N/3D', from: 'Bengaluru, Mysuru', why: 'Coffee estates in full winter bloom — misty mornings and warm afternoons', tags: ['nature', 'hill'] },
    ],
  },

  // ── GOOD FRIDAY / EASTER ─────────────────────────────────────────
  {
    id: 'good-friday-2026',
    holiday: 'Good Friday Long Weekend',
    emoji: '✝️',
    month: 4, day: 3, year: 2026,
    fixedDays: 4,
    tagline: 'Good Friday + Easter Sunday = a rare 4-day weekend in early April',
    escapes: [
      { destination: 'Goa', duration: '3N/4D', from: 'Mumbai, Bengaluru, Pune', why: 'Easter masses at Old Goa basilicas + beach time before the summer rush', tags: ['beach', 'cultural'] },
      { destination: 'Munnar', duration: '2N/3D', from: 'Kochi, Bengaluru', why: 'Tea estates before the monsoon — misty hills and cool 18°C days', tags: ['hill', 'nature'] },
      { destination: 'Ooty & Kodaikanal', duration: '3N/4D', from: 'Chennai, Bengaluru, Coimbatore', why: 'Hill stations in full spring bloom — rhododendrons and clear views', tags: ['hill', 'nature'] },
      { destination: 'Alleppey', duration: '2N/3D', from: 'Kochi, Thiruvananthapuram', why: 'Houseboat backwaters — Easter is peak season before April heat', tags: ['nature', 'romance'] },
      { destination: 'Pondicherry', duration: '2N/3D', from: 'Chennai, Bengaluru', why: 'French Quarter churches for Easter service + beachside cafés', tags: ['cultural', 'beach'] },
    ],
  },

  // ── GOOD FRIDAY 2027 ─────────────────────────────────────────────
  {
    id: 'good-friday-2027',
    holiday: 'Good Friday Long Weekend',
    emoji: '✝️',
    month: 3, day: 26, year: 2027,
    fixedDays: 4,
    tagline: 'Good Friday + Easter Sunday = a rare 4-day weekend in late March',
    escapes: [
      { destination: 'Goa', duration: '3N/4D', from: 'Mumbai, Bengaluru, Pune', why: 'Easter masses at Old Goa basilicas + beach time before the summer rush', tags: ['beach', 'cultural'] },
      { destination: 'Munnar', duration: '2N/3D', from: 'Kochi, Bengaluru', why: 'Tea estates in ideal spring weather — lush green hills and misty mornings', tags: ['hill', 'nature'] },
      { destination: 'Pondicherry', duration: '2N/3D', from: 'Chennai, Bengaluru', why: 'French Quarter churches for Easter service + promenade beach', tags: ['cultural', 'beach'] },
      { destination: 'Coorg', duration: '2N/3D', from: 'Bengaluru, Mysuru', why: 'Coffee estates in spring bloom — cooler than coastal areas', tags: ['nature', 'hill'] },
    ],
  },

  // ── SUMMER HOLIDAYS (MAY–JUNE) ───────────────────────────────────
  {
    id: 'summer-holidays',
    holiday: 'Summer Holidays',
    emoji: '☀️',
    month: 5, day: 1, year: 0,
    fixedDays: 45,
    tagline: 'May–June school break — beat the heat with hill stations and snowy peaks',
    escapes: [
      { destination: 'Manali', duration: '4N/5D', from: 'Delhi, Chandigarh', why: 'Snow-capped Rohtang Pass and cool 15°C days while the plains sizzle at 45°C', tags: ['hill', 'adventure'] },
      { destination: 'Shimla & Kufri', duration: '3N/4D', from: 'Delhi, Chandigarh', why: 'Colonial charm + apple orchards in bloom — the classic family summer escape', tags: ['hill', 'family'] },
      { destination: 'Mussoorie', duration: '2N/3D', from: 'Delhi, Dehradun', why: 'Queen of Hill Stations — Cable car, Kempty Falls and Landour walks', tags: ['hill', 'family'] },
      { destination: 'Ooty & Coonoor', duration: '3N/4D', from: 'Chennai, Bengaluru, Coimbatore', why: 'Nilgiri Mountain Railway + tea estate stays at 25°C when Chennai hits 40°C', tags: ['hill', 'nature', 'family'] },
      { destination: 'Darjeeling', duration: '3N/4D', from: 'Kolkata, Siliguri', why: 'Toy train + Kanchenjunga sunrise views — ideal in May before the monsoon', tags: ['hill', 'nature', 'family'] },
      { destination: 'Nainital', duration: '2N/3D', from: 'Delhi', why: 'Lake walks, cable car to Snow View Point — easy 6-hour drive from Delhi', tags: ['hill', 'family'] },
      { destination: 'Spiti Valley', duration: '5N/6D', from: 'Chandigarh, Manali', why: 'The road to Spiti opens in June — stark moonscapes, ancient monasteries, 4WD adventure', tags: ['adventure', 'nature'] },
    ],
  },

  // ── INDEPENDENCE DAY ─────────────────────────────────────────────
  {
    id: 'independence-day',
    holiday: 'Independence Day Long Weekend',
    emoji: '🇮🇳',
    month: 8, day: 15, year: 0,
    tagline: 'Aug 15 — great time for hill stations before the monsoon ends',
    escapes: [
      { destination: 'Coorg', duration: '2N/3D', from: 'Bengaluru, Mysuru', why: 'Post-monsoon — coffee estates lush green with waterfalls at peak flow', tags: ['nature', 'hill'] },
      { destination: 'Mahabaleshwar', duration: '2N/3D', from: 'Mumbai, Pune', why: 'Strawberry farms + Valley views in full monsoon green glory', tags: ['hill', 'nature'] },
      { destination: 'Ladakh', duration: '4N/5D', from: 'Delhi (fly)', why: 'August is Ladakh\'s best month — Hemis area and Nubra Valley accessible', tags: ['adventure', 'nature'] },
      { destination: 'Cherrapunji', duration: '3N/4D', from: 'Guwahati, Kolkata (fly)', why: 'World\'s rainiest place at peak — living root bridges and waterfalls at maximum force', tags: ['nature', 'adventure'] },
    ],
  },

  // ── GANDHI JAYANTI ───────────────────────────────────────────────
  {
    id: 'gandhi-jayanti',
    holiday: 'Gandhi Jayanti Weekend',
    emoji: '🕊️',
    month: 10, day: 2, year: 0,
    tagline: 'Oct 2 is a national holiday — check the calendar for this year\'s long weekend potential',
    escapes: [
      { destination: 'Rajasthan (Pushkar / Ajmer)', duration: '2N/3D', from: 'Delhi, Jaipur', why: 'October begins Rajasthan\'s peak season — Pushkar Fair preparations start', tags: ['spiritual', 'cultural'] },
      { destination: 'Hampi', duration: '2N/3D', from: 'Bengaluru, Hyderabad', why: 'Post-monsoon Hampi — ruins in green setting before the winter rush', tags: ['heritage', 'adventure'] },
      { destination: 'Goa', duration: '2N/3D', from: 'Mumbai, Bengaluru', why: 'Oct 2 marks start of Goa season — lush post-monsoon green + beach opening', tags: ['beach', 'nature'] },
      { destination: 'Kaziranga', duration: '3N/4D', from: 'Guwahati', why: 'Park re-opens for the season in October — one-horned rhinos post-monsoon', tags: ['wildlife', 'nature'] },
    ],
  },

  // ── DUSSEHRA ─────────────────────────────────────────────────────
  // Note: destinations here are WHERE THE FESTIVAL IS BEST (Mysore Dasara, Kullu Dussehra).
  // Navratri & general Dussehra destinations are in festivals-data.ts.
  {
    id: 'dussehra',
    holiday: 'Dussehra Long Weekend',
    emoji: '🏹',
    month: 10, day: 12, year: 0,
    tagline: 'Vijaya Dashami — the holiday itself is the destination; these are the best places to witness it',
    escapes: [
      { destination: 'Mysuru', duration: '2N/3D', from: 'Bengaluru, Chennai', why: 'Mysore Dasara — royal palace lit with 100,000 lights, grandest procession in India', tags: ['cultural', 'heritage'] },
      { destination: 'Kullu', duration: '3N/4D', from: 'Delhi, Chandigarh', why: 'Kullu Dussehra — 7-day international festival unique to Himachal, hill deities on parade', tags: ['cultural', 'adventure', 'hill'] },
      { destination: 'Spiti Valley', duration: '4N/5D', from: 'Manali, Chandigarh', why: 'October is Spiti\'s last clear window — monasteries and high-altitude passes before snowfall', tags: ['adventure', 'nature'] },
      { destination: 'Kaziranga', duration: '3N/4D', from: 'Guwahati', why: 'Rhino safari season opens in October — one-horned rhinos post-monsoon', tags: ['wildlife', 'nature'] },
    ],
  },

  // ── DIWALI ───────────────────────────────────────────────────────
  {
    id: 'diwali',
    holiday: 'Diwali Long Weekend',
    emoji: '🪔',
    month: 11, day: 1, year: 0,
    tagline: 'Diwali + Dhanteras creates a 4–5 day stretch — India\'s biggest travel weekend, book early',
    escapes: [
      { destination: 'Varanasi', duration: '2N/3D', from: 'Delhi, Lucknow', why: 'Dev Deepawali 15 days after Diwali — 84 ghats lit with a million lamps, the most spectacular night in India', tags: ['spiritual', 'cultural'] },
      { destination: 'Goa', duration: '3N/4D', from: 'Mumbai, Bengaluru', why: 'Peak season just opens — perfect weather, pre-Christmas prices, beach quieter than December', tags: ['beach', 'nature'] },
      { destination: 'Andaman Islands', duration: '4N/5D', from: 'Chennai, Kolkata (fly)', why: 'November is Andaman\'s best month — calm sea, clear water, great visibility for snorkelling', tags: ['beach', 'nature'] },
      { destination: 'Ranthambore', duration: '2N/3D', from: 'Delhi, Jaipur', why: 'Tiger safari in peak post-monsoon season — vegetation lower, visibility at its best', tags: ['wildlife', 'nature'] },
      { destination: 'Pondicherry', duration: '2N/3D', from: 'Chennai, Bengaluru', why: 'French Quarter cafés and beach promenade in ideal November weather — uncrowded', tags: ['cultural', 'beach'] },
    ],
  },

  // ── CHRISTMAS / YEAR END ─────────────────────────────────────────
  {
    id: 'christmas-new-year',
    holiday: 'Christmas & New Year',
    emoji: '🎄',
    month: 12, day: 25, year: 0,
    fixedDays: 8,
    tagline: 'Dec 25–Jan 1 — India\'s busiest travel week. Book 3+ months ahead for good rates',
    escapes: [
      { destination: 'Goa', duration: '5N/6D', from: 'Mumbai, Delhi, Bengaluru', why: 'India\'s Christmas capital — Midnight Mass at Basilica of Bom Jesus + beach countdown', tags: ['beach', 'cultural'] },
      { destination: 'Kerala (Alleppey + Munnar)', duration: '5N/6D', from: 'Kochi (fly)', why: 'Backwaters + hill stations in peak season — the perfect December combo', tags: ['nature', 'romance', 'hill'] },
      { destination: 'Rajasthan (Jaipur + Jodhpur)', duration: '5N/6D', from: 'Delhi, Mumbai', why: 'Peak Rajasthan weather — desert safari and fort-hopping in cool 20°C', tags: ['heritage', 'adventure'] },
      { destination: 'Andaman Islands', duration: '5N/6D', from: 'Chennai, Kolkata (fly)', why: 'Crystal-clear water, Radhanagar beach — Christmas on a tropical island', tags: ['beach', 'nature'] },
      { destination: 'Rann of Kutch', duration: '4N/5D', from: 'Ahmedabad', why: 'Rann Utsav peak season — white salt desert under the full moon in December', tags: ['cultural', 'nature'] },
    ],
  },

];

// ── Helper functions ──────────────────────────────────────────────────────────

function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Compute effective long-weekend length from the actual day of week the holiday falls on.
 *
 * Logic (Sun=0, Mon=1, ..., Sat=6):
 *  - Fri (5) → Fri+Sat+Sun = 3 days
 *  - Mon (1) → Sat+Sun+Mon = 3 days
 *  - Thu (4) → Thu+Fri+Sat+Sun = 4 days (bridge one workday to get a 4-day weekend)
 *  - Tue (2) → Sat+Sun+Mon+Tue = 4 days (bridge Monday)
 *  - Sat (6) → holiday IS the weekend = Sat+Sun = 2 days (no bonus)
 *  - Sun (0) → holiday IS the weekend = Sat+Sun = 2 days (no bonus)
 *  - Wed (3) → isolated mid-week day = just 1 extra day (holiday only)
 */
function computeWeekendDays(year: number, month: number, day: number): number {
  const dow = new Date(year, month - 1, day).getDay(); // 0=Sun … 6=Sat
  if (dow === 5) return 3; // Friday holiday → Fri–Sun
  if (dow === 1) return 3; // Monday holiday → Sat–Mon
  if (dow === 4) return 4; // Thursday holiday → Thu–Sun (bridge Fri)
  if (dow === 2) return 4; // Tuesday holiday → Sat–Tue (bridge Mon)
  if (dow === 6 || dow === 0) return 2; // falls on a weekend — no bonus
  return 1; // Wednesday — isolated
}

/** Resolve the actual holiday date for an escape (handles recurring year=0 events) */
function resolveYear(e: WeekendEscape): number {
  if (e.year > 0) return e.year;
  const t = todayDate();
  const thisYear = t.getFullYear();
  const holidayThisYear = new Date(thisYear, e.month - 1, e.day);
  return holidayThisYear < t ? thisYear + 1 : thisYear;
}

/** Total days in this window (fixedDays overrides computed value) */
export function getEscapeDays(e: WeekendEscape): number {
  if (e.fixedDays !== undefined) return e.fixedDays;
  return computeWeekendDays(resolveYear(e), e.month, e.day);
}

/** Day label shown in the UI: "3-day weekend", "2-day weekend", "4-day weekend" etc. */
export function getEscapeDayLabel(e: WeekendEscape): string {
  const days = getEscapeDays(e);
  if (e.fixedDays && e.fixedDays > 7) return `${e.fixedDays}-day break`; // summer holidays
  if (days === 2) return '2-day weekend (holiday falls on weekend)';
  return `${days}-day long weekend`;
}

/** Days until the holiday starts (negative if already started) */
function daysUntilEscape(e: WeekendEscape): number {
  const t = todayDate();
  const year = resolveYear(e);
  const target = new Date(year, e.month - 1, e.day);
  return Math.ceil((target.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
}

/** Returns upcoming weekend escapes within `daysAhead`, sorted by date */
export function getUpcomingEscapes(daysAhead = 90): WeekendEscape[] {
  return WEEKEND_ESCAPES
    .filter(e => {
      const days = daysUntilEscape(e);
      const window = getEscapeDays(e);
      return days >= -window && days <= daysAhead; // include ongoing
    })
    .sort((a, b) => daysUntilEscape(a) - daysUntilEscape(b));
}

/** Badge: "In 3 days", "In 2 weeks", "Happening now" */
export function getEscapeBadge(e: WeekendEscape): { text: string; urgent: boolean } {
  const days = daysUntilEscape(e);
  const window = getEscapeDays(e);
  if (days <= 0 && days >= -window) return { text: 'Happening now', urgent: true };
  if (days <= 7)  return { text: `In ${days} day${days !== 1 ? 's' : ''}`, urgent: true };
  if (days <= 30) return { text: `In ${Math.ceil(days / 7)} week${Math.ceil(days / 7) !== 1 ? 's' : ''}`, urgent: false };
  const months = Math.ceil(days / 30);
  return { text: `In ${months} month${months !== 1 ? 's' : ''}`, urgent: false };
}
