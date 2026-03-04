'use client';

import { useState } from 'react';
import { seasonData } from '@/lib/season-data';
import { callAI } from '@/lib/ai-client';
import { buildSeasonalTipPrompt } from '@/lib/prompts';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface SeasonalGuideProps {
  plannerContext: { to?: string; month?: string };
  showToast: (msg: string, type?: 'success' | '') => void;
}

export default function SeasonalGuide({ plannerContext, showToast }: SeasonalGuideProps) {
  const [currentSeason, setCurrentSeason] = useState<'winter' | 'summer' | 'monsoon'>('winter');
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const season = seasonData[currentSeason];

  const handleAITip = async () => {
    const to = plannerContext.to || 'India';
    const month = plannerContext.month || 'current season';
    setAiText('');
    setAiLoading(true);
    try {
      let full = '';
      await callAI(buildSeasonalTipPrompt(to, month), {
        onChunk: chunk => {
          full += chunk;
          setAiText(full);
          if (aiLoading) setAiLoading(false);
        },
      });
      setAiLoading(false);
    } catch {
      setAiLoading(false);
      showToast('⚠️ Error fetching seasonal advice.', '');
    }
  };

  return (
    <div id="season-content" style={{ marginTop: '32px' }}>
      <div className="section-title">🌍 When to Visit</div>
      <p className="section-sub">Best seasons for Indian travel</p>

      <div className="season-tabs">
        {(['winter', 'summer', 'monsoon'] as const).map(s => (
          <button
            key={s}
            className={`season-tab ${currentSeason === s ? 'active' : ''}`}
            onClick={() => setCurrentSeason(s)}
          >
            {s === 'winter' ? '❄️ Oct–Feb' : s === 'summer' ? '☀️ Mar–Jun' : '🌧️ Jul–Sep'}
          </button>
        ))}
      </div>

      <div className="card">
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '1.05rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: '12px' }}>
          {season.title}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '0.93rem' }}>{season.content}</div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <button className="btn teal" onClick={handleAITip} disabled={aiLoading}>
          {aiLoading ? '⏳ Loading…' : '🤖 AI Seasonal Tip for ' + (plannerContext.to || 'your destination')}
        </button>
      </div>

      {(aiLoading || aiText) && (
        <div className="ai-box ai-box-animate" style={{ marginTop: '20px' }}>
          <div className="ai-box-header">
            <span className="ai-sparkle">✨</span>
            <span>Seasonal Travel Advice</span>
          </div>
          {aiLoading && (
            <div className="ai-loading">
              <div className="dot-pulse"><span /><span /><span /></div>
              <span>Fetching seasonal advice…</span>
            </div>
          )}
          {aiText && <MarkdownRenderer content={aiText} />}
        </div>
      )}
    </div>
  );
}
