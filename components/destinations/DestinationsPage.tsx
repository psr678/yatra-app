'use client';

import { useState } from 'react';
import { destinations } from '@/lib/destinations-data';
import DestCard from './DestCard';
import SeasonalGuide from './SeasonalGuide';
import type { TabId } from '@/types';

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
  { label: '🏖️ Beach', value: 'beach' },
  { label: '🙏 Spiritual', value: 'spiritual' },
  { label: '🧗 Adventure', value: 'adventure' },
  { label: '🏛️ Heritage', value: 'heritage' },
  { label: '🌿 Nature', value: 'nature' },
];

export default function DestinationsPage({ initialFilter, plannerContext, onPlanTrip, showToast }: DestinationsPageProps) {
  const [currentFilter, setCurrentFilter] = useState(initialFilter || 'all');

  const filtered = currentFilter === 'all'
    ? destinations
    : destinations.filter(d => d.tags.includes(currentFilter));

  const handlePlanTrip = (name: string) => {
    onPlanTrip(name);
    showToast(`📍 ${name} selected! Fill in details and generate itinerary.`, 'success');
  };

  return (
    <div>
      <div className="section-title">🏔️ Discover India</div>
      <p className="section-sub">16 handpicked destinations for every traveller</p>

      <div className="filter-bar">
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

      <SeasonalGuide plannerContext={plannerContext} showToast={showToast} />
    </div>
  );
}
