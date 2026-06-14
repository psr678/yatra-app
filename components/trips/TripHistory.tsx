'use client';

import { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { Trip } from '@/types';

interface TripHistoryProps {
  showToast: (msg: string, type?: 'success' | '') => void;
}

const DEST_EMOJIS: Record<string, string> = {
  goa: '🏖️', rajasthan: '🏜️', kerala: '🌴', manali: '🏔️', ladakh: '❄️',
  varanasi: '🕌', andaman: '🌊', coorg: '☕', ooty: '🌸', rishikesh: '🏕️',
  jaipur: '🏯', mysuru: '👑', hampi: '⛩️', shimla: '🎿', darjeeling: '🍃',
  default: '🗺️',
};

function getEmoji(destination: string) {
  const key = destination?.toLowerCase().split(' ')[0] || 'default';
  return DEST_EMOJIS[key] || DEST_EMOJIS.default;
}

export default function TripHistory({ showToast }: TripHistoryProps) {
  const { trips, deleteTrip } = useTrips();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedId === id) setExpandedId(null);
    deleteTrip(id);
    showToast('Trip deleted');
  };

  if (trips.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🗺️</div>
        <div className="empty-title">No saved trips yet</div>
        <div className="empty-sub">Generate an itinerary in the AI Trip Planner — it will automatically appear here</div>
      </div>
    );
  }

  const expandedTrip = trips.find(t => t.id === expandedId);

  return (
    <div>
      <div className="trips-grid">
        {trips.map(trip => {
          const isOpen = expandedId === trip.id;
          const emoji = getEmoji(trip.destination);
          return (
            <div
              key={trip.id}
              className="trip-card"
              style={isOpen ? { border: '1.5px solid var(--orange)', boxShadow: '0 4px 20px rgba(249,115,22,.15)' } : {}}
              onClick={() => setExpandedId(isOpen ? null : trip.id)}
            >
              <div className="trip-card-banner">
                <span className="trip-card-emoji">{emoji}</span>
                <div>
                  <div className="trip-card-title">{trip.destination}</div>
                  <div className="trip-card-meta">
                    {trip.from ? `${trip.from} → ` : ''}{trip.destination}
                  </div>
                </div>
              </div>
              <div className="trip-card-body">
                <div className="trip-card-detail">
                  📅 {trip.days} {trip.days === 1 ? 'day' : 'days'}
                  {trip.month ? ` · ${trip.month}` : ''}
                  {trip.people ? ` · ${trip.people} ${trip.people === 1 ? 'person' : 'people'}` : ''}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '10px' }}>
                  {trip.name}
                </div>
                {(trip.womenFriendly || trip.flags) && (
                  <div className="trip-flags">
                    {trip.womenFriendly && <span className="trip-flag flag-women">👩 Women Friendly</span>}
                    {trip.flags && trip.flags.split(', ').filter(f => f && f !== 'women-friendly').map(f => (
                      <span key={f} className="trip-flag">{f}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="trip-card-footer">
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isOpen ? 'var(--orange)' : 'var(--muted)' }}>
                  {isOpen ? '▲ Close itinerary' : '▼ View full itinerary'}
                </span>
                <button className="btn danger sm" onClick={e => handleDelete(trip.id, e)} style={{ fontSize: '0.75rem' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {expandedTrip && (
        <div className="trip-expand">
          <div className="trip-expand-header">
            <div className="trip-expand-title">
              <span>{getEmoji(expandedTrip.destination)}</span>
              <span>{expandedTrip.name}</span>
            </div>
            <button className="btn ghost sm" onClick={() => setExpandedId(null)}>✕ Close</button>
          </div>
          <div className="trip-expand-body">
            <MarkdownRenderer content={expandedTrip.result} />
          </div>
        </div>
      )}
    </div>
  );
}
