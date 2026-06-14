'use client';

import { useState } from 'react';

interface LocalIntel {
  safeAreas: string[];
  avoidAreas: string[];
  localTip: string;
}

const UNIVERSAL_TIPS = [
  { icon: '🚗', title: 'Transport', tips: ['Use Ola/Uber — avoid unmarked autos or cabs at night', 'Share your live location before boarding any cab', 'Sit behind the driver, not in the front seat'] },
  { icon: '🌙', title: 'After Dark', tips: ['Avoid isolated streets, beaches, or parks after sunset', 'Stay in well-lit, populated areas', 'Return to your hotel before 10 PM if unsure about the area'] },
  { icon: '👗', title: 'Clothing', tips: ['Dress conservatively near temples, mosques, and rural areas', 'A dupatta or scarf is useful to cover up when needed', 'Beach/resort wear is fine at the destination — cover up when travelling there'] },
  { icon: '📱', title: 'Must-Have Apps', tips: ['112 India — official emergency SOS app', 'Ola / Uber — tracked rides with trip sharing', 'Google Maps — share live location with trusted contacts', 'bSafe — personal safety alarm & GPS tracking'] },
  { icon: '🏨', title: 'Accommodation', tips: ['Book verified hotels/guesthouses with good women traveller reviews', 'Confirm room lock works before paying', 'Ask for a room not on the ground floor if possible'] },
  { icon: '📞', title: 'Helplines', tips: ["Women's Helpline: 1091", 'Police: 100', 'Emergency SOS: 112', 'Tourist Helpline: 1800-11-1363 (toll-free)'] },
];

export default function WomenSafetyCard({ destination }: { destination: string }) {
  const [intel, setIntel] = useState<LocalIntel | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const prompt = `For a solo woman traveller visiting ${destination}, India, respond ONLY as JSON (no markdown):
{"safeAreas":["2-3 specific safe neighbourhoods or areas to stay/explore"],"avoidAreas":["2-3 specific areas or situations to avoid"],"localTip":"One destination-specific safety tip under 20 words."}`;

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          ck: `women-safety:${destination.toLowerCase().trim()}`,
          ttl: 604800, // 7 days — safety intel for a city is stable
        }),
      });
      if (!res.ok) throw new Error();
      const text = await res.text();
      const clean = text.replace(/```json|```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        setIntel(JSON.parse(clean.slice(start, end + 1)) as LocalIntel);
      }
    } catch { /* silently ignore */ }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: 'var(--font-nunito, Nunito), sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #701a75, #9d174d)',
        borderRadius: '14px 14px 0 0',
        padding: '18px 22px',
        color: '#fff',
      }}>
        <div style={{ fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>
          👩 Women&apos;s Safety Guide — {destination}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
          Practical tips for safe, confident solo travel
        </div>
      </div>

      {/* Static tips grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1px',
        background: '#E2E8F0',
        border: '1px solid #E2E8F0',
        borderTop: 'none',
      }}>
        {UNIVERSAL_TIPS.map(section => (
          <div key={section.title} style={{ background: '#fff', padding: '14px 16px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#9d174d', marginBottom: '8px' }}>
              {section.icon} {section.title}
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {section.tips.map((tip, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.55 }}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* AI local intel panel */}
      <div style={{ background: '#FDF4FF', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '16px' }}>
        {!intel && !loading && (
          <button
            onClick={fetchIntel}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: '1px dashed #C084FC', borderRadius: '8px',
              padding: '10px 18px', cursor: 'pointer', fontSize: '0.82rem',
              color: '#7E22CE', fontWeight: 600, width: '100%', justifyContent: 'center',
              transition: 'border-color .15s, background .15s',
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F3E8FF'; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >
            ✨ Get AI Insights — safe &amp; avoid areas specific to {destination}
          </button>
        )}
        {loading && (
          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94A3B8', padding: '8px 0' }}>
            ✨ Fetching local intel…
          </div>
        )}
        {intel && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {intel.safeAreas?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#15803D', marginBottom: '8px' }}>✅ Safe Areas to Stay</div>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {intel.safeAreas.map((a, i) => <li key={i} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.55 }}>{a}</li>)}
                </ul>
              </div>
            )}
            {intel.avoidAreas?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#B91C1C', marginBottom: '8px' }}>⚠️ Areas to Avoid</div>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {intel.avoidAreas.map((a, i) => <li key={i} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.55 }}>{a}</li>)}
                </ul>
              </div>
            )}
            {intel.localTip && (
              <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: '8px', padding: '10px 14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#92400E', marginBottom: '6px' }}>💡 Local Tip</div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350F', lineHeight: 1.6 }}>{intel.localTip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
