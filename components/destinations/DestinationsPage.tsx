'use client';

import { useState, useMemo } from 'react';
import { destinations } from '@/lib/destinations-data';
import { getUpcomingFestivals, getThisMonthFestivals, seasonalPicks, getCurrentSeasonKey } from '@/lib/festivals-data';
import { getOngoingEvents, getUpcomingMajorEvents, formatEventDates, getEventBadge } from '@/lib/major-events-data';
import { getUpcomingEscapes, getEscapeBadge, getEscapeDayLabel } from '@/lib/weekend-escapes-data';
import CIRCUITS from '@/lib/circuits-data';
import SCENARIOS from '@/lib/scenarios-data';
import { REGION_OPTIONS } from '@/lib/quiz-logic';
import type { Region } from '@/lib/circuits-data';
import type { TripSelection } from '@/types';
import DestCard from './DestCard';
import SeasonalGuide from './SeasonalGuide';
import TripQuiz from '@/components/planner/TripQuiz';

interface DestinationsPageProps {
  initialFilter?: string;
  initialExploreTab?: ExploreTab;
  plannerContext: { to?: string; month?: string };
  onPlanTrip: (destination: string) => void;
  onSelectTrip: (sel: TripSelection) => void;
  showToast: (msg: string, type?: 'success' | '') => void;
}

type ExploreTab = 'destinations' | 'circuits' | 'vibes' | 'quiz';

