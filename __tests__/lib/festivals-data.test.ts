import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  festivals,
  getUpcomingFestivals,
  getThisMonthFestivals,
  getCurrentSeasonKey,
  seasonalPicks,
} from '@/lib/festivals-data';

describe('festivals array', () => {
  it('has entries for every month', () => {
    const months = new Set(festivals.map(f => f.month));
    // Should cover at least 10 distinct months
    expect(months.size).toBeGreaterThanOrEqual(10);
  });

  it('every festival has required fields', () => {
    festivals.forEach(f => {
      expect(f.name.length).toBeGreaterThan(0);
      expect(f.emoji.length).toBeGreaterThan(0);
      expect(f.month).toBeGreaterThanOrEqual(1);
      expect(f.month).toBeLessThanOrEqual(12);
      expect(f.destinations.length).toBeGreaterThan(0);
      expect(f.desc.length).toBeGreaterThan(0);
    });
  });
});

describe('getUpcomingFestivals', () => {
  it('returns the requested count', () => {
    expect(getUpcomingFestivals(3)).toHaveLength(3);
    expect(getUpcomingFestivals(1)).toHaveLength(1);
  });

  it('returns valid festival objects', () => {
    const upcoming = getUpcomingFestivals(2);
    upcoming.forEach(f => {
      expect(f.name).toBeTruthy();
      expect(f.destinations).toBeInstanceOf(Array);
    });
  });
});

describe('getThisMonthFestivals', () => {
  it('returns only festivals for the current month', () => {
    const month = new Date().getMonth() + 1;
    const result = getThisMonthFestivals();
    result.forEach(f => {
      expect(f.month).toBe(month);
    });
  });
});

describe('getCurrentSeasonKey', () => {
  it('returns one of the three valid season keys', () => {
    const season = getCurrentSeasonKey();
    expect(['winter', 'summer', 'monsoon']).toContain(season);
  });

  it('returns monsoon for July (month 7)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-15'));
    expect(getCurrentSeasonKey()).toBe('monsoon');
    vi.useRealTimers();
  });

  it('returns summer for April (month 4)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-04-10'));
    expect(getCurrentSeasonKey()).toBe('summer');
    vi.useRealTimers();
  });

  it('returns winter for December (month 12)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-01'));
    expect(getCurrentSeasonKey()).toBe('winter');
    vi.useRealTimers();
  });
});

describe('seasonalPicks', () => {
  it('has data for all three seasons', () => {
    expect(seasonalPicks.winter.destinations.length).toBeGreaterThan(0);
    expect(seasonalPicks.summer.destinations.length).toBeGreaterThan(0);
    expect(seasonalPicks.monsoon.destinations.length).toBeGreaterThan(0);
  });

  it('each season has a non-empty tip', () => {
    (['winter', 'summer', 'monsoon'] as const).forEach(s => {
      expect(seasonalPicks[s].tip.length).toBeGreaterThan(0);
    });
  });
});
