'use client';

import type { TabId } from '@/types';

const LANDMARKS = [
  // Iconic monuments
  { emoji: '🕌', top: '10%',  left: '3%',   delay: '0s',    dur: '5.2s', size: '3rem'  }, // Taj Mahal
  { emoji: '🏰', top: '15%',  left: '87%',  delay: '0.8s',  dur: '6.1s', size: '2.8rem'}, // Red Fort
  { emoji: '🛕', top: '65%',  left: '5%',   delay: '1.4s',  dur: '5.6s', size: '2.6rem'}, // Temple
  { emoji: '🗼', top: '70%',  left: '89%',  delay: '1.9s',  dur: '4.9s', size: '2.5rem'}, // Qutub Minar
  { emoji: '⛩️', top: '25%',  left: '76%',  delay: '2.2s',  dur: '6.3s', size: '2.7rem'}, // Gateway
  { emoji: '🏯', top: '80%',  left: '25%',  delay: '0.5s',  dur: '5.0s', size: '2.6rem'}, // Rajasthan fort

  // National symbols
  { emoji: '🐯', top: '20%',  left: '12%',  delay: '1.1s',  dur: '5.8s', size: '3rem'  }, // National animal: Tiger
  { emoji: '🦚', top: '82%',  left: '60%',  delay: '2.5s',  dur: '6.7s', size: '3rem'  }, // National bird: Peacock
  { emoji: '🪷', top: '40%',  left: '93%',  delay: '0.3s',  dur: '4.6s', size: '2.6rem'}, // National flower: Lotus
  { emoji: '🥭', top: '55%',  left: '80%',  delay: '1.6s',  dur: '5.9s', size: '2.5rem'}, // National fruit: Mango

  // Indian landscape & culture
  { emoji: '🏔️', top: '60%',  left: '92%',  delay: '3.0s',  dur: '4.3s', size: '2.8rem'}, // Himalayas
  { emoji: '🌊', top: '30%',  left: '3%',   delay: '1.7s',  dur: '6.4s', size: '2.6rem'}, // Coastline
  { emoji: '🐘', top: '85%',  left: '78%',  delay: '2.0s',  dur: '5.5s', size: '2.8rem'}, // Elephant
  { emoji: '🪔', top: '48%',  left: '1%',   delay: '2.8s',  dur: '4.8s', size: '2.5rem'}, // Diya
];

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
    <div className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Floating landmark emojis */}
      {LANDMARKS.map((lm, i) => (
        <span
          key={i}
          className="hero-landmark"
          style={{
            position: 'absolute',
            top: lm.top,
            left: lm.left,
            fontSize: lm.size,
            opacity: 0.65,
            animation: `heroFloat ${lm.dur} ease-in-out ${lm.delay} infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
          }}
          aria-hidden="true"
        >
          {lm.emoji}
        </span>
      ))}

      {/* Content */}
      <h1>Roam Freely Across <span>Incredible India</span> 🇮🇳</h1>
      <p>Your AI travel companion for India</p>
      <p style={{ fontSize: '0.95rem', opacity: 0.75, marginTop: '-10px', fontStyle: 'italic', letterSpacing: '0.04em' }}>
        రోమేయ్ — roam around freely
      </p>
      <div className="hero-badges">
        <div className="badge badge-clickable" onClick={() => handleBadgeClick('seasonal')} title="Browse seasonal travel picks">
          🌸 <span>Seasonal Picks</span>
        </div>
        <div className="badge women badge-clickable" onClick={() => handleBadgeClick('women')} title="Women-friendly destinations">
          👩 <span>Women Friendly</span>
        </div>
        <div className="badge single badge-clickable" onClick={() => handleBadgeClick('solo')} title="Solo travel destinations">
          🧳 <span>Solo Travel</span>
        </div>
        <div className="badge badge-clickable" onClick={() => handleBadgeClick('family')} title="Family trip ideas">
          👨‍👩‍👧 <span>Family Trips</span>
        </div>
        <div className="badge badge-clickable" onClick={() => handleBadgeClick('budget')} title="Budget to luxury options">
          🎒 <span>Budget to Luxury</span>
        </div>
      </div>
    </div>
  );
}
