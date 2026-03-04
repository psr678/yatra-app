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
      showToast('🎒 Budget to Luxury — pick your range below!', 'success');
    }
  };

  return (
    <div className="hero">
      <h1>Plan Your Perfect <span>Indian Journey</span> 🇮🇳</h1>
      <p>AI-powered travel planning for every kind of explorer</p>
      <div className="hero-badges">
        <div className="badge badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('seasonal')} title="Browse seasonal travel picks">
          🌸 <span>Seasonal Picks</span>
        </div>
        <div className="badge women badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('women')} title="Women-friendly destinations">
          👩 <span>Women Friendly</span>
        </div>
        <div className="badge single badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('solo')} title="Solo travel destinations">
          🧳 <span>Solo Travel</span>
        </div>
        <div className="badge badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('family')} title="Family trip ideas">
          👨‍👩‍👧 <span>Family Trips</span>
        </div>
        <div className="badge badge-clickable" style={{ cursor: 'pointer' }} onClick={() => handleBadgeClick('budget')} title="Budget to luxury options">
          🎒 <span>Budget to Luxury</span>
        </div>
      </div>
    </div>
  );
}
