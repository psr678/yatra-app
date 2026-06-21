'use client';

import CompassLogo from '@/components/CompassLogo';
import type { TabId } from '@/types';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'planner',      label: 'Plan Trip',   icon: '✨' },
  { id: 'itinerary',   label: 'My Trips',    icon: '📅' },
  { id: 'budget',      label: 'Budget',      icon: '💰' },
  { id: 'checklist',   label: 'Packing',     icon: '✅' },
  { id: 'destinations', label: 'Explore',    icon: '🏔️' },
  { id: 'links',       label: 'Book Now',    icon: '🔖' },
];

interface NavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Nav({ activeTab, onTabChange }: NavProps) {
  return (
    <nav className="top-nav">
      <div className="nav-logo">
        <CompassLogo size={36} />
        <div>
          <div className="nav-logo-text">Roamai</div>
          <span className="nav-logo-tagline">AI Travel Companion · India 🇮🇳</span>
        </div>
      </div>

      <div className="nav-divider" />

      <div className="nav-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
