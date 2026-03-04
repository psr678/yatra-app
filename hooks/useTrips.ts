'use client';

import { useLocalStorage } from './useLocalStorage';
import type { Trip } from '@/types';

export function useTrips() {
  const [trips, setTrips] = useLocalStorage<Trip[]>('yatra_trips', []);

  const addTrip = (trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
  };

  const deleteTrip = (id: number) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  };

  return { trips, addTrip, deleteTrip };
}
