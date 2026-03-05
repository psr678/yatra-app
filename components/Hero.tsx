'use client';

// "Roamai" written in 8 Indian scripts — floated subtly at the corners
const SCRIPT_FLOATERS = [
  { text: 'రోమేయ్',  lang: 'te', style: { top: '10%',    left: '2%'  }, delay: '0s',   dur: '5.2s' },
  { text: 'रोमाई',   lang: 'hi', style: { top: '12%',    right: '3%' }, delay: '1.1s', dur: '6.0s' },
  { text: 'ரோமை',    lang: 'ta', style: { bottom: '12%', left: '3%'  }, delay: '1.8s', dur: '5.5s' },
  { text: 'ರೋಮೈ',   lang: 'kn', style: { bottom: '8%',  right: '2%' }, delay: '0.6s', dur: '4.8s' },
  { text: 'রোমাই',   lang: 'bn', style: { top: '8%',     left: '44%' }, delay: '2.2s', dur: '6.3s' },
  { text: 'റോമൈ',   lang: 'ml', style: { bottom: '14%', left: '28%' }, delay: '1.4s', dur: '5.8s' },
  { text: 'રોમાઈ',  lang: 'gu', style: { top: '18%',    left: '22%' }, delay: '0.9s', dur: '5.4s' },
  { text: 'ਰੋਮਾਈ',  lang: 'pa', style: { bottom: '6%',  right: '22%'}, delay: '2.5s', dur: '6.8s' },
];

export default function Hero() {
  return (
    <div className="hero">
      {SCRIPT_FLOATERS.map((f, i) => (
        <span
          key={i}
          aria-hidden="true"
          lang={f.lang}
          style={{
            position: 'absolute',
            fontSize: '1.1rem',
            fontWeight: 600,
            opacity: 0.35,
            color: '#FFD700',
            letterSpacing: '0.02em',
            animation: `heroFloat ${f.dur} ease-in-out ${f.delay} infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
            textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            ...f.style,
          }}
        >
          {f.text}
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