const DEST_FILTERS = [
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

const EXPLORE_TABS: { id: ExploreTab; label: string; icon: string }[] = [
  { id: 'destinations', label: 'Destinations', icon: '📍' },
  { id: 'circuits',     label: 'Circuits',     icon: '🔄' },
  { id: 'vibes',        label: 'Travel Vibes', icon: '🎯' },
  { id: 'quiz',         label: 'Recommend Me', icon: '✨' },
];

export default function DestinationsPage({ initialFilter, initialExploreTab, plannerContext, onPlanTrip, onSelectTrip, showToast }: DestinationsPageProps) {
  const [exploreTab, setExploreTab] = useState<ExploreTab>(initialExploreTab ?? 'destinations');
  const [destFilter, setDestFilter] = useState(initialFilter || 'all');
  const [circuitSearch, setCircuitSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all');
  const [showQuizModal, setShowQuizModal] = useState(false);

  const season = getCurrentSeasonKey();
  const seasonInfo = seasonalPicks[season];
  const meta = SEASON_META[season];
  const upcomingFestivals = getUpcomingFestivals(3);
  const thisMonthFestivals = getThisMonthFestivals();
  const ongoingEvents = getOngoingEvents();
  const upcomingMajorEvents = getUpcomingMajorEvents(365);
  const upcomingEscapes = getUpcomingEscapes(90);

  const filteredDests = destFilter === 'all' ? destinations : destinations.filter(d => d.tags.includes(destFilter));

  const filteredCircuits = useMemo(() => {
    let list = CIRCUITS;
    if (regionFilter !== 'all') list = list.filter(c => c.region === regionFilter);
    if (circuitSearch.trim()) {
      const q = circuitSearch.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.cities.some(city => city.toLowerCase().includes(q)) ||
        c.vibes.some(v => v.includes(q))
      );
    }
    return list;
  }, [regionFilter, circuitSearch]);

  const handlePlanTrip = (name: string) => {
    onPlanTrip(name);
    showToast(`📍 ${name} selected! Switch to Plan Trip to generate your itinerary.`, 'success');
  };

  const handleSelectCircuit = (circuit: typeof CIRCUITS[0]) => {
    onSelectTrip({
      mode: 'circuit',
      destination: `${circuit.name}: ${circuit.cities.join(' → ')}`,
      label: circuit.name,
      suggestedDays: circuit.daysMin + 1,
      circuitId: circuit.id,
      cities: circuit.cities,
    });
    showToast(`🔄 ${circuit.name} selected! Fill in your details and generate your itinerary.`, 'success');
  };

  return (
    <div>
      {/* Sub-tab switcher */}
      <div className="explore-tabs">
        {EXPLORE_TABS.map(tab => (
          <button
            key={tab.id}
            className={`explore-tab${exploreTab === tab.id ? ' active' : ''}`}
            onClick={() => { setExploreTab(tab.id); if (tab.id === 'quiz') setShowQuizModal(true); }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ── DESTINATIONS TAB ── */}
      {exploreTab === 'destinations' && (
        <div>
          {/* Trending banner */}
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

          {/* Major time-bound events — auto-surfaced from major-events-data */}
          {(ongoingEvents.length > 0 || upcomingMajorEvents.length > 0) && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
                🗓️ Major Events — Once-in-a-Lifetime Experiences
              </div>

              {/* Ongoing events — highlighted */}
              {ongoingEvents.map(event => {
                const badge = getEventBadge(event);
                return (
                  <div key={event.id} className="card" style={{ marginBottom: '12px', borderLeft: '4px solid #e53935' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{event.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--text)', fontSize: '0.95rem' }}>{event.name}</strong>
                          <span style={{ background: '#e53935', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                            {badge.text}
                          </span>
                        </div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '6px' }}>{formatEventDates(event)} · {event.description}</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {event.destinations.slice(0, 3).map(d => (
                            <button key={d} className="fdest-btn" onClick={() => handlePlanTrip(d)}>📍 {d}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Upcoming events grid */}
              <div className="festival-grid">
                {upcomingMajorEvents.slice(0, 6).map(event => {
                  const badge = getEventBadge(event);
                  return (
                    <div key={event.id} className="festival-card">
                      <div className="festival-top">
                        <span className="festival-emoji">{event.emoji}</span>
                        <div>
                          <div className="festival-name">{event.name}</div>
                          <div className="festival-month" style={{ color: badge.urgent ? '#e53935' : undefined }}>
                            {badge.text} · {formatEventDates(event)}
                          </div>
                        </div>
                      </div>
                      <div className="festival-desc">{event.description.slice(0, 120)}{event.description.length > 120 ? '…' : ''}</div>
                      <div className="festival-dests">
                        {event.destinations.slice(0, 3).map(d => (
                          <button key={d} className="fdest-btn" onClick={() => handlePlanTrip(d)}>
                            📍 {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weekend escapes — auto-surfaced from weekend-escapes-data */}
          {upcomingEscapes.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>
                🏖️ Long Weekend Escapes — Plan a Quick Getaway
              </div>
              <div className="festival-grid">
                {upcomingEscapes.map(escape => {
                  const badge = getEscapeBadge(escape);
                  return (
                    <div key={escape.id} className="festival-card">
                      <div className="festival-top">
                        <span className="festival-emoji">{escape.emoji}</span>
                        <div>
                          <div className="festival-name">{escape.holiday}</div>
                          <div className="festival-month" style={{ color: badge.urgent ? '#e53935' : undefined }}>
                            {badge.text} · {getEscapeDayLabel(escape)}
                          </div>
                        </div>
                      </div>
                      <div className="festival-desc">{escape.tagline}</div>
                      <div className="festival-dests" style={{ flexWrap: 'wrap', gap: '6px' }}>
                        {escape.escapes.slice(0, 4).map(e => (
                          <button key={e.destination} className="fdest-btn" onClick={() => handlePlanTrip(e.destination)}
                            title={`${e.duration} from ${e.from} — ${e.why}`}>
                            📍 {e.destination}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="filter-strip">
            <span className="filter-label">Filter:</span>
            {DEST_FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-pill ${destFilter === f.value ? 'active' : ''}`}
                onClick={() => setDestFilter(f.value)}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          <div className="dest-grid">
            {filteredDests.map(dest => (
              <DestCard key={dest.name} dest={dest} onPlanTrip={handlePlanTrip} />
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '36px' }}>
            <SeasonalGuide plannerContext={plannerContext} showToast={showToast} />
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--subtle)', marginTop: '24px', lineHeight: 1.7, textAlign: 'center' }}>
            ℹ️ Information is for general guidance. Always check official tourism portals before travel.
          </p>
        </div>
      )}

      {/* ── CIRCUITS TAB ── */}
      {exploreTab === 'circuits' && (
        <div>
          {/* Search + region filter */}
          <div className="circuit-page-controls">
            <input
              value={circuitSearch}
              onChange={e => setCircuitSearch(e.target.value)}
              placeholder="Search by circuit name, city or vibe…"
              className="circuit-page-search"
            />
            <div className="circuit-region-pills">
              <button
                className={`filter-pill${regionFilter === 'all' ? ' active' : ''}`}
                onClick={() => setRegionFilter('all')}
              >
                🌏 All India
              </button>
              {REGION_OPTIONS.map(r => (
                <button
                  key={r.value}
                  className={`filter-pill${regionFilter === r.value ? ' active' : ''}`}
                  onClick={() => setRegionFilter(r.value)}
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="circuit-page-count">
            {filteredCircuits.length} circuit{filteredCircuits.length !== 1 ? 's' : ''} found
          </div>

          <div className="circuit-page-grid">
            {filteredCircuits.map(c => (
              <div key={c.id} className="circuit-page-card">
                <div className="cpc-header">
                  <div className="cpc-emoji">{c.coverEmoji}</div>
                  <div className="cpc-header-body">
                    <div className="cpc-name">{c.name}</div>
                    <div className="cpc-tagline">{c.tagline}</div>
                  </div>
                  <div className="cpc-days">{c.daysMin}–{c.daysMax}d</div>
                </div>

                <div className="cpc-route">
                  {c.cities.map((city, i) => (
                    <span key={city} className="cpc-city-wrap">
                      <span className="cpc-city">{city}</span>
                      {i < c.cities.length - 1 && <span className="cpc-arrow">→</span>}
                    </span>
                  ))}
                </div>

                <div className="cpc-highlights">
                  {c.highlights.slice(0, 3).map((h, i) => (
                    <div key={i} className="cpc-highlight">✦ {h}</div>
                  ))}
                </div>

                <div className="cpc-footer">
                  <div className="cpc-vibes">
                    {c.vibes.slice(0, 3).map(v => (
                      <span key={v} className="cpc-vibe">{v}</span>
                    ))}
                  </div>
                  <div className="cpc-meta">
                    <span className={`cpc-difficulty cpc-diff-${c.difficulty}`}>{c.difficulty}</span>
                    <span className="cpc-best-months">{c.bestMonths.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <button
                  className="btn"
                  style={{ width: '100%', marginTop: '12px' }}
                  onClick={() => handleSelectCircuit(c)}
                >
                  Plan This Circuit →
                </button>
              </div>
            ))}
          </div>

          {filteredCircuits.length === 0 && (
            <div className="empty-state" style={{ marginTop: '24px' }}>
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No circuits found</div>
              <div className="empty-sub">Try a different search or remove the region filter</div>
            </div>
          )}
        </div>
      )}

      {/* ── VIBES TAB ── */}
      {exploreTab === 'vibes' && (
        <div className="vibes-page-grid">
          {SCENARIOS.map(s => {
            const topCircuits = s.circuitIds
              .slice(0, 3)
              .map(id => CIRCUITS.find(c => c.id === id))
              .filter(Boolean) as typeof CIRCUITS;

            return (
              <div key={s.id} className="vibe-page-card">
                <div className="vpc-header">
                  <span className="vpc-icon">{s.icon}</span>
                  <div>
                    <div className="vpc-label">{s.label}</div>
                    <div className="vpc-desc">{s.description}</div>
                  </div>
                </div>

                <div className="vpc-best">
                  <span className="vpc-best-label">Best for:</span> {s.bestFor}
                </div>

                <div className="vpc-circuits">
                  <div className="vpc-circuits-label">Top circuits</div>
                  {topCircuits.map(c => (
                    <button
                      key={c.id}
                      className="vpc-circuit-row"
                      onClick={() => handleSelectCircuit(c)}
                    >
                      <span className="vpc-circuit-emoji">{c.coverEmoji}</span>
                      <div className="vpc-circuit-body">
                        <div className="vpc-circuit-name">{c.name}</div>
                        <div className="vpc-circuit-route">{c.cities.slice(0, 3).join(' → ')}{c.cities.length > 3 ? '…' : ''}</div>
                      </div>
                      <span className="vpc-circuit-days">{c.daysMin}–{c.daysMax}d</span>
                    </button>
                  ))}
                </div>

                <div className="vpc-examples">
                  {s.destinationExamples.slice(0, 4).map(d => (
                    <button key={d} className="vpc-dest-pill" onClick={() => handlePlanTrip(d)}>
                      📍 {d}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── QUIZ TAB — opens modal immediately ── */}
      {exploreTab === 'quiz' && !showQuizModal && (
        <div className="empty-state" style={{ marginTop: '0' }}>
          <div className="empty-icon">✨</div>
          <div className="empty-title">Find Your Perfect Trip</div>
          <div className="empty-sub" style={{ marginBottom: '20px' }}>
            Answer 3 quick questions — we&apos;ll match you to the best Indian circuits based on your vibe, region, and how many days you have.
          </div>
          <button className="btn lg" onClick={() => setShowQuizModal(true)}>
            Start the Quiz →
          </button>
        </div>
      )}

      {showQuizModal && (
        <TripQuiz
          onSelect={sel => { onSelectTrip(sel); setShowQuizModal(false); showToast('✅ Circuit selected! Fill in your details and generate your itinerary.', 'success'); }}
          onClose={() => { setShowQuizModal(false); setExploreTab('destinations'); }}
        />
      )}
    </div>
  );
}
