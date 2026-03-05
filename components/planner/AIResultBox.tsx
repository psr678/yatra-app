'use client';

import { useState, useMemo, useEffect } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { exportPDF, shareItinerary } from '@/lib/utils';

interface AIResultBoxProps {
  streamedText: string;
  isLoading: boolean;
  destination: string;
  numDays: number;
  onClear: () => void;
  showToast: (msg: string, type?: 'success' | '') => void;
}

interface Section {
  title: string;
  content: string;
}

interface DayChunk {
  title: string;
  body: string;
}

function parseSections(text: string): { preamble: string; sections: Section[] } {
  const parts = text.split(/\n(?=## )/);
  const sections: Section[] = [];
  let preamble = '';

  for (const part of parts) {
    if (part.startsWith('## ')) {
      const newline = part.indexOf('\n');
      const title = newline > 0 ? part.slice(3, newline).trim() : part.slice(3).trim();
      const content = newline > 0 ? part.slice(newline + 1).trim() : '';
      sections.push({ title, content });
    } else {
      preamble = part.trim();
    }
  }
  return { preamble, sections };
}

// Split Day-by-Day content into individual day chunks (### Day N or similar headers)
function parseDays(content: string): DayChunk[] {
  const lines = content.split('\n');
  const dayStarts: number[] = [];

  lines.forEach((line, i) => {
    if (/^#{1,3}\s*.*\bDay\s+\d+\b/i.test(line)) {
      dayStarts.push(i);
    }
  });

  if (dayStarts.length < 2) return [];

  return dayStarts.map((start, i) => {
    const end = i < dayStarts.length - 1 ? dayStarts[i + 1] : lines.length;
    const title = lines[start].replace(/^#+\s*/, '').trim();
    const body = lines.slice(start + 1, end).join('\n').trim();
    return { title, body };
  });
}

export default function AIResultBox({ streamedText, isLoading, destination, numDays, onClear, showToast }: AIResultBoxProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));

  // Reset state whenever a new response starts
  useEffect(() => {
    if (!streamedText) {
      setActiveTab(0);
      setOpenDays(new Set([0]));
    }
  }, [streamedText]);

  const handleExport = () => {
    if (!streamedText) { showToast('⚠️ Generate an itinerary first!'); return; }
    exportPDF(streamedText, destination || 'Trip');
  };

  const handleShare = () => {
    if (!streamedText) { showToast('⚠️ Generate an itinerary first!'); return; }
    shareItinerary(streamedText, destination || 'my trip');
    showToast('📋 Itinerary copied to clipboard!', 'success');
  };

  const toggleDay = (i: number) => {
    setOpenDays(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const { preamble, sections } = useMemo(() => parseSections(streamedText), [streamedText]);

  const safeTab = Math.min(activeTab, Math.max(0, sections.length - 1));
  const activeSection = sections[safeTab];

  // Determine if the active tab is the Day-by-Day section and should use day-collapse
  const isDaySection = activeSection && /itinerary|day.by.day/i.test(activeSection.title);
  const days: DayChunk[] = useMemo(
    () => (isDaySection ? parseDays(activeSection.content) : []),
    [activeSection?.content, isDaySection]
  );
  const useDayCollapse = numDays > 4 && days.length > 1;

  if (!isLoading && !streamedText) return null;

  return (
    <div className="ai-box ai-box-animate" style={{ marginTop: '20px' }}>
      <div className="ai-box-header">
        <span className="ai-sparkle">✨</span>
        <span>Roamai AI Guide</span>
        {streamedText && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button className="btn sm gold" onClick={handleExport}>📄 PDF</button>
            <button className="btn sm teal" onClick={handleShare}>🔗 Share</button>
            <button className="btn sm danger" onClick={onClear}>✕</button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="ai-loading">
          <div className="dot-pulse">
            <span /><span /><span />
          </div>
          <span>Roamai AI is crafting your itinerary…</span>
        </div>
      )}

      {/* While streaming: flat view so the user can watch text appear */}
      {isLoading && streamedText && (
        <MarkdownRenderer content={streamedText} />
      )}

      {/* After streaming: tabbed sections */}
      {!isLoading && streamedText && (
        <div className="ai-content">
          {preamble && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <MarkdownRenderer content={preamble} />
            </div>
          )}

          {sections.length > 0 && (
            <>
              {/* Tab bar */}
              <div className="season-tabs" style={{ flexWrap: 'wrap', margin: '16px 16px 0', gap: '6px' }}>
                {sections.map((section, i) => (
                  <button
                    key={i}
                    className={`season-tab ${safeTab === i ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                    onClick={() => setActiveTab(i)}
                  >
                    {section.title}
                  </button>
                ))}
              </div>

              {/* Active tab content */}
              <div style={{ padding: '16px' }}>
                {useDayCollapse ? (
                  // Day-by-day with per-day collapse (>4 days)
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '12px' }}>
                      {days.length} days — click a day to expand
                    </p>
                    {days.map((day, i) => {
                      const isOpen = openDays.has(i);
                      return (
                        <div key={i} style={{ borderBottom: '1px solid var(--border)', borderRadius: i === 0 ? '8px 8px 0 0' : i === days.length - 1 ? '0 0 8px 8px' : 0, overflow: 'hidden' }}>
                          <button
                            onClick={() => toggleDay(i)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center',
                              justifyContent: 'space-between', padding: '11px 14px',
                              background: isOpen ? 'rgba(255,107,0,0.07)' : 'transparent',
                              border: 'none', cursor: 'pointer',
                              fontFamily: "'Baloo 2', sans-serif", fontSize: '0.92rem',
                              fontWeight: 700, color: 'var(--maroon)', textAlign: 'left',
                              transition: 'background 0.2s',
                            }}
                          >
                            <span>{day.title}</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.55, marginLeft: '8px', flexShrink: 0 }}>
                              {isOpen ? '▲' : '▼'}
                            </span>
                          </button>
                          {isOpen && (
                            <div style={{ padding: '4px 14px 14px' }}>
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
        </div>
      )}
    </div>
  );
}
