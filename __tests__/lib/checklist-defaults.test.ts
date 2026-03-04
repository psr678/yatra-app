import { describe, it, expect } from 'vitest';
import { defaultChecklist } from '@/lib/checklist-defaults';

describe('defaultChecklist', () => {
  it('has 6 sections', () => {
    expect(Object.keys(defaultChecklist)).toHaveLength(6);
  });

  it('every section has at least one item', () => {
    Object.entries(defaultChecklist).forEach(([section, items]) => {
      expect(items.length, `Section "${section}" is empty`).toBeGreaterThan(0);
    });
  });

  it('no item is an empty string', () => {
    Object.values(defaultChecklist).flat().forEach(item => {
      expect(item.trim().length).toBeGreaterThan(0);
    });
  });

  it('contains Documents section with Aadhar card', () => {
    const docs = defaultChecklist['📄 Documents'];
    expect(docs).toBeDefined();
    expect(docs.some(i => i.toLowerCase().includes('aadhar'))).toBe(true);
  });
});
