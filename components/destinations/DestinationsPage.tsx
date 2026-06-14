'use client';

import { useState } from 'react';
import { destinations } from '@/lib/destinations-data';
import { getUpcomingFestivals, getThisMonthFestivals, seasonalPicks, getCurrentSeasonKey } from '@/lib/festivals-data';
import DestCard from './DestCard';
import SeasonalGuide from './SeasonalGuide';

interface DestinationsPageProps {
  initialFilter?: string;
  plannerContext: { to?: string; month?: string };
  onPlanTrip: (destination: string) => void;
  showToast: (msg: string, type?: 'success' | '') => void;
}

const FILTERS = [
  { label: 'All',        value: 'all',       icon: '🌏' },
  { label: 'Women-Safe', value: 'women',     icon: '👩' },
  { label: 'Solo',       value: 'single',    icon: '🧳' },
  { label: 'Beach',      value: 'beach',     icon: '🏖️' },
  { label: 'Heritage',   value: 'heritage',  icon: '🏛️' },
  { label: 'Spiritual',  value: 'spiritual', icon: '🙏' },
  { label: 'Adventure',  value: 'adventure', icon: '🧗' },
  { label: 'Nature',     value: 'nature',    icon: '🌿' },
  { label: 'Winter',     value: 'winter',    icon: '❄️' },
  { label: 'Summer',     value: 'summer',    icon: '☀️' },
  { label: 'Monsoon',    value: 'monsoon',   icon: '🌧️' },
];

const SEASON_META = {
  winter:  { icon: '❄️', label: 'Winter (Oct–Feb)' },
  summer:  { icon: '☀️', label: 'Summer (Mar–Jun)' },
  monsoon: { icon: '🌧️', label: 'Monsoon (Jul–Sep)' },
};

export default function DestinationsPage({ initialFilter, plannerContext, onPlanTrip, showToast }: DestinationsPageProps) {
  const [currentFilter, setCurrentFilter] = useState(initialFilter || 'all');

  const season = getCurrentSeasonKey();
  const seasonInfo = seasonalPicks[season];
  const meta = SEASON_META[season];
  const upcomingFestivals = getUpcomingFestivals(3);
  const thisMonthFestivals = getThisMonthFestivals();

  const filtered = currentFilter === 'all' ? destinations : destinations.filter(d => d.tags.includes(currentFilter));

  const handlePlanTrip = (name: string) => {
    onPlanTrip(name);
    showToast(`📍 ${name} selected! Switch to Plan Trip to generate your itinerary.`, 'success');
  };

  return (
    <div>
      {/* Trending now banner */}
      <div className="info-banner">
        <div className="info-banner-row">
          <div className="info-banner-icon">{meta.icon}</div>
          <div>
            <div className="info-banner-title">Trending Now — {meta.label}</div>
            <div className="info-banner-sub">{seasonInfo.tip}</div>
            <div className="info-banner-chips">
              {seasonInfo.destinations.map(dest => (
                <button key={dest} className="info-chip" onClick={() => handlePlanTrip(dest)}>
                  📍 {dest}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming festivals */}
      {upcomingFestivals.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
            🎉 Upcoming Festivals — Plan Around Them
          </div>
          <div className="festival-grid">
            {upcomingFestivals.map(fest => (
              <div key={fest.name} className="festival-card">
                <div className="festival-top">
                  <span className="festival-emoji">{fest.emoji}</span>
                  <div>
                    <div className="festival-name">{fest.name}</div>
                    <div className="festival-month">
                      {new Date(2025, fest.month - 1).toLocaleString('en-IN', { month: 'long' })}
                    </div>
                  </div>
                </div>
                <div className="festival-desc">{fest.desc}</div>
                <div className="festival-dests">
                  {fest.destinations.slice(0, 3).map(d => (
                    <button key={d} className="fdest-btn" onClick={() => handlePlanTrip(d)}>
                      📍 {d}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* This month */}
      {thisMonthFestivals.length > 0 && (
        <div className="card" style={{ marginBottom: '28px', borderLeft: '4px solid var(--gold)' }}>
          <div style={{ fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)', marginBottom: '14px' }}>
            🎊 This Month&apos;s Highlights
          </div>
          {thisMonthFestivals.map(fest => (
            <div key={fest.name} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1, flexShrink: 0 }}>{fest.emoji}</span>
              <div>
                <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{fest.name}</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.84rem' }}> — {fest.desc}</span>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {fest.destinations.map(d => (
                    <button key={d} className="fdest-btn" onClick={() => handlePlanTrip(d)}>📍 {d}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="filter-strip">
        <span className="filter-label">Filter:</span>
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-pill ${currentFilter === f.value ? 'active' : ''}`}
            onClick={() => setCurrentFilter(f.value)}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Destination grid */}
      <div className="dest-grid">
        {filtered.map(dest => (
          <DestCard key={dest.name} dest={dest} onPlanTrip={handlePlanTrip} />
        ))}
      </div>

      {/* Seasonal guide */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '36px' }}>
        <SeasonalGuide plannerContext={plannerContext} showToast={showToast} />
      </div>

      <p style={{ fontSize: '0.72rem', color: 'var(--subtle)', marginTop: '24px', lineHeight: 1.7, textAlign: 'center' }}>
        ℹ️ Information is for general guidance. Always check official tourism portals and travel advisories before travel.
      </p>
    </div>
  );
}
