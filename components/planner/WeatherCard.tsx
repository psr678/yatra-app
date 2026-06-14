'use client';

import { useState } from 'react';
import { buildWeatherInsightsPrompt } from '@/lib/prompts';

export interface MonthData {
  month: string;
  icon: string;
  condition: string;
  high: number;
  low: number;
  rain: string;
  crowd: string;
  rating: number;
  precipMm?: number;
}

export interface FestivalData {
  name: string;
  month: string;
  note: string;
}

export interface WeatherData {
  destination: string;
  bestMonths: string[];
  avoidMonths: string[];
  months: MonthData[];
  tips: string[];
  packingEssentials: string[];
  festivals: FestivalData[];
  verdict: string;
}

const RAIN_COLOR: Record<string, string> = {
  Low: '#10B981', Moderate: '#F59E0B', High: '#F97316', 'Very High': '#EF4444',
};
const CROWD_COLOR: Record<string, string> = {
  Low: '#10B981', Moderate: '#F59E0B', High: '#F97316', 'Very High': '#EF4444',
};

const MONTH_ORDER = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL: Record<string, string> = {
  January:'Jan', February:'Feb', March:'Mar', April:'Apr', May:'May', June:'Jun',
  July:'Jul', August:'Aug', September:'Sep', October:'Oct', November:'Nov', December:'Dec',
};

function toShort(m: string): string {
  return MONTH_FULL[m] ?? m.slice(0, 3);
}

function getFilteredMonths(months: MonthData[], selectedMonth: string): MonthData[] {
  if (!selectedMonth) return months;
  const short = toShort(selectedMonth);
  const idx = MONTH_ORDER.indexOf(short);
  if (idx === -1) return months;
  const prev = MONTH_ORDER[(idx + 11) % 12];
  const next = MONTH_ORDER[(idx + 1) % 12];
  const targets = new Set([prev, short, next]);
  return months.filter(m => targets.has(toShort(m.month)));
}

function RatingDots({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i <= rating ? '#F97316' : '#E2E8F0',
          display: 'inline-block',
        }} />
      ))}
    </div>
  );
}

// Only used for legacy AI-JSON path (Best Time to Go button)
export function parseWeatherJSON(raw: string): WeatherData | null {
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    return JSON.parse(clean.slice(start, end + 1)) as WeatherData;
  } catch {
    return null;
  }
}

interface AIInsights {
  verdict: string;
  tips: string[];
  packingEssentials: string[];
  festivals: FestivalData[];
}

