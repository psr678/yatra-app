'use client';

import { useState, useEffect } from 'react';
import { defaultChecklist } from '@/lib/checklist-defaults';
import type { ChecklistData } from '@/types';

export const getCheckKey = (section: string, i: number) =>
  `check_${btoa(encodeURIComponent(`${section}_${i}`))}`;

export function useChecklist() {
  const [checklist] = useState<ChecklistData>(defaultChecklist);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const state: Record<string, boolean> = {};
    Object.entries(checklist).forEach(([section, items]) => {
      items.forEach((_, i) => {
        const key = getCheckKey(section, i);
        state[key] = localStorage.getItem(key) === '1';
      });
    });
    setChecked(state);
  }, [checklist]);

  const toggleItem = (section: string, i: number) => {
    const key = getCheckKey(section, i);
    const next = !checked[key];
    setChecked(prev => ({ ...prev, [key]: next }));
    localStorage.setItem(key, next ? '1' : '0');
  };

  const resetAll = () => {
    const state: Record<string, boolean> = {};
    Object.entries(checklist).forEach(([section, items]) => {
      items.forEach((_, i) => {
        const key = getCheckKey(section, i);
        localStorage.removeItem(key);
        state[key] = false;
      });
    });
    setChecked(state);
  };

  const totalItems = Object.values(checklist).reduce((sum, items) => sum + items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return { checklist, checked, toggleItem, resetAll, totalItems, checkedCount };
}
