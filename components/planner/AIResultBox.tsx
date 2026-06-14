'use client';

import { useState, useMemo, useEffect } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import WeatherCard from './WeatherCard';
import BudgetEstimateCard from './BudgetEstimateCard';
import type { WeatherData } from './WeatherCard';
import { buildDayTripsPrompt, buildGetTherePrompt } from '@/lib/prompts';
import { exportPDF, shareItinerary } from '@/lib/utils';

const EMERGENCY_CONTACTS = [
  { label: 'Police',                  number: '100' },
  { label: 'Ambulance / Medical',     number: '108' },
  { label: 'Fire Brigade',            number: '101' },
  { label: "Women's Helpline",        number: '1091' },
  { label: 'Tourist Helpline',        number: '1800-11-1363' },
  { label: 'Railway Enquiry',         number: '139' },
];

interface AIResultBoxProps {
  streamedText: string;
  isLoading: boolean;
  destination: string;
  numDays: number;
  from?: string;
  budget?: string;
  people?: number;
  onClear: () => void;
  showToast: (msg: string, type?: 'success' | '') => void;
  isWeather?: boolean;
  weatherData?: WeatherData | null;
  weatherLoading?: boolean;
  selectedMonth?: string;
}

interface Section { title: string; content: string; }
interface DayChunk { title: string; body: string; }

