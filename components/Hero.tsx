'use client';

import type { TabId } from '@/types';

interface HeroProps {
  onTabChange: (tab: TabId) => void;
  onFilterDestinations: (filter: string) => void;
  showToast: (msg: string, type?: 'success' | '') => void;
}

export default function Hero({ onTabChange, onFilterDestinations, showToast }: HeroProps) {
  const handleBadgeClick = (type: string) => {
    if (type === 'seasonal') {
      onTabChange('destinations');
      showToast('🌸 Showing seasonal travel picks!', 'success');
    } else if (type === 'women') {
      onFilterDestinations('women');
      onTabChange('destinations');
      showToast('👩 Showing women-friendly destinations!', 'success');
    } else if (type === 'solo') {
      onFilterDestinations('single');
      onTabChange('destinations');
      showToast('🧳 Showing solo-friendly destinations!', 'success');
    } else if (type === 'family') {
      onTabChange('planner');
      showToast('👨‍👩‍👧 Family trip mode on!', 'success');
    } else if (type === 'budget') {
      onTabChange('planner');
      showToast('💰 Select your budget range below!', 'success');
    }
  };

  return (
    <div className="hero">
      <h1>
        Plan Your Perfect <span>Indian Journey</span>
      </h1>
      <p>AI-powered itineraries, budget tracking & packing lists for every Indian traveller</p>
      <div className="hero-badges">
        <span className="badge badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('seasonal')}>
          🌸 Seasonal Guide
        </span>
        <span className="badge women badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('women')}>
          👩 Women-Friendly
        </span>
        <span className="badge single badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('solo')}>
          🧳 Solo Travel
        </span>
        <span className="badge badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('family')}>
          👨‍👩‍👧 Family Trips
        </span>
        <span className="badge badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('budget')}>
          💰 Budget Travel
        </span>
        <span className="badge">🇮🇳 Domestic Travel</span>
        <span className="badge">✈️ Free to Use</span>
      </div>
    </div>
  );
}
