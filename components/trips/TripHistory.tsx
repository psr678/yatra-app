'use client';

import { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { Trip } from '@/types';

interface TripHistoryProps {
  showToast: (msg: string, type?: 'success' | '') => void;
}

export default function TripHistory({ showToast }: TripHistoryProps) {
  const { trips, deleteTrip } = useTrips();
  const [viewingTrip, setViewingTrip] = useState<Trip | null>(null);

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTrip(id);
    if (viewingTrip?.id === id) setViewingTrip(null);
    showToast('Trip deleted');
  };

  return (
    <div>
      <div className="section-title">📚 Saved Trips</div>
      <p className="section-sub">Your generated itineraries — click to view</p>

      {trips.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '0.9rem' }}>No trips saved yet. Generate an itinerary and it will appear here!</p>
      ) : (
        <div className="trip-list">
          {trips.map(trip => (
            <div key={trip.id} className="trip-list-card" onClick={() => setViewingTrip(viewingTrip?.id === trip.id ? null : trip)}>
              <div>
                <h4>🗺️ {trip.name}</h4>
                <p>{trip.from ? trip.from + ' → ' : ''}{trip.destination}{trip.month ? ' | ' + trip.month : ''}</p>
                <div className="trip-flags">
                  {trip.womenFriendly && <span className="trip-flag flag-women">👩 Women Friendly</span>}
                  {trip.flags && <span className="trip-flag flag-single">{trip.flags}</span>}
                </div>
              </div>
              <button className="btn danger sm" onClick={e => handleDelete(trip.id, e)}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      {viewingTrip && (
        <div className="ai-box ai-box-animate">
          <div className="ai-box-header">
            <span className="ai-sparkle">✨</span>
            <span>{viewingTrip.name}</span>
            <button className="btn sm danger" style={{ marginLeft: 'auto' }} onClick={() => setViewingTrip(null)}>✕ Close</button>
          </div>
          <MarkdownRenderer content={viewingTrip.result} />
        </div>
      )}
    </div>
  );
}
