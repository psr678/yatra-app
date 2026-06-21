'use client';

import { useState, useRef, useEffect } from 'react';
import { indianCities } from '@/lib/cities-data';

const QUICK_CHIPS = ['Goa', 'Rajasthan', 'Kerala', 'Manali', 'Ladakh', 'Varanasi', 'Andaman', 'Coorg'];

const DISCOVER_CARDS = [
  {
    icon: '🗺️',
    title: 'Multi-City Circuits',
    desc: '25 curated routes across India',
    tab: 'circuits' as const,
    color: '#e8f4fd',
    accent: '#1565c0',
  },
  {
    icon: '🎯',
    title: 'Travel by Vibe',
    desc: 'Heritage, beach, adventure & more',
    tab: 'vibes' as const,
    color: '#fdf3e8',
    accent: '#e65100',
  },
  {
    icon: '✨',
    title: 'Recommend Me',
    desc: '3 quick questions → perfect trip',
    tab: 'quiz' as const,
    color: '#f3e8fd',
    accent: '#6a1b9a',
  },
];

interface HeroProps {
  destination: string;
  onDestinationChange: (val: string) => void;
  onSearch: () => void;
  onChipClick: (dest: string) => void;
  onExplore: (tab?: 'circuits' | 'vibes' | 'quiz') => void;
}

export default function Hero({ destination, onDestinationChange, onSearch, onChipClick, onExplore }: HeroProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!destination.trim() || destination.length < 2) { setSuggestions([]); return; }
    const q = destination.toLowerCase();
    const matches = indianCities.filter(c => c.toLowerCase().startsWith(q)).slice(0, 6);
    // fallback: includes match if startsWith gives fewer than 3
    if (matches.length < 3) {
      const extra = indianCities.filter(c => !matches.includes(c) && c.toLowerCase().includes(q)).slice(0, 6 - matches.length);
      matches.push(...extra);
    }
    setSuggestions(matches);
    setActiveIdx(-1);
  }, [destination]);

  const pick = (city: string) => { onDestinationChange(city); setSuggestions([]); setActiveIdx(-1); };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!suggestions.length) { if (e.key === 'Enter') onSearch(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') { e.preventDefault(); activeIdx >= 0 ? pick(suggestions[activeIdx]) : onSearch(); }
    else if (e.key === 'Escape') setSuggestions([]);
  };

  return (
    <div className="hero">
      <div className="hero-pattern" />
      <div className="hero-inner">

        <h1 className="hero-title">
          Plan Your Perfect<br />
          <em>Indian Trip</em> with AI
        </h1>
        <p className="hero-sub">
          Get a personalised day-by-day itinerary, budget breakdown, packing list<br />
          and women-safety tips — all in seconds, completely free.
        </p>

        <div className="hero-search-card">
          <div className="hero-search-row">
            <div className="hero-search-field" style={{ position: 'relative' }}>
              <label>Where do you want to go?</label>
              <input
                ref={inputRef}
                value={destination}
                onChange={e => onDestinationChange(e.target.value)}
                placeholder="e.g. Goa, Rajasthan, Manali, Kerala…"
                onKeyDown={handleKey}
                onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul ref={listRef} className="hero-autocomplete">
                  {suggestions.map((city, i) => (
                    <li
                      key={city}
                      className={`hero-ac-item${i === activeIdx ? ' active' : ''}`}
                      onMouseDown={() => pick(city)}
                    >
                      📍 {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="btn lg" onClick={onSearch} style={{ flexShrink: 0 }}>
              ✨ Plan My Trip
            </button>
          </div>

          <div className="hero-chips-row">
            <span className="hero-chips-label">Popular:</span>
            {QUICK_CHIPS.map(dest => (
              <button key={dest} className="hero-chip" onClick={() => onChipClick(dest)}>
                {dest}
              </button>
            ))}
          </div>

          {/* Discovery cards — visible without scrolling, right inside the search card */}
          <div className="hero-divider">
            <span>or discover your trip a different way</span>
          </div>

          <div className="hero-discover-grid">
            {DISCOVER_CARDS.map(card => (
              <button
                key={card.tab}
                className="hero-discover-card"
                style={{ background: card.color, '--card-accent': card.accent } as React.CSSProperties}
                onClick={() => onExplore(card.tab)}
              >
                <span className="hdc-icon">{card.icon}</span>
                <div className="hdc-body">
                  <div className="hdc-title">{card.title}</div>
                  <div className="hdc-desc">{card.desc}</div>
                </div>
                <span className="hdc-arrow">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hero-stats">
          {[
            { num: '25+', label: 'Curated Circuits' },
            { num: '500+', label: 'Destinations' },
            { num: '100%', label: 'Free to Use' },
            { num: '< 30s', label: 'Avg Response Time' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
