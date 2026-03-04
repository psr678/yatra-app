import { describe, it, expect } from 'vitest';
import { destinations } from '@/lib/destinations-data';

describe('destinations', () => {
  it('exports 16 destinations', () => {
    expect(destinations).toHaveLength(16);
  });

  it('every destination has required fields', () => {
    destinations.forEach(d => {
      expect(d.name.length).toBeGreaterThan(0);
      expect(d.state.length).toBeGreaterThan(0);
      expect(d.emoji.length).toBeGreaterThan(0);
      expect(d.tags.length).toBeGreaterThan(0);
      expect(d.desc.length).toBeGreaterThan(0);
    });
  });

  it('has no duplicate destination names', () => {
    const names = destinations.map(d => d.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it('all tags are valid known values', () => {
    const validTags = ['women', 'single', 'winter', 'summer', 'monsoon', 'cultural', 'heritage', 'nature', 'beach', 'spiritual', 'adventure'];
    destinations.forEach(d => {
      d.tags.forEach(tag => {
        expect(validTags).toContain(tag);
      });
    });
  });
});
