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

const filters = [
  { label: '🌏 All', value: 'all' },
  { label: '👩 Women-Friendly', value: 'women' },
  { label: '🧳 Solo', value: 'single' },
  { label: '❄️ Winter', value: 'winter' },
  { label: '☀️ Summer', value: 'summer' },
  { label: '🌧️ Monsoon', value: 'monsoon' },
  { label: '🏖️ Beach', value: 'beach' },
  { label: '🙏 Spiritual', value: 'spiritual' },
  { label: '🧗 Adventure', value: 'adventure' },
  { label: '🏛️ Heritage', value: 'heritage' },
  { label: '🌿 Nature', value: 'nature' },
];

export default function DestinationsPage({ initialFilter, plannerContext, onPlanTrip, showToast }: DestinationsPageProps) {
  const [currentFilter, setCurrentFilter] = useState(initialFilter || 'all');

  const season = getCurrentSeasonKey();
  const seasonInfo = seasonalPicks[season];
  const upcomingFestivals = getUpcomingFestivals(3);
  const thisMonthFestivals = getThisMonthFestivals();

  const seasonLabel = { winter: '❄️ Winter (Oct–Feb)', summer: '☀️ Summer (Mar–Jun)', monsoon: '🌧️ Monsoon (Jul–Sep)' }[season];

  const filtered = currentFilter === 'all'
    ? destinations
    : destinations.filter(d => d.tags.includes(currentFilter));

  const handlePlanTrip = (name: string) => {
    onPlanTrip(name);
    showToast(`📍 ${name} selected! Fill in details and generate itinerary.`, 'success');
  };

  return (
    <div>
      <div className="section-title">🏔️ Explore India</div>
      <p className="section-sub">Discover beautiful destinations across the country</p>

      {/* ── This Season's Picks ── */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--cream), #FFF0E0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>{season === 'winter' ? '❄️' : season === 'summer' ? '☀️' : '🌧️'}</span>
          <div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: 'var(--maroon)', fontSize: '1rem' }}>
              Now Trending — {seasonLabel}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#888' }}>{seasonInfo.tip}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {seasonInfo.destinations.map(dest => (
            <button
              key={dest}
              className="filter-chip active"
              style={{ fontSize: '0.82rem' }}
              onClick={() => handlePlanTrip(dest)}
            >
              📍 {dest}
            </button>
          ))}
        </div>
      </div>

      {/* ── Upcoming Festivals ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: 'var(--maroon)', fontSize: '1rem', marginBottom: '12px' }}>
          🎉 Upcoming Festivals — Plan Around Them!
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {upcomingFestivals.map(fest => (
            <div key={fest.name} className="card" style={{ padding: '14px', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.6rem' }}>{fest.emoji}</span>
                <div>
                  <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: '0.92rem', color: 'var(--dark)' }}>
                    {fest.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--saffron)' }}>
                    {new Date(2025, fest.month - 1).toLocaleString('en-IN', { month: 'long' })}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px', lineHeight: 1.5 }}>{fest.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {fest.destinations.slice(0, 3).map(d => (
                  <button
                    key={d}
                    onClick={() => handlePlanTrip(d)}
                    className="dest-tag"
                    style={{ cursor: 'pointer', border: '1px solid var(--saffron)', color: 'var(--saffron)', background: 'rgba(255,107,0,0.05)' }}
                  >
                    📍 {d}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── This month's special ── */}
      {thisMonthFestivals.length > 0 && (
        <div className="card" style={{ marginBottom: '24px', borderColor: 'var(--gold)', borderWidth: '2px' }}>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: 'var(--maroon)', marginBottom: '8px' }}>
            🎊 This Month&apos;s Special
          </div>
          {thisMonthFestivals.map(fest => (
            <div key={fest.name} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.8rem' }}>{fest.emoji}</span>
              <div>
                <strong>{fest.name}</strong> — {fest.desc}
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {fest.destinations.map(d => (
                    <button key={d} onClick={() => handlePlanTrip(d)} className="filter-chip" style={{ fontSize: '0.75rem' }}>
                      📍 {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter + Destination Grid ── */}
      <div className="filter-bar">
        <strong style={{ fontSize: '0.85rem', color: 'var(--maroon)' }}>Filter:</strong>
        {filters.map(f => (
          <button
            key={f.value}
            className={`filter-chip ${currentFilter === f.value ? 'active' : ''}`}
            onClick={() => setCurrentFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="dest-grid">
        {filtered.map(dest => (
          <DestCard key={dest.name} dest={dest} onPlanTrip={handlePlanTrip} />
        ))}
      </div>

      <hr style={{ border: 'none', borderTop: '2px dashed var(--border)', margin: '32px 0' }} />

      <SeasonalGuide plannerContext={plannerContext} showToast={showToast} />

      {/* Disclaimer */}
      <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '24px', lineHeight: 1.6, textAlign: 'center' }}>
        ℹ️ Destination information is for general guidance. Conditions, accessibility and safety may vary. Check official tourism portals and travel advisories before planning.
      </p>
    </div>
  );
}
