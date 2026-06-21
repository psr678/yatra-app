import CIRCUITS, { type Circuit, type Region, type Vibe } from './circuits-data';

// ── Quiz question types ───────────────────────────────────────────────────────

export type TravellerMix = 'solo' | 'couple' | 'family' | 'friends';

export interface QuizAnswers {
  vibes: Vibe[];            // 1–3 vibes picked
  regions: Region[];        // 0–2 region preferences (empty = no preference)
  days: number;             // available days
  travellerMix: TravellerMix;
}

export interface CircuitMatch {
  circuit: Circuit;
  score: number;            // 0–100
  reasons: string[];        // why it matched
}

// ── Scoring weights ───────────────────────────────────────────────────────────

const WEIGHT = {
  vibeMatch: 30,            // per overlapping vibe (max ~90)
  regionMatch: 20,          // region hit
  daysInRange: 25,          // days fit comfortably
  daysClose: 12,            // days within 2 of range
  travellerFit: 15,         // traveller mix suitability
  popular: 5,               // tie-breaker bonus
} as const;

// Traveller mix → vibes that suit them
const TRAVELLER_VIBE_AFFINITY: Record<TravellerMix, Vibe[]> = {
  solo:    ['adventure', 'cultural', 'spiritual', 'nature'],
  couple:  ['romantic', 'beach', 'hill', 'nature'],
  family:  ['heritage', 'wildlife', 'beach', 'cultural'],
  friends: ['adventure', 'beach', 'hill', 'cultural'],
};

// ── Recommendation engine ─────────────────────────────────────────────────────

export function recommendCircuits(answers: QuizAnswers, topN = 3): CircuitMatch[] {
  const results: CircuitMatch[] = CIRCUITS.map(circuit => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Vibe overlap
    const vibeHits = answers.vibes.filter(v => circuit.vibes.includes(v));
    if (vibeHits.length > 0) {
      const vibeScore = Math.min(vibeHits.length * WEIGHT.vibeMatch, 70);
      score += vibeScore;
      reasons.push(`Matches your ${vibeHits.join(' & ')} interest`);
    }

    // 2. Region preference
    if (answers.regions.length === 0 || answers.regions.includes(circuit.region)) {
      score += WEIGHT.regionMatch;
      if (answers.regions.length > 0) reasons.push(`In your preferred region`);
    }

    // 3. Days fit
    if (answers.days >= circuit.daysMin && answers.days <= circuit.daysMax) {
      score += WEIGHT.daysInRange;
      reasons.push(`Fits your ${answers.days}-day window`);
    } else {
      const gap = Math.min(
        Math.abs(answers.days - circuit.daysMin),
        Math.abs(answers.days - circuit.daysMax)
      );
      if (gap <= 2) {
        score += WEIGHT.daysClose;
        reasons.push(`Close to your ${answers.days} days (recommended ${circuit.daysMin}–${circuit.daysMax})`);
      }
    }

    // 4. Traveller mix fit
    const affinityVibes = TRAVELLER_VIBE_AFFINITY[answers.travellerMix];
    const travellerHit = affinityVibes.some(v => circuit.vibes.includes(v));
    if (travellerHit) {
      score += WEIGHT.travellerFit;
      reasons.push(`Great for ${answers.travellerMix === 'friends' ? 'groups' : answers.travellerMix + 's'}`);
    }

    // 5. Popularity tie-breaker
    if (circuit.popular) score += WEIGHT.popular;

    return { circuit, score, reasons: reasons.slice(0, 3) };
  });

  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// ── Quiz question definitions ────────────────────────────────────────────────

export interface QuizQuestion {
  id: keyof QuizAnswers | 'vibes' | 'regions' | 'days' | 'travellerMix';
  question: string;
  subtitle?: string;
  type: 'multi-select' | 'single-select' | 'number';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'travellerMix',
    question: 'Who\'s travelling?',
    subtitle: 'This shapes the kind of experiences we\'ll suggest',
    type: 'single-select',
  },
  {
    id: 'vibes',
    question: 'What excites you most?',
    subtitle: 'Pick up to 3 — we\'ll match you to the right circuits',
    type: 'multi-select',
  },
  {
    id: 'days',
    question: 'How many days do you have?',
    subtitle: 'We\'ll only show circuits that fit your window',
    type: 'number',
  },
];

export const TRAVELLER_OPTIONS: { value: TravellerMix; label: string; icon: string; desc: string }[] = [
  { value: 'solo',    label: 'Solo',    icon: '🧳', desc: 'Just me — freedom & flexibility' },
  { value: 'couple',  label: 'Couple',  icon: '💑', desc: 'Two of us — romantic & memorable' },
  { value: 'family',  label: 'Family',  icon: '👨‍👩‍👧', desc: 'With kids — comfortable & fun for all' },
  { value: 'friends', label: 'Friends', icon: '🎊', desc: 'A group — adventure & shared fun' },
];

export const VIBE_OPTIONS: { value: Vibe; label: string; icon: string }[] = [
  { value: 'heritage',   label: 'Heritage',      icon: '🏰' },
  { value: 'beach',      label: 'Beach',          icon: '🏖️' },
  { value: 'hill',       label: 'Mountains',      icon: '🏔️' },
  { value: 'wildlife',   label: 'Wildlife',       icon: '🐯' },
  { value: 'spiritual',  label: 'Spiritual',      icon: '🙏' },
  { value: 'adventure',  label: 'Adventure',      icon: '🧗' },
  { value: 'romantic',   label: 'Romantic',       icon: '💑' },
  { value: 'cultural',   label: 'Culture & Food', icon: '🎨' },
  { value: 'nature',     label: 'Nature',         icon: '🌿' },
];

export const REGION_OPTIONS: { value: Region; label: string; icon: string; states: string }[] = [
  { value: 'north',     label: 'North India',     icon: '🕌', states: 'Delhi, UP, Himachal, Uttarakhand, J&K' },
  { value: 'south',     label: 'South India',     icon: '🛕', states: 'Kerala, Tamil Nadu, Karnataka, AP' },
  { value: 'east',      label: 'East India',      icon: '🌊', states: 'West Bengal, Odisha, Bihar, Andaman' },
  { value: 'west',      label: 'West India',      icon: '🐪', states: 'Rajasthan, Gujarat, Goa, Maharashtra' },
  { value: 'central',   label: 'Central India',   icon: '🐅', states: 'Madhya Pradesh, Chhattisgarh' },
  { value: 'northeast', label: 'Northeast',       icon: '🌿', states: 'Assam, Meghalaya, Sikkim, Arunachal' },
];