export default function WeatherCard({ data, selectedMonth }: { data: WeatherData; selectedMonth?: string }) {
  const [showAll, setShowAll] = useState(false);
  const [insights, setInsights] = useState<AIInsights | null>(
    // Pre-populate if data already has tips (legacy AI path)
    data.tips?.length ? { verdict: data.verdict, tips: data.tips, packingEssentials: data.packingEssentials ?? [], festivals: data.festivals ?? [] } : null
  );
  const [insightsLoading, setInsightsLoading] = useState(false);

  const displayMonths = showAll || !selectedMonth
    ? data.months
    : getFilteredMonths(data.months, selectedMonth);

  const isFiltered = !showAll && !!selectedMonth;

  const fetchInsights = async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: buildWeatherInsightsPrompt(data.destination),
          ck: `weather-insights:${data.destination.toLowerCase().trim()}`,
          ttl: 604800, // 7 days — climate tips barely change
        }),
      });
      if (!res.ok) throw new Error();
      const text = await res.text();
      const clean = text.replace(/```json|```/g, '').trim();
      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        const parsed = JSON.parse(clean.slice(start, end + 1)) as AIInsights;
        setInsights(parsed);
      }
    } catch {
      // silently ignore
    } finally {
      setInsightsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-nunito, Nunito), sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0E2145, #1B3A6B)',
        borderRadius: '14px 14px 0 0',
        padding: '18px 22px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>
            🌤️ Weather Guide — {data.destination}
          </div>
          {insights?.verdict && (
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.7)', marginTop: '4px' }}>
              {insights.verdict}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {data.bestMonths.slice(0, 4).map(m => (
            <span key={m} style={{
              background: 'rgba(16,185,129,.25)', border: '1px solid rgba(16,185,129,.5)',
              borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700, color: '#6EE7B7',
            }}>✓ {m}</span>
          ))}
          {data.avoidMonths.slice(0, 2).map(m => (
            <span key={m} style={{
              background: 'rgba(239,68,68,.2)', border: '1px solid rgba(239,68,68,.4)',
              borderRadius: '20px', padding: '3px 10px', fontSize: '0.73rem', fontWeight: 700, color: '#FCA5A5',
            }}>✗ {m}</span>
          ))}
        </div>
      </div>

      {/* Monthly table */}
      <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #E2E8F0', borderTop: 'none' }}>
        {isFiltered && (
          <div style={{ padding: '8px 14px 4px', fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}>
            <span>Showing {displayMonths.length} month{displayMonths.length !== 1 ? 's' : ''} around <strong>{selectedMonth}</strong></span>
            <button onClick={() => setShowAll(true)} style={{ background: 'none', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '3px 10px', fontSize: '0.72rem', cursor: 'pointer', color: '#475569', fontWeight: 600 }}>
              Show all 12 months ↓
            </button>
          </div>
        )}
        {showAll && selectedMonth && (
          <div style={{ padding: '8px 14px 4px', fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}>
            <span>Showing all 12 months</span>
            <button onClick={() => setShowAll(false)} style={{ background: 'none', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '3px 10px', fontSize: '0.72rem', cursor: 'pointer', color: '#475569', fontWeight: 600 }}>
              Show less ↑
            </button>
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '680px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Month', 'Weather', 'Condition', '°C High', '°C Low', 'Rainfall', 'Crowds', 'Rating'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', fontSize: '0.68rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '.4px', color: '#64748B',
                  textAlign: h === 'Rating' || h === '°C High' || h === '°C Low' ? 'center' : 'left',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayMonths.map((m, i) => {
              const isSelected = !!selectedMonth && toShort(m.month) === toShort(selectedMonth);
              return (
                <tr key={m.month} style={{ borderBottom: '1px solid #F1F5F9', background: isSelected ? 'rgba(249,115,22,.06)' : i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td style={{ padding: '11px 14px', fontWeight: isSelected ? 800 : 700, fontSize: '0.88rem', color: isSelected ? '#F97316' : '#0F172A', whiteSpace: 'nowrap' }}>
                    {m.month}{isSelected ? ' ✦' : ''}
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: '1.4rem', lineHeight: 1, textAlign: 'center' }}>{m.icon}</td>
                  <td style={{ padding: '11px 14px', fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>{m.condition}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'center', fontWeight: 700, fontSize: '0.88rem', color: '#EF4444' }}>{m.high}°</td>
                  <td style={{ padding: '11px 14px', textAlign: 'center', fontWeight: 700, fontSize: '0.88rem', color: '#3B82F6' }}>{m.low}°</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: `${RAIN_COLOR[m.rain] ?? '#94A3B8'}18`, color: RAIN_COLOR[m.rain] ?? '#94A3B8' }}>{m.rain}</span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: `${CROWD_COLOR[m.crowd] ?? '#94A3B8'}18`, color: CROWD_COLOR[m.crowd] ?? '#94A3B8' }}>{m.crowd}</span>
                  </td>
                  <td style={{ padding: '11px 14px' }}><RatingDots rating={m.rating} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom: AI insights or fetch button */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '16px' }}>
        {!insights && !insightsLoading && (
          <button
            onClick={fetchInsights}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: '1px dashed #CBD5E1', borderRadius: '8px',
              padding: '10px 18px', cursor: 'pointer', fontSize: '0.82rem',
              color: '#64748B', fontWeight: 600, width: '100%', justifyContent: 'center',
              transition: 'border-color .15s, color .15s',
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#F97316'; (e.currentTarget as HTMLButtonElement).style.color = '#F97316'; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#CBD5E1'; (e.currentTarget as HTMLButtonElement).style.color = '#64748B'; }}
          >
            ✨ Get AI Insights — tips, packing list & festivals for {data.destination}
          </button>
        )}
        {insightsLoading && (
          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94A3B8', padding: '8px 0' }}>
            ✨ Fetching insights…
          </div>
        )}
        {insights && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {insights.tips?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#64748B', marginBottom: '8px' }}>💡 Travel Tips</div>
                <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {insights.tips.map((tip, i) => (
                    <li key={i} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.55 }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            {insights.packingEssentials?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#64748B', marginBottom: '8px' }}>🎒 Pack These</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {insights.packingEssentials.map((item, i) => (
                    <span key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '4px 11px', fontSize: '0.76rem', color: '#475569' }}>{item}</span>
                  ))}
                </div>
              </div>
            )}
            {insights.festivals?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#64748B', marginBottom: '8px' }}>🎉 Festivals</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {insights.festivals.map((f, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 700, color: '#F97316' }}>{f.name}</span>
                      {f.month ? <span style={{ color: '#94A3B8', fontSize: '0.72rem' }}> · {f.month}</span> : null}
                      {f.note ? <span style={{ color: '#64748B' }}> — {f.note}</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
