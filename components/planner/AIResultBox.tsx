'use client';

import MarkdownRenderer from '@/components/MarkdownRenderer';
import { exportPDF, shareItinerary } from '@/lib/utils';

interface AIResultBoxProps {
  streamedText: string;
  isLoading: boolean;
  destination: string;
  onClear: () => void;
  showToast: (msg: string, type?: 'success' | '') => void;
}

export default function AIResultBox({ streamedText, isLoading, destination, onClear, showToast }: AIResultBoxProps) {
  if (!isLoading && !streamedText) return null;

  const handleExport = () => {
    if (!streamedText) { showToast('⚠️ Generate an itinerary first!'); return; }
    exportPDF(streamedText, destination || 'Trip');
  };

  const handleShare = () => {
    if (!streamedText) { showToast('⚠️ Generate an itinerary first!'); return; }
    shareItinerary(streamedText, destination || 'my trip');
    showToast('📋 Itinerary copied to clipboard!', 'success');
  };

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

      {streamedText && <MarkdownRenderer content={streamedText} />}
    </div>
  );
}
