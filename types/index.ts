export type TabId = 'planner' | 'itinerary' | 'budget' | 'checklist' | 'destinations' | 'links';

export interface Trip {
  id: number;
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
