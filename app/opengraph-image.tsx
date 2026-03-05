import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(160deg, #8B1A1A 0%, #C0622F 45%, #F0A500 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Left — text content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            {/* Compass badge */}
            <div style={{
              width: 80, height: 80,
              borderRadius: 18,
              background: 'rgba(255,248,240,0.15)',
              border: '2px solid rgba(240,165,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, fontWeight: 'bold', color: '#FFF8F0',
            }}>
              R
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 64, fontWeight: 'bold', color: '#FFF8F0', lineHeight: 1 }}>Roamai</span>
              <span style={{ fontSize: 22, color: 'rgba(255,215,0,0.9)', fontStyle: 'italic', marginTop: 4 }}>రోమేయ్ — roam around freely</span>
            </div>
          </div>

          {/* Tagline */}
          <div style={{ fontSize: 34, color: 'rgba(255,248,240,0.92)', marginBottom: 36, lineHeight: 1.4 }}>
            Your AI Travel Companion for India 🇮🇳
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {['🗺️ Itineraries', '💰 Budget', '✅ Packing', '👩 Women-Safe', '🏔️ 16 Destinations'].map(f => (
              <div
                key={f}
                style={{
                  background: 'rgba(255,248,240,0.15)',
                  border: '1.5px solid rgba(255,248,240,0.3)',
                  borderRadius: 24,
                  padding: '8px 20px',
                  fontSize: 20,
                  color: '#FFF8F0',
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right — landmark emojis */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          marginLeft: 60,
          opacity: 0.85,
        }}>
          <div style={{ display: 'flex', gap: 20, fontSize: 56 }}>🏰🏔️</div>
          <div style={{ display: 'flex', gap: 20, fontSize: 56 }}>🌊🛕</div>
          <div style={{ display: 'flex', gap: 20, fontSize: 56 }}>🌴🐘</div>
          <div style={{ fontSize: 22, color: 'rgba(255,215,0,0.8)', marginTop: 8 }}>roamai.in</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
