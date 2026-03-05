'use client';

// 5 directional animation variants — assigned round-robin
const ANIMS = [
  'heroFloatUD',
  'heroFloatLR',
  'heroFloatDiag1',
  'heroFloatDiag2',
  'heroFloatOrbit',
];

// "Roamai" in 13 Indian scripts — spread across top and bottom of the strip
const FLOATERS = [
  // ── top row (left → right) ──
  { text: 'రోమేయ్', lang: 'te',  style: { top: '8%',    left: '1%'   }, delay: '0s',   dur: '5.2s' },
  { text: 'रोमाई',  lang: 'hi',  style: { top: '12%',   left: '13%'  }, delay: '1.3s', dur: '6.0s' },
  { text: 'ரோமை',   lang: 'ta',  style: { top: '6%',    left: '26%'  }, delay: '2.1s', dur: '5.5s' },
  { text: 'ರೋಮೈ',  lang: 'kn',  style: { top: '14%',   left: '40%'  }, delay: '0.7s', dur: '6.4s' },
  { text: 'রোমাই',  lang: 'bn',  style: { top: '8%',    left: '54%'  }, delay: '1.9s', dur: '5.8s' },
  { text: 'റോമൈ',  lang: 'ml',  style: { top: '12%',   left: '68%'  }, delay: '0.4s', dur: '5.1s' },
  { text: 'رومائی', lang: 'ur',  style: { top: '7%',    right: '1%'  }, delay: '2.6s', dur: '6.7s' },
  // ── bottom row (left → right) ──
  { text: 'ਰੋਮਾਈ', lang: 'pa',  style: { bottom: '9%', left: '3%'   }, delay: '1.6s', dur: '5.9s' },
  { text: 'ରୋମାଇ', lang: 'or',  style: { bottom: '6%', left: '17%'  }, delay: '2.4s', dur: '6.2s' },
  { text: 'રોમાઈ', lang: 'gu',  style: { bottom: '11%',left: '32%'  }, delay: '0.9s', dur: '5.4s' },
  { text: 'ৰোমাই', lang: 'as',  style: { bottom: '7%', left: '48%'  }, delay: '1.1s', dur: '6.6s' },
  { text: 'ꯔꯣꯃꯥꯏ', lang: 'mni', style: { bottom: '12%',left: '64%'  }, delay: '2.8s', dur: '5.7s' },
  { text: 'ᱨᱳᱢᱟᱭ', lang: 'sat', style: { bottom: '7%', right: '2%'  }, delay: '1.5s', dur: '6.3s' },
];

export default function Hero() {
  return (
    <div className="hero">
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          aria-hidden="true"
          lang={f.lang}
          style={{
            position: 'absolute',
            fontSize: '1.05rem',
            fontWeight: 600,
            opacity: 0.35,
            color: '#FFD700',
            letterSpacing: '0.02em',
            animation: `${ANIMS[i % ANIMS.length]} ${f.dur} ease-in-out ${f.delay} infinite`,
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
