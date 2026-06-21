'use client';

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
            <div className="hero-search-field">
              <label>Where do you want to go?</label>
              <input
                value={destination}
                onChange={e => onDestinationChange(e.target.value)}
                placeholder="e.g. Goa, Rajasthan, Manali, Kerala…"
                onKeyDown={e => e.key === 'Enter' && onSearch()}
                autoComplete="off"
              />
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
