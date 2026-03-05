'use client';

// Subtle floating landmarks — corners only, don't crowd the compact banner
const LANDMARKS = [
  { emoji: '🕌', style: { top: '8%',    left: '2%'  }, delay: '0s',   dur: '5.2s' },
  { emoji: '🏰', style: { top: '15%',   right: '3%' }, delay: '1.1s', dur: '6.0s' },
  { emoji: '🐯', style: { bottom: '8%', left: '4%'  }, delay: '1.8s', dur: '5.5s' },
  { emoji: '🦚', style: { bottom: '5%', right: '2%' }, delay: '0.6s', dur: '4.8s' },
  { emoji: '🪷', style: { top: '10%',   left: '48%' }, delay: '2.2s', dur: '6.3s' },
  { emoji: '🏔️', style: { bottom: '10%',left: '30%' }, delay: '1.4s', dur: '5.8s' },
];

export default function Hero() {
  return (
    <div className="hero">
      {LANDMARKS.map((lm, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            fontSize: '2rem',
            opacity: 0.45,
            animation: `heroFloat ${lm.dur} ease-in-out ${lm.delay} infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
            filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.25))',
            ...lm.style,
          }}
        >
          {lm.emoji}
        </span>
      ))}
      <div className="hero-inner">
        <div className="hero-brand">
          <span className="hero-brand-name">Roamai</span>
          <span className="hero-brand-telugu">రోమేయ్</span>
        </div>
        <p className="hero-tagline">Your AI travel companion for India 🇮🇳</p>
      </div>
    </div>
  );
}
