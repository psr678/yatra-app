import { describe, it, expect } from 'vitest';
import { buildItineraryPrompt, buildChecklistPrompt, buildSeasonalTipPrompt, buildWomenTipPrompt } from '@/lib/prompts';
import type { PlannerFormData } from '@/types';

const baseFormData: PlannerFormData = {
  from: 'Mumbai',
  to: 'Goa',
  numDays: 3,
  month: 'December',
  budget: 'moderate',
  age: 'adult',
  interests: 'beaches',
  people: 2,
  travellerType: 'Couple',
  womenFriendly: false,
  spiritual: false,
  adventure: false,
  senior: false,
};

describe('buildItineraryPrompt', () => {
  it('includes the destination', () => {
    const prompt = buildItineraryPrompt(baseFormData);
    expect(prompt).toContain('Goa');
  });

  it('includes number of days', () => {
    const prompt = buildItineraryPrompt(baseFormData);
    expect(prompt).toContain('3-day');
  });

  it('includes travel month when provided', () => {
    const prompt = buildItineraryPrompt(baseFormData);
    expect(prompt).toContain('December');
  });

  it('includes women-friendly flag when enabled', () => {
    const prompt = buildItineraryPrompt({ ...baseFormData, womenFriendly: true });
    expect(prompt).toContain('women-friendly');
  });

  it('includes all required sections', () => {
    const prompt = buildItineraryPrompt(baseFormData);
    expect(prompt).toContain('Day-by-Day Itinerary');
    expect(prompt).toContain('Budget Breakdown');
    expect(prompt).toContain('Local Food Guide');
    expect(prompt).toContain('Where to Stay');
  });

  it('falls back gracefully when from is empty', () => {
    const prompt = buildItineraryPrompt({ ...baseFormData, from: '' });
    expect(prompt).toContain('India');
  });
});

describe('buildChecklistPrompt', () => {
  it('includes the destination', () => {
    expect(buildChecklistPrompt('Ladakh', 'June', 'adult', false)).toContain('Ladakh');
  });

  it('mentions female traveller when womenFriendly is true', () => {
    expect(buildChecklistPrompt('Goa', 'March', 'adult', true)).toContain('Female');
  });

  it('falls back to India when no destination', () => {
    expect(buildChecklistPrompt('', '', '', false)).toContain('India');
  });
});

describe('buildSeasonalTipPrompt', () => {
  it('includes destination and month', () => {
    const prompt = buildSeasonalTipPrompt('Shimla', 'January');
    expect(prompt).toContain('Shimla');
    expect(prompt).toContain('January');
  });
});

describe('buildWomenTipPrompt', () => {
  it('includes the destination', () => {
    expect(buildWomenTipPrompt('Jaipur')).toContain('Jaipur');
  });

  it('mentions safety', () => {
    expect(buildWomenTipPrompt('Kerala').toLowerCase()).toContain('safety');
  });
});
