import { describe, it, expect } from 'vitest';
import { indianCities } from '@/lib/cities-data';

describe('indianCities', () => {
  it('exports a non-empty array', () => {
    expect(indianCities.length).toBeGreaterThan(0);
  });

  it('has no duplicate values', () => {
    const unique = new Set(indianCities);
    const duplicates = indianCities.filter((city, i) => indianCities.indexOf(city) !== i);
    expect(duplicates).toEqual([]);
    expect(unique.size).toBe(indianCities.length);
  });

  it('contains key Indian cities', () => {
    const mustHave = ['Mumbai', 'Delhi', 'Goa', 'Bengaluru', 'Jaipur', 'Varanasi', 'Leh'];
    mustHave.forEach(city => {
      expect(indianCities).toContain(city);
    });
  });

  it('all entries are non-empty strings', () => {
    indianCities.forEach(city => {
      expect(typeof city).toBe('string');
      expect(city.trim().length).toBeGreaterThan(0);
    });
  });
});
