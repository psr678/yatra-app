'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import type { TabId } from '@/types';

interface NavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'planner', label: 'Plan Trip', icon: '🗺️' },
  { id: 'itinerary', label: 'My Schedule', icon: '📅' },
  { id: 'budget', label: 'Expenses', icon: '💰' },
  { id: 'checklist', label: 'Packing', icon: '✅' },
  { id: 'destinations', label: 'Discover', icon: '🏔️' },
  { id: 'links', label: 'Book Now', icon: '🔖' },
];

export default function Nav({ activeTab, onTabChange }: NavProps) {
  const { isDark, toggle } = useDarkMode();

  return (
    <nav>
      <div className="logo">
        <span className="logo-icon">🪔</span>
        <div>
          <div className="logo-text">Yatra</div>
          <span className="logo-sub">Indian Travel Planner</span>
        </div>
      </div>

      <div className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
        <button className="dark-toggle" onClick={toggle} title="Toggle dark mode">
          {isDark ? '☀️' : '🌙'} <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  );
}