function parseSections(text: string): { preamble: string; sections: Section[] } {
  const parts = text.split(/\n(?=## )/);
  const sections: Section[] = [];
  let preamble = '';
  for (const part of parts) {
    if (part.startsWith('## ')) {
      const nl = part.indexOf('\n');
      sections.push({
        title: nl > 0 ? part.slice(3, nl).trim() : part.slice(3).trim(),
        content: nl > 0 ? part.slice(nl + 1).trim() : '',
      });
    } else {
      preamble = part.trim();
    }
  }
  return { preamble, sections };
}

function parseDays(content: string): DayChunk[] {
  const lines = content.split('\n');
  const starts: number[] = [];
  lines.forEach((line, i) => { if (/^#{1,3}\s*.*\bDay\s+\d+\b/i.test(line)) starts.push(i); });
  if (starts.length < 2) return [];
  return starts.map((start, i) => ({
    title: lines[start].replace(/^#+\s*/, '').trim(),
    body: lines.slice(start + 1, i < starts.length - 1 ? starts[i + 1] : lines.length).join('\n').trim(),
  }));
}

// Lazy tabs appended after AI sections
const LAZY_TABS = [
  { id: 'day-trips',  label: '🗺️ Nearby Day Trips' },
  { id: 'get-there',  label: '🚆 Getting There' },
];

export default function AIResultBox({
  streamedText, isLoading, destination, numDays, from = '', budget = 'moderate', people = 2,
  onClear, showToast, isWeather, weatherData, weatherLoading, selectedMonth,
}: AIResultBoxProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  // lazy tab content: keyed by tab id
  const [lazyContent, setLazyContent] = useState<Record<string, string>>({});
  const [lazyLoading, setLazyLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(0);
    setOpenDays(new Set([0]));
    setLazyContent({});
    setLazyLoading({});
  }, [streamedText]);

  const fetchLazy = async (tabId: string) => {
    if (lazyContent[tabId] || lazyLoading[tabId]) return;
    setLazyLoading(p => ({ ...p, [tabId]: true }));
    try {
      const prompt = tabId === 'day-trips'
        ? buildDayTripsPrompt(destination)
        : buildGetTherePrompt(destination, from);
      // Day trips and transport info are very stable — cache for 7 days
      const ck  = tabId === 'day-trips'
        ? `daytrips:${destination.toLowerCase().trim()}`
        : `getthere:${destination.toLowerCase().trim()}:${(from || '').toLowerCase().trim()}`;
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ck, ttl: 604800 }),
      });
      if (!res.ok) throw new Error();
      const text = await res.text();
      setLazyContent(p => ({ ...p, [tabId]: text }));
    } catch {
      setLazyContent(p => ({ ...p, [tabId]: '⚠️ Could not load content. Please try again.' }));
    } finally {
      setLazyLoading(p => ({ ...p, [tabId]: false }));
    }
  };

  // Detect error state — don't try to render error text as an itinerary
  const isError = streamedText.trimStart().startsWith('⚠️') && !streamedText.includes('## ');

  const { preamble, sections } = useMemo(() => parseSections(streamedText), [streamedText]);
  const aiTabCount   = isError ? 1 : sections.length; // stub tab when error
  const totalTabs    = aiTabCount + LAZY_TABS.length + 1; // +1 for budget
  const safeTab      = Math.min(activeTab, totalTabs - 1);

  // Determine what kind of tab is active
  const isBudgetTab  = safeTab === aiTabCount;
  const lazyTabIndex = safeTab - aiTabCount - 1; // -1 = not a lazy tab
  const lazyTabId    = lazyTabIndex >= 0 ? LAZY_TABS[lazyTabIndex]?.id : null;
  const activeSection = !isBudgetTab && !lazyTabId ? sections[safeTab] : null;

  const isDaySection = activeSection && /itinerary|day.by.day/i.test(activeSection.title);
  const days: DayChunk[] = useMemo(
    () => (isDaySection ? parseDays(activeSection!.content) : []),
    [activeSection, isDaySection]
  );
  const useDayCollapse = numDays > 4 && days.length > 1;
  const isWeatherTab = /weather/i.test(activeSection?.title ?? '');

  if (!isLoading && !streamedText) return null;

  return (
    <div className="ai-result-box" style={{ marginTop: '20px' }}>
      <div className="ai-result-header">
        <div className="ai-result-title">
          <span>{isWeather ? '🌤️' : '✨'}</span>
          <span>{isWeather ? 'Weather & Best Time Guide' : `Roamai AI Guide${destination ? ` — ${destination}` : ''}`}</span>
        </div>
        {streamedText && !isWeather && !isError && (
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button className="btn ghost sm" onClick={() => { exportPDF(streamedText, destination || 'Trip'); }}>📄 PDF</button>
            <button className="btn ghost sm" onClick={() => { shareItinerary(streamedText, destination || 'my trip'); showToast('📋 Copied to clipboard!', 'success'); }}>🔗 Share</button>
            <button className="btn ghost sm" onClick={onClear}>✕</button>
          </div>
        )}
        {(isError || (streamedText && !isWeather && isError)) && (
          <button className="btn ghost sm" onClick={onClear}>✕</button>
        )}
        {streamedText && isWeather && (
          <button className="btn ghost sm" onClick={onClear}>✕ Close</button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="ai-loading-wrap">
          <div className="dot-pulse"><span /><span /><span /></div>
          <span>{isWeather ? 'Fetching weather data…' : 'Crafting your itinerary…'}</span>
        </div>
      )}

      {/* Streaming preview while loading */}
      {isLoading && streamedText && !isWeather && (
        <div className="ai-result-body">
          <MarkdownRenderer content={streamedText} />
        </div>
      )}

      {/* Standalone weather mode */}
      {isWeather && (
        <div>
          {weatherLoading && (
            <div className="ai-loading-wrap">
              <div className="dot-pulse"><span /><span /><span /></div>
              <span>Loading weather data…</span>
            </div>
          )}
          {weatherData && !weatherLoading && (
            <WeatherCard data={weatherData} selectedMonth={selectedMonth} />
          )}
        </div>
      )}

      {/* Itinerary: tabbed sections (shown even on error so static tabs remain usable) */}
      {!isLoading && streamedText && !isWeather && (
        <div>

          {preamble && !isError && (
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
              <MarkdownRenderer content={preamble} />
            </div>
          )}
          {(sections.length > 0 || isError) && (
            <>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '16px 24px 0', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
                {/* In error state show a single stub itinerary tab */}
                {isError && (
                  <button onClick={() => setActiveTab(0)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px',
                    fontFamily: 'var(--font-baloo2,"Baloo 2"),sans-serif', fontSize: '0.82rem', fontWeight: 600,
                    color: safeTab === 0 ? 'var(--orange)' : 'var(--muted)',
                    borderBottom: `2px solid ${safeTab === 0 ? 'var(--orange)' : 'transparent'}`,
                    marginBottom: '-1px',
                  }}>📅 Itinerary</button>
                )}
                {!isError && sections.map((section, i) => (
                  <button key={i} onClick={() => setActiveTab(i)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px',
                    fontFamily: 'var(--font-baloo2,"Baloo 2"),sans-serif', fontSize: '0.82rem', fontWeight: 600,
                    color: safeTab === i ? 'var(--orange)' : 'var(--muted)',
                    borderBottom: `2px solid ${safeTab === i ? 'var(--orange)' : 'transparent'}`,
                    marginBottom: '-1px', transition: 'color .15s',
                  }}>{section.title}</button>
                ))}
                {/* Static budget tab */}
                <button onClick={() => setActiveTab(aiTabCount)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px',
                  fontFamily: 'var(--font-baloo2,"Baloo 2"),sans-serif', fontSize: '0.82rem', fontWeight: 600,
                  color: isBudgetTab ? 'var(--orange)' : 'var(--muted)',
                  borderBottom: `2px solid ${isBudgetTab ? 'var(--orange)' : 'transparent'}`,
                  marginBottom: '-1px', transition: 'color .15s',
                }}>💰 Budget</button>
                {/* Lazy tabs */}
                {LAZY_TABS.map((lt, i) => {
                  const tabIdx = aiTabCount + 1 + i;
                  const active = safeTab === tabIdx;
                  return (
                    <button key={lt.id} onClick={() => { setActiveTab(tabIdx); fetchLazy(lt.id); }} style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px',
                      fontFamily: 'var(--font-baloo2,"Baloo 2"),sans-serif', fontSize: '0.82rem', fontWeight: 600,
                      color: active ? 'var(--orange)' : 'var(--muted)',
                      borderBottom: `2px solid ${active ? 'var(--orange)' : 'transparent'}`,
                      marginBottom: '-1px', transition: 'color .15s',
                    }}>{lt.label}</button>
                  );
                })}
              </div>

              {/* Weather tab: use pre-fetched data */}
              {isWeatherTab && (
                <div style={{ padding: '20px 0 0' }}>
                  {weatherLoading && !weatherData && (
                    <div className="ai-loading-wrap">
                      <div className="dot-pulse"><span /><span /><span /></div>
                      <span>Loading weather data…</span>
                    </div>
                  )}
                  {weatherData && (
                    <WeatherCard data={weatherData} selectedMonth={selectedMonth} />
                  )}
                  {!weatherData && !weatherLoading && (
                    <div className="ai-result-body">
                      <MarkdownRenderer content={activeSection?.content ?? ''} />
                    </div>
                  )}
                </div>
              )}

              {/* Budget tab — static calculator */}
              {isBudgetTab && (
                <div style={{ padding: '20px 24px' }}>
                  <BudgetEstimateCard budget={budget} people={people} numDays={numDays} from={from} to={destination} />
                </div>
              )}

              {/* Lazy tabs — Day Trips / Getting There */}
              {lazyTabId && (
                <div style={{ padding: '20px 24px' }}>
                  {lazyLoading[lazyTabId] && (
                    <div className="ai-loading-wrap">
                      <div className="dot-pulse"><span /><span /><span /></div>
                      <span>Loading…</span>
                    </div>
                  )}
                  {lazyContent[lazyTabId] && !lazyLoading[lazyTabId] && (
                    <MarkdownRenderer content={lazyContent[lazyTabId]} />
                  )}
                  {!lazyContent[lazyTabId] && !lazyLoading[lazyTabId] && (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)', fontSize: '0.85rem' }}>
                      Click the tab again to load content.
                    </div>
                  )}
                </div>
              )}

              {/* Error panel inside itinerary tab */}
              {isError && safeTab === 0 && (
                <div style={{ padding: '36px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '10px' }}>⏳</div>
                  <p style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>AI is taking a short break</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '20px' }}>Both providers hit their free-tier limits. Resets in a few minutes.</p>
                  <button className="btn" onClick={onClear}>Try Again</button>
                </div>
              )}

              <div className="ai-result-body" style={{ display: (isWeatherTab || isBudgetTab || !!lazyTabId || isError) ? 'none' : undefined }}>
                {useDayCollapse ? (
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '14px' }}>
                      {days.length} days — click a day to expand
                    </p>
                    {days.map((day, i) => {
                      const isOpen = openDays.has(i);
                      return (
                        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '6px', overflow: 'hidden' }}>
                          <button
                            onClick={() => setOpenDays(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                            style={{
                              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '11px 16px', background: isOpen ? 'rgba(249,115,22,.06)' : 'var(--bg)',
                              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif',
                              fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', textAlign: 'left',
                            }}
                          >
                            <span>{day.title}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', marginLeft: '8px' }}>{isOpen ? '▲' : '▼'}</span>
                          </button>
                          {isOpen && (
                            <div style={{ padding: '4px 16px 16px' }}>
                              <MarkdownRenderer content={day.body} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <MarkdownRenderer content={activeSection?.content || ''} />
                )}
              </div>
            </>
          )}
          {/* Static emergency contacts — only on itinerary tab, not on budget/lazy/error tabs */}
          {!isBudgetTab && !lazyTabId && !isWeatherTab && !isError && (
          <div style={{ margin: '0 24px 24px', padding: '14px 18px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', color: '#92400E', marginBottom: '10px' }}>
              🆘 Emergency Contacts — India
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
              {EMERGENCY_CONTACTS.map(c => (
                <div key={c.number} style={{ fontSize: '0.82rem', color: '#7C2D12' }}>
                  <span style={{ color: '#92400E' }}>{c.label}: </span>
                  <a href={`tel:${c.number}`} style={{ fontWeight: 700, color: '#C2410C', textDecoration: 'none' }}>{c.number}</a>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
}
