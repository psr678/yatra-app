'use client';

import { useState, useMemo, useEffect } from 'react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { exportPDF, shareItinerary } from '@/lib/utils';

interface AIResultBoxProps {
  streamedText: string;
  isLoading: boolean;
  destination: string;
  onClear: () => void;
  showToast: (msg: string, type?: 'success' | '') => void;
}

interface Section {
  title: string;
  content: string;
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

export default function AIResultBox({ streamedText, isLoading, destination, onClear, showToast }: AIResultBoxProps) {
  const [activeTab, setActiveTab] = useState(0);

  // Reset to first tab whenever a new response starts
  useEffect(() => {
    if (!streamedText) setActiveTab(0);
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

  const { preamble, sections } = useMemo(() => parseSections(streamedText), [streamedText]);

  if (!isLoading && !streamedText) return null;

  // Clamp active tab in case sections change
  const safeTab = Math.min(activeTab, Math.max(0, sections.length - 1));

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
              <div style={{ padding: '20px 16px 16px' }}>
                <MarkdownRenderer content={sections[safeTab]?.content || ''} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
