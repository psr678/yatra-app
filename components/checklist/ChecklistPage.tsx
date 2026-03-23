'use client';

import { useState } from 'react';
import { useChecklist } from '@/hooks/useChecklist';
import { callAI } from '@/lib/ai-client';
import { buildChecklistPrompt } from '@/lib/prompts';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface ChecklistPageProps {
  plannerContext: { to?: string; month?: string; age?: string; womenFriendly?: boolean };
  showToast: (msg: string, type?: 'success' | '') => void;
}

export default function ChecklistPage({ plannerContext, showToast }: ChecklistPageProps) {
  const { checklist, checked, toggleItem, resetAll, totalItems, checkedCount } = useChecklist();
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const progressPct = totalItems ? (checkedCount / totalItems) * 100 : 0;

  const handleAIChecklist = async () => {
    setAiText('');
    setAiLoading(true);
    const prompt = buildChecklistPrompt(
      plannerContext.to || '',
      plannerContext.month || '',
      plannerContext.age || '',
      plannerContext.womenFriendly || false
    );
    try {
      let full = '';
      await callAI(prompt, {
        onChunk: chunk => {
          full += chunk;
          setAiText(full);
          if (aiLoading) setAiLoading(false);
        },
      });
      setAiLoading(false);
    } catch {
      setAiLoading(false);
      setAiText('⚠️ Error generating checklist. Please try again.');
    }
  };

  return (
    <div>
      <div className="section-title">✅ Packing Checklist</div>
      <p className="section-sub">Check items as you pack — saves automatically</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <span className="checklist-progress">{checkedCount} of {totalItems} items packed</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn sm teal" onClick={handleAIChecklist} disabled={aiLoading}>
            {aiLoading ? '⏳ Generating…' : '🤖 Smart Checklist'}
          </button>
          <button className="btn sm danger" onClick={() => { resetAll(); showToast('Checklist reset!'); }}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="progress-bar-wrap" style={{ marginBottom: '20px' }}>
        <div className="progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="checklist-grid">
        {Object.entries(checklist).map(([section, items]) => (
          <div key={section} className="checklist-section">
            <h3>{section}</h3>
            {items.map((item, i) => {
              const key = `check_${btoa(encodeURIComponent(`${section}_${i}`))}`;
              const isChecked = checked[key] || false;
              return (
                <div
                  key={i}
                  className={`check-item ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleItem(section, i)}
                >
                  <div className="check-box">{isChecked ? '✓' : ''}</div>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {(aiLoading || aiText) && (
        <div className="ai-box ai-box-animate" style={{ marginTop: '24px' }}>
          <div className="ai-box-header">
            <span className="ai-sparkle">✨</span>
            <span>AI Smart Packing List</span>
          </div>
          {aiLoading && (
            <div className="ai-loading">
              <div className="dot-pulse"><span /><span /><span /></div>
              <span>Generating smart checklist…</span>
            </div>
          )}
          {aiText && <MarkdownRenderer content={aiText} />}
        </div>
      )}
    </div>
  );
}
