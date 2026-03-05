'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import ThemePicker, { useAppTheme } from '@/components/ThemePicker';
import CompassLogo from '@/components/CompassLogo';
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
  const { themeId, setTheme } = useAppTheme();

  return (
    <nav>
      <div className="logo">
        <CompassLogo size={44} />
        <div>
          <div className="logo-text">Roamai</div>
          <span className="logo-sub">రోమేయ్ · Travel Companion</span>
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
        <ThemePicker themeId={themeId} setTheme={setTheme} />
        <button className="dark-toggle" onClick={toggle} title="Toggle dark mode">
          {isDark ? '☀️' : '🌙'} <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  );
}
