'use client';

import { useState } from 'react';
import {
  recommendCircuits,
  TRAVELLER_OPTIONS,
  VIBE_OPTIONS,
  REGION_OPTIONS,
  type QuizAnswers,
  type TravellerMix,
  type CircuitMatch,
} from '@/lib/quiz-logic';
import type { Vibe, Region } from '@/lib/circuits-data';
import type { TripSelection } from '@/types';

interface TripQuizProps {
  onSelect: (sel: TripSelection) => void;
  onClose: () => void;
}

type Step = 'traveller' | 'vibes' | 'days' | 'results';

export default function TripQuiz({ onSelect, onClose }: TripQuizProps) {
  const [step, setStep] = useState<Step>('traveller');
  const [travellerMix, setTravellerMix] = useState<TravellerMix | null>(null);
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [days, setDays] = useState(7);
  const [results, setResults] = useState<CircuitMatch[]>([]);

  const toggleVibe = (v: Vibe) => {
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : prev.length < 3 ? [...prev, v] : prev);
  };
  const toggleRegion = (r: Region) => {
    setRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  };

  const runQuiz = () => {
    if (!travellerMix) return;
    const answers: QuizAnswers = { vibes, regions, days, travellerMix };
    setResults(recommendCircuits(answers, 4));
    setStep('results');
  };

  const stepIndex: Record<Step, number> = { traveller: 0, vibes: 1, days: 2, results: 3 };
  const progress = stepIndex[step] / 3;

  return (
    <div className="quiz-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="quiz-modal">

        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-header-title">
            ✨ Find My Perfect Trip
          </div>
          <button className="quiz-close" onClick={onClose}>✕</button>
        </div>

        {/* Progress bar */}
        {step !== 'results' && (
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        )}

        <div className="quiz-body">

          {/* Step 1 — Traveller mix */}
          {step === 'traveller' && (
            <div>
              <div className="quiz-question">Who&apos;s travelling?</div>
              <div className="quiz-sub">This shapes the kind of experiences we&apos;ll suggest</div>
              <div className="quiz-traveller-grid">
                {TRAVELLER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`quiz-traveller-card${travellerMix === opt.value ? ' active' : ''}`}
                    onClick={() => setTravellerMix(opt.value)}
                  >
                    <div className="quiz-traveller-icon">{opt.icon}</div>
                    <div className="quiz-traveller-label">{opt.label}</div>
                    <div className="quiz-traveller-desc">{opt.desc}</div>
                  </button>
                ))}
              </div>
              <div className="quiz-actions">
                <span />
                <button
                  className="btn lg"
                  disabled={!travellerMix}
                  onClick={() => setStep('vibes')}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Vibes + optional region */}
          {step === 'vibes' && (
            <div>
              <div className="quiz-question">What excites you most?</div>
              <div className="quiz-sub">Pick up to 3 — we&apos;ll match you to the right circuits</div>
              <div className="quiz-vibe-grid">
                {VIBE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`quiz-vibe-card${vibes.includes(opt.value) ? ' active' : ''}${vibes.length >= 3 && !vibes.includes(opt.value) ? ' dimmed' : ''}`}
                    onClick={() => toggleVibe(opt.value)}
                  >
                    <span className="quiz-vibe-icon">{opt.icon}</span>
                    <span className="quiz-vibe-label">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="quiz-region-label">Any region preference? <span style={{ fontWeight: 400, color: '#94A3B8' }}>(optional)</span></div>
              <div className="quiz-region-grid">
                {REGION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`quiz-region-pill${regions.includes(opt.value) ? ' active' : ''}`}
                    onClick={() => toggleRegion(opt.value)}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>

              <div className="quiz-actions">
                <button className="btn secondary" onClick={() => setStep('traveller')}>← Back</button>
                <button
                  className="btn lg"
                  disabled={vibes.length === 0}
                  onClick={() => setStep('days')}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Days */}
          {step === 'days' && (
            <div>
              <div className="quiz-question">How many days do you have?</div>
              <div className="quiz-sub">We&apos;ll only show circuits that fit your window</div>

              <div className="quiz-days-display">{days}<span style={{ fontSize: '1.5rem', fontWeight: 400, color: '#64748B', marginLeft: '8px' }}>days</span></div>
              <input
                type="range"
                min={3}
                max={21}
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="quiz-days-slider"
              />
              <div className="quiz-days-ticks">
                {[3, 5, 7, 10, 14, 21].map(d => (
                  <button
                    key={d}
                    className={`quiz-days-tick${days === d ? ' active' : ''}`}
                    onClick={() => setDays(d)}
                  >
                    {d}d
                  </button>
                ))}
              </div>

              <div className="quiz-actions">
                <button className="btn secondary" onClick={() => setStep('vibes')}>← Back</button>
                <button className="btn lg" onClick={runQuiz}>
                  Find My Trip ✨
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Results */}
          {step === 'results' && (
            <div>
              <div className="quiz-question">Your top matches</div>
              <div className="quiz-sub">Based on your preferences — click any to start planning</div>

              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                  No circuits matched. Try fewer filters or more days.
                </div>
              ) : (
                <div className="quiz-results-list">
                  {results.map((match, i) => {
                    const c = match.circuit;
                    return (
                      <button
                        key={c.id}
                        className="quiz-result-card"
                        onClick={() => {
                          onSelect({
                            mode: 'circuit',
                            destination: `${c.name}: ${c.cities.join(' → ')}`,
                            label: c.name,
                            suggestedDays: Math.min(days, c.daysMax),
                            circuitId: c.id,
                            cities: c.cities,
                          });
                          onClose();
                        }}
                      >
                        <div className="qr-rank">#{i + 1}</div>
                        <div className="qr-emoji">{c.coverEmoji}</div>
                        <div className="qr-body">
                          <div className="qr-name">{c.name}</div>
                          <div className="qr-cities">{c.cities.join(' → ')}</div>
                          <div className="qr-reasons">
                            {match.reasons.map((r, ri) => <span key={ri} className="qr-reason">✓ {r}</span>)}
                          </div>
                        </div>
                        <div className="qr-meta">
                          <div className="qr-days">{c.daysMin}–{c.daysMax}d</div>
                          <div className="qr-arrow">→</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="quiz-actions" style={{ marginTop: '16px' }}>
                <button className="btn secondary" onClick={() => setStep('days')}>← Refine</button>
                <button className="btn secondary" onClick={onClose}>Browse manually</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
