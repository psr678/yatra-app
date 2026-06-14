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

const SECTION_ICONS: Record<string, string> = {
  Documents: '🪪', Clothing: '👕', Toiletries: '🧴', Electronics: '🔌',
  Health: '💊', Essentials: '🎒', Money: '💳', Default: '📦',
};

export default function ChecklistPage({ plannerContext, showToast }: ChecklistPageProps) {
  const { checklist, checked, toggleItem, resetAll, totalItems, checkedCount } = useChecklist();
  const [activeSection, setActiveSection] = useState<string>(() => Object.keys(checklist)[0] || '');
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const progressPct = totalItems ? (checkedCount / totalItems) * 100 : 0;
  const allDone = totalItems > 0 && checkedCount === totalItems;

  const getSectionProgress = (section: string, items: string[]) => {
    const done = items.filter((_, i) => checked[`check_${btoa(encodeURIComponent(`${section}_${i}`))}`]).length;
    return { done, total: items.length };
  };

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

  const activeSectionItems = checklist[activeSection] || [];
  const { done: sectionDone, total: sectionTotal } = getSectionProgress(activeSection, activeSectionItems);

  return (
    <div>
      {/* Progress bar at top */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-baloo2, "Baloo 2"), sans-serif', fontWeight: 700, fontSize: '1rem', color: allDone ? 'var(--green)' : 'var(--navy)', marginBottom: '3px' }}>
              {allDone ? '🎉 All packed — you\'re ready to go!' : `${checkedCount} of ${totalItems} items packed`}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              {progressPct.toFixed(0)}% complete · {totalItems - checkedCount} remaining
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn teal sm" onClick={handleAIChecklist} disabled={aiLoading}>
              {aiLoading ? '⏳ Generating…' : '🤖 AI Smart List'}
            </button>
            <button className="btn secondary sm" onClick={() => { resetAll(); showToast('Checklist reset!'); }}>
              🔄 Reset All
            </button>
          </div>
        </div>
        <div className="progress-track" style={{ height: '8px' }}>
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%`, background: allDone ? 'var(--green)' : undefined }}
          />
        </div>
      </div>

      {/* Sidebar + panel layout */}
      <div className="checklist-layout">
        {/* Sidebar */}
        <div className="checklist-sidebar">
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--muted)', marginBottom: '8px' }}>
            Categories
          </div>
          {Object.entries(checklist).map(([section, items]) => {
            const { done, total } = getSectionProgress(section, items);
            const isDone = done === total;
            return (
              <button
                key={section}
                className={`cs-btn ${activeSection === section ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => setActiveSection(section)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span>{SECTION_ICONS[section] || SECTION_ICONS.Default}</span>
                  <span>{section}</span>
                </span>
                <span className="cs-count">{done}/{total}</span>
              </button>
            );
          })}
        </div>

        {/* Items panel */}
        <div>
          <div className="checklist-panel">
            <div className="checklist-panel-head">
              <div className="checklist-panel-title">
                <span>{SECTION_ICONS[activeSection] || SECTION_ICONS.Default}</span>
                <span>{activeSection}</span>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,.7)' }}>
                {sectionDone}/{sectionTotal} packed
              </span>
            </div>
            <div className="checklist-progress-bar">
              <div
                className="checklist-progress-fill"
                style={{ width: `${sectionTotal ? (sectionDone / sectionTotal) * 100 : 0}%` }}
              />
            </div>
            {activeSectionItems.map((item, i) => {
              const key = `check_${btoa(encodeURIComponent(`${activeSection}_${i}`))}`;
              const isChecked = checked[key] || false;
              return (
                <div
                  key={i}
                  className={`check-item ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleItem(activeSection, i)}
                >
                  <div className="check-box">{isChecked ? '✓' : ''}</div>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>

          {/* Context hint */}
          {plannerContext.to && (
            <div className="info-banner" style={{ marginTop: '16px' }}>
              <div className="info-banner-row">
                <div className="info-banner-icon">🤖</div>
                <div>
                  <div className="info-banner-title">Personalised checklist available</div>
                  <div className="info-banner-sub">
                    You&apos;re planning a trip to <strong>{plannerContext.to}</strong>
                    {plannerContext.month ? ` in ${plannerContext.month}` : ''}. Click <em>AI Smart List</em> above for a destination-specific packing list.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI output */}
          {(aiLoading || aiText) && (
            <div className="ai-box ai-box-animate">
              <div className="ai-box-header">
                <span>✨</span>
                <span>AI Smart Packing List{plannerContext.to ? ` — ${plannerContext.to}` : ''}</span>
              </div>
              {aiLoading && (
                <div className="ai-loading">
                  <div className="dot-pulse"><span /><span /><span /></div>
                  <span>Generating personalised checklist…</span>
                </div>
              )}
              {aiText && <MarkdownRenderer content={aiText} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
