'use client';

interface Props {
  budget: string;
  people: number;
  numDays: number;
  from: string;
  to: string;
}

const TIERS: Record<string, {
  label: string;
  accommodation: [number, number];
  food: [number, number];
  localTransport: [number, number];
  activities: [number, number];
  misc: [number, number];
  trainOneWay: [number, number];
  flightOneWay: [number, number];
}> = {
  budget: {
    label: 'Budget',
    accommodation:  [600,   1500],
    food:           [300,   700],
    localTransport: [200,   400],
    activities:     [100,   300],
    misc:           [100,   200],
    trainOneWay:    [400,   1200],
    flightOneWay:   [2000,  5000],
  },
  moderate: {
    label: 'Moderate',
    accommodation:  [2000,  5000],
    food:           [700,   1500],
    localTransport: [400,   800],
    activities:     [400,   800],
    misc:           [200,   400],
    trainOneWay:    [800,   2500],
    flightOneWay:   [3500,  8000],
  },
  premium: {
    label: 'Premium',
    accommodation:  [5000,  12000],
    food:           [1500,  3000],
    localTransport: [800,   2000],
    activities:     [800,   2000],
    misc:           [400,   800],
    trainOneWay:    [1500,  4000],
    flightOneWay:   [5000,  12000],
  },
  luxury: {
    label: 'Luxury',
    accommodation:  [12000, 30000],
    food:           [3000,  8000],
    localTransport: [2000,  5000],
    activities:     [2000,  5000],
    misc:           [800,   2000],
    trainOneWay:    [3000,  8000],
    flightOneWay:   [10000, 25000],
  },
};

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` :
  n >= 1000   ? `₹${(n / 1000).toFixed(0)}K`   : `₹${n}`;

const range = (r: [number, number], factor = 1) =>
  `${fmt(r[0] * factor)} – ${fmt(r[1] * factor)}`;

export default function BudgetEstimateCard({ budget, people, numDays, from, to }: Props) {
  const tier = TIERS[budget] ?? TIERS.moderate;
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  const intercity = from && normalize(from) !== normalize(to);

  // Per-person per-day rows
  const rows = [
    { label: '🏨 Accommodation', ppd: tier.accommodation },
    { label: '🍽️ Food & Drinks',  ppd: tier.food },
    { label: '🚗 Local Transport', ppd: tier.localTransport },
    { label: '🎯 Activities',      ppd: tier.activities },
    { label: '🛍️ Shopping / Misc', ppd: tier.misc },
  ];

  // Per-person totals (per day × days)
  const perPersonDayTotal = [
    rows.reduce((s, r) => s + r.ppd[0], 0),
    rows.reduce((s, r) => s + r.ppd[1], 0),
  ] as [number, number];

  // Intercity (return × people)
  const usesFlight = budget === 'premium' || budget === 'luxury';
  const intercityPP: [number, number] = usesFlight
    ? [tier.flightOneWay[0] * 2, tier.flightOneWay[1] * 2]
    : [tier.trainOneWay[0] * 2,  tier.trainOneWay[1] * 2];

  const grandLow  = perPersonDayTotal[0] * numDays * people + (intercity ? intercityPP[0] * people : 0);
  const grandHigh = perPersonDayTotal[1] * numDays * people + (intercity ? intercityPP[1] * people : 0);

  return (
    <div style={{ fontFamily: 'var(--font-nunito, Nunito), sans-serif' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0E2145,#1B3A6B)', borderRadius: '10px 10px 0 0', padding: '14px 18px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-baloo2,"Baloo 2"),sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>
            💰 Budget Estimate — {tier.label}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.6)', marginTop: '3px' }}>
            {people} {people === 1 ? 'person' : 'people'} · {numDays} days{intercity ? ` · ${from} → ${to} (return)` : ` · within ${to}`}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Estimated Total</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FCD34D' }}>
            {fmt(grandLow)} – {fmt(grandHigh)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #E2E8F0', borderTop: 'none' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Category', 'Per Person / Day', `Total (${people}p × ${numDays}d)`].map(h => (
                <th key={h} style={{ padding: '9px 14px', fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#64748B', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#0F172A', fontWeight: 600 }}>{r.label}</td>
                <td style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#475569' }}>{range(r.ppd)}</td>
                <td style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#475569' }}>{range(r.ppd, numDays * people)}</td>
              </tr>
            ))}
            {intercity && (
              <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#FFF7ED' }}>
                <td style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#92400E', fontWeight: 600 }}>
                  {usesFlight ? '✈️ Flights (return)' : '🚆 Train / Bus (return)'}
                </td>
                <td style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#92400E' }}>{range(intercityPP)} pp</td>
                <td style={{ padding: '10px 14px', fontSize: '0.82rem', color: '#92400E' }}>{range(intercityPP, people)}</td>
              </tr>
            )}
            <tr style={{ background: '#F0FDF4', borderTop: '2px solid #86EFAC' }}>
              <td style={{ padding: '11px 14px', fontWeight: 800, fontSize: '0.88rem', color: '#14532D' }}>Grand Total</td>
              <td style={{ padding: '11px 14px' }} />
              <td style={{ padding: '11px 14px', fontWeight: 800, fontSize: '0.95rem', color: '#15803D' }}>
                {fmt(grandLow)} – {fmt(grandHigh)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '10px 14px', fontSize: '0.72rem', color: '#94A3B8' }}>
        ⚠️ Estimates based on typical {tier.label.toLowerCase()} travel in India. Actual costs vary by season, availability and booking time.
      </div>
    </div>
  );
}
