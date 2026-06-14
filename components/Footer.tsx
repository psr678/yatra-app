'use client';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--navy-dark, #0D1F40)',
      color: 'rgba(255,255,255,0.65)',
      padding: '48px 2rem 24px',
      marginTop: '60px',
      fontFamily: "var(--font-nunito), 'Nunito', sans-serif",
      fontSize: '0.85rem',
    }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', marginBottom: '36px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'var(--orange, #FF6B00)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontWeight: 700, fontSize: '1.3rem', color: '#fff', flexShrink: 0,
              }}>R</div>
              <div>
                <div style={{ fontFamily: "var(--font-playfair), 'Playfair Display', serif", fontSize: '1.3rem', color: '#fff', lineHeight: 1.2, fontWeight: 700 }}>Roamai</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>రోమేయ్ — roam around freely</div>
              </div>
            </div>
            <p style={{ lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', fontSize: '0.84rem', maxWidth: '340px' }}>
              India&apos;s AI-powered domestic travel companion. Personalised itineraries, budget tracking, packing checklists, women-friendly guides and seasonal travel tips — free forever.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['🏔️ Mountains', '🌴 Beaches', '🕌 Heritage', '🌿 Nature'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.5)',
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Popular Destinations */}
          <div>
            <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '14px', fontFamily: "var(--font-baloo2), sans-serif", fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Popular Destinations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
              {['🏖️ Goa', '🏜️ Rajasthan', '🌴 Kerala', '🏔️ Manali', '❄️ Ladakh', '🕌 Varanasi', '🌊 Andaman', '☕ Coorg'].map(d => (
                <span key={d} style={{ fontSize: '0.83rem' }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Travel Categories */}
          <div>
            <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '14px', fontFamily: "var(--font-baloo2), sans-serif", fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Travel Categories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
              {['👩 Women Solo Travel', '🧳 Single Travel', '👨‍👩‍👧 Family Trips', '👴 Senior Travel', '🎒 Budget Travel', '🧗 Adventure Travel', '🙏 Spiritual Tours'].map(c => (
                <span key={c} style={{ fontSize: '0.83rem' }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Disclaimer */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '24px',
          fontSize: '0.77rem',
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.4)',
        }}>
          <strong style={{ color: 'rgba(255,180,80,0.8)' }}>⚠️ AI Disclaimer:</strong> All itineraries, tips, budget estimates and recommendations are AI-generated for planning reference only. Always verify prices, timings, safety conditions and local regulations through official sources before booking. Roamai accepts no liability for reliance on AI-generated content.
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.3)',
        }}>
          <span>© {new Date().getFullYear()} Roamai — AI Travel Companion for India 🇮🇳</span>
          <span>Made with ❤️ for Indian Travellers</span>
        </div>
      </div>
    </footer>
  );
}
