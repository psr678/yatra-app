'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Always start with initialValue so server and client render identically (no hydration mismatch).
  // The useEffect below syncs the real stored value after hydration.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) setStoredValue(JSON.parse(item) as T);
    } catch {
      // ignore
    }
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      try {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      } catch {
        return prev;
      }
    });
  };

  return [storedValue, setValue];
}
