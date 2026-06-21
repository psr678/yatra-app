'use client';

const QUICK_CHIPS = ['Goa', 'Rajasthan', 'Kerala', 'Manali', 'Ladakh', 'Varanasi', 'Andaman', 'Coorg'];

interface HeroProps {
  destination: string;
  onDestinationChange: (val: string) => void;
  onSearch: () => void;
  onChipClick: (dest: string) => void;
  onExplore: () => void;   // switches to Explore tab
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
        </div>

        {/* Subtle browse link */}
        <div className="hero-browse-hint">
          Not sure where to go?{' '}
          <button className="hero-browse-link" onClick={onExplore}>
            Browse circuits, vibes &amp; get recommendations →
          </button>
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
