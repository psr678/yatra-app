export type TabId = 'planner' | 'itinerary' | 'budget' | 'checklist' | 'destinations' | 'links';

export type PlannerMode = 'destination' | 'circuit' | 'scenario' | 'quiz';

export interface TripSelection {
  mode: PlannerMode;
  /** Destination string fed to the AI prompt */
  destination: string;
  /** Human-readable label shown in the form pill */
  label: string;
  /** Suggested days to pre-fill */
  suggestedDays?: number;
  /** Circuit id when mode==='circuit' */
  circuitId?: string;
  /** Ordered city list for circuit mode */
  cities?: string[];
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  from: string;
  days: number;
  people: number;
  month: string;
  result: string;
  womenFriendly: boolean;
  flags: string;
}

export interface Expense {
  id: number;
  cat: string;
  desc: string;
  amount: number;
}

export interface Destination {
  name: string;
  state: string;
  emoji: string;
  tags: string[];
  desc: string;
}

export interface PlannerFormData {
  from: string;
  to: string;
  numDays: number;
  month: string;
  budget: string;
  age: string;
  interests: string;
  people: number;
  travellerType: string;
  womenFriendly: boolean;
  spiritual: boolean;
  adventure: boolean;
  senior: boolean;
}

export type ChecklistData = Record<string, string[]>;
