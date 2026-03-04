import { describe, it, expect, beforeEach } from 'vitest';
import { getCheckKey } from '@/hooks/useChecklist';

describe('getCheckKey', () => {
  it('returns a string starting with check_', () => {
    const key = getCheckKey('📄 Documents', 0);
    expect(key).toMatch(/^check_/);
  });

  it('produces different keys for different indices', () => {
    expect(getCheckKey('📄 Documents', 0)).not.toBe(getCheckKey('📄 Documents', 1));
  });

  it('produces different keys for different sections', () => {
    expect(getCheckKey('📄 Documents', 0)).not.toBe(getCheckKey('👗 Clothing', 0));
  });

  it('is stable — same input always gives same output', () => {
    expect(getCheckKey('🎒 Essentials', 3)).toBe(getCheckKey('🎒 Essentials', 3));
  });

  it('matches the original btoa(encodeURIComponent()) formula', () => {
    const section = '📄 Documents';
    const i = 2;
    const expected = `check_${btoa(encodeURIComponent(`${section}_${i}`))}`;
    expect(getCheckKey(section, i)).toBe(expected);
  });
});
