'use client';

import { useState, useMemo } from 'react';
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
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([1])); // Day-by-Day open by default

  const handleExport = () => {
    if (!streamedText) { showToast('⚠️ Generate an itinerary first!'); return; }
    exportPDF(streamedText, destination || 'Trip');
  };

  const handleShare = () => {
    if (!streamedText) { showToast('⚠️ Generate an itinerary first!'); return; }
    shareItinerary(streamedText, destination || 'my trip');
    showToast('📋 Itinerary copied to clipboard!', 'success');
  };

  const toggleSection = (i: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const { preamble, sections } = useMemo(() => parseSections(streamedText), [streamedText]);

  if (!isLoading && !streamedText) return null;

  return (
    <div className="ai-box ai-box-animate" style={{ marginTop: '20px' }}>
      <div className="ai-box-header">
        <span className="ai-sparkle">✨</span>
        <span>Yatra AI Guide</span>
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
          <span>Yatra AI is crafting your itinerary…</span>
        </div>
      )}

      {/* While streaming: flat view so user can watch text appear */}
      {isLoading && streamedText && (
        <MarkdownRenderer content={streamedText} />
      )}

      {/* After streaming: accordion sections */}
      {!isLoading && streamedText && (
        <div className="ai-content">
          {preamble && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <MarkdownRenderer content={preamble} />
            </div>
          )}
          {sections.map((section, i) => {
            const isOpen = openSections.has(i);
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => toggleSection(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: isOpen ? 'rgba(255,107,0,0.06)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--maroon)',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                >
                  <span>## {section.title}</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6, marginLeft: '8px', flexShrink: 0 }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '4px 16px 16px' }}>
                    <MarkdownRenderer content={section.content} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
