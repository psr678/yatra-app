'use client';

import { useState, useEffect } from 'react';
import { callAI } from '@/lib/ai-client';
import { buildItineraryPrompt, buildCircuitPrompt } from '@/lib/prompts';
import { useTrips } from '@/hooks/useTrips';
import { indianCities } from '@/lib/cities-data';
import AIResultBox from './AIResultBox';
import WomenSafetyCard from './WomenSafetyCard';
import type { WeatherData } from './WeatherCard';
import type { PlannerFormData, TripSelection } from '@/types';

interface PlannerFormProps {
  plannerPreset: { destination?: string; travellerType?: string; ageGroup?: string; month?: string } | null;
  onPresetConsumed: () => void;
  tripSelection: TripSelection | null;
  onTripSelectionConsumed: () => void;
  showToast: (msg: string, type?: 'success' | '') => void;
  onContextChange?: (ctx: { to?: string; month?: string; age?: string; womenFriendly?: boolean }) => void;
}

const TRAVELLER_TYPES = [
  { label: '👤 Solo',   value: 'Solo',               people: 1 },
  { label: '👫 Couple', value: 'Couple',              people: 2 },
  { label: '👨‍👩‍👧 Family', value: 'Family',            people: 4 },
  { label: '🎊 Group',  value: 'Group of Friends',    people: 6 },
  { label: '🧳 Single', value: 'Single Traveller',    people: 1 },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function PlannerForm({ plannerPreset, onPresetConsumed, tripSelection, onTripSelectionConsumed, showToast, onContextChange }: PlannerFormProps) {
  const { addTrip } = useTrips();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [numDays, setNumDays] = useState(3);
  const [month, setMonth] = useState('');
  const [budget, setBudget] = useState('moderate');
  const [age, setAge] = useState('adult');
  const [interests, setInterests] = useState('');
  const [people, setPeople] = useState(2);
  const [travellerType, setTravellerType] = useState('Couple');
  const [womenFriendly, setWomenFriendly] = useState(false);
  const [spiritual, setSpiritual] = useState(false);
  const [adventure, setAdventure] = useState(false);
  const [senior, setSenior] = useState(false);
  const [activeTripSelection, setActiveTripSelection] = useState<TripSelection | null>(null);

  const [streamedText, setStreamedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWeather, setIsWeather] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showWomenSafety, setShowWomenSafety] = useState(false);

  useEffect(() => {
    if (plannerPreset?.destination) { setTo(plannerPreset.destination); setActiveTripSelection(null); onPresetConsumed(); }
    if (plannerPreset?.travellerType) setTravellerType(plannerPreset.travellerType);
    if (plannerPreset?.ageGroup) setAge(plannerPreset.ageGroup);
    if (plannerPreset?.month) setMonth(plannerPreset.month);
  }, [plannerPreset, onPresetConsumed]);

  useEffect(() => {
    if (!tripSelection) return;
    setActiveTripSelection(tripSelection);
    // Pre-fill destination field with the primary city / first city for display
    const primaryCity = tripSelection.cities?.[0] ?? tripSelection.destination.split(':')[0].trim();
    setTo(primaryCity);
    if (tripSelection.suggestedDays) setNumDays(tripSelection.suggestedDays);
    onTripSelectionConsumed();
  }, [tripSelection, onTripSelectionConsumed]);

  useEffect(() => {
    onContextChange?.({ to, month, age, womenFriendly });
  }, [to, month, age, womenFriendly, onContextChange]);

  const fetchWeather = async (dest: string, travelMonth: string) => {
    setWeatherData(null);
    setWeatherLoading(true);
    setSelectedMonth(travelMonth);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(dest)}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch { /* silently ignore */ }
    finally { setWeatherLoading(false); }
  };

  const runAI = async (prompt: string, weather = false, ck?: string, ttl?: number) => {
    setStreamedText('');
    setIsWeather(weather);
    setIsLoading(true);
    try {
      let fullText = '';
      await callAI(prompt, {
        ck,
        ttl,
        onChunk: chunk => {
          fullText += chunk;
          setStreamedText(fullText);
          setIsLoading(false);
        },
      });
      setIsLoading(false);
      return fullText;
    } catch (e) {
      setIsLoading(false);
      setStreamedText(`⚠️ Error: ${e instanceof Error ? e.message : 'Please try again.'}`);
      return '';
    }
  };

  const handleGenerate = async () => {
    if (!to && !activeTripSelection) { showToast('⚠️ Please enter a destination'); return; }
    const formData: PlannerFormData = { from, to, numDays, month, budget, age, interests, people, travellerType, womenFriendly, spiritual, adventure, senior };
    const flags = [womenFriendly && 'w', spiritual && 's', adventure && 'a', senior && 'sr'].filter(Boolean).join(',');

    // Circuit/scenario path
    if (activeTripSelection?.cities && activeTripSelection.cities.length > 1) {
      const circuitId = activeTripSelection.circuitId ?? activeTripSelection.label.toLowerCase().replace(/\s+/g, '-');
      const ck = `circuit:${circuitId}:${numDays}:${budget}:${month}:${travellerType}:${people}:${flags}`;
      const primaryCity = activeTripSelection.cities[0];
      fetchWeather(primaryCity, month);
      const prompt = buildCircuitPrompt(formData, activeTripSelection);
      const fullText = await runAI(prompt, false, ck, 259200);
      if (fullText) {
        const tripFlags = [womenFriendly && 'women-friendly', spiritual && 'spiritual', adventure && 'adventure', senior && 'senior-friendly'].filter(Boolean).join(', ');
        addTrip({ id: crypto.randomUUID(), name: `${activeTripSelection.label} – ${numDays} Days`, destination: activeTripSelection.cities.join(' → '), from, days: numDays, people, month, result: fullText, womenFriendly, flags: tripFlags });
        showToast('✅ Circuit itinerary saved to My Trips!', 'success');
      }
      return;
    }

    // Single destination path (existing)
    const ck = `itin:${to.toLowerCase().trim()}:${numDays}:${budget}:${month}:${travellerType}:${people}:${flags}`;
    fetchWeather(to, month);
    const fullText = await runAI(buildItineraryPrompt(formData), false, ck, 259200);
    if (fullText) {
      const tripFlags = [womenFriendly && 'women-friendly', spiritual && 'spiritual', adventure && 'adventure', senior && 'senior-friendly'].filter(Boolean).join(', ');
      addTrip({ id: crypto.randomUUID(), name: `${to} – ${numDays} Days`, destination: to, from, days: numDays, people, month, result: fullText, womenFriendly, flags: tripFlags });
      showToast('✅ Itinerary saved to My Trips!', 'success');
    }
  };

  const hasResult = isLoading || !!streamedText;
  const hasRightPanel = hasResult || showWomenSafety;

  return (
    <>
      <datalist id="cities-list">
        {indianCities.map(city => <option key={city} value={city} />)}
      </datalist>

      <div className={hasRightPanel ? 'planner-layout' : ''}>
        {/* ── FORM COLUMN ── */}
        <div className="planner-form-col">

          {/* Step 1 */}
          <div className="planner-form-section">
            <div className="section-label">
              <span className="step-badge">1</span>
              Where &amp; When
            </div>

            {/* Circuit selection pill */}
            {activeTripSelection && activeTripSelection.cities && activeTripSelection.cities.length > 1 && (
              <div className="circuit-selection-pill">
                <span className="circuit-selection-icon">🔄</span>
                <div className="circuit-selection-body">
                  <div className="circuit-selection-name">{activeTripSelection.label}</div>
                  <div className="circuit-selection-route">{activeTripSelection.cities.join(' → ')}</div>
                </div>
                <button
                  className="circuit-selection-clear"
                  onClick={() => { setActiveTripSelection(null); setTo(''); }}
                  title="Remove circuit"
                >✕</button>
              </div>
            )}

            <div className="form-grid cols-2">
              <div className="field">
                <label>From (City)</label>
                <input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Mumbai" list="cities-list" />
              </div>
              <div className="field">
                <label>{activeTripSelection?.cities?.length ?? 0 > 1 ? 'Entry City' : 'Destination *'}</label>
                <input value={to} onChange={e => { setTo(e.target.value); if (activeTripSelection) setActiveTripSelection(null); }} placeholder="e.g. Goa, Kerala" list="cities-list" />
              </div>
              <div className="field">
                <label>Days</label>
                <input type="number" min={1} max={60} value={numDays} onChange={e => setNumDays(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))} />
              </div>
              <div className="field">
                <label>Travel Month</label>
                <select value={month} onChange={e => setMonth(e.target.value)}>
                  <option value="">Any Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="planner-form-section">
            <div className="section-label">
              <span className="step-badge">2</span>
              Who&apos;s Travelling
            </div>
            <div className="form-grid cols-2" style={{ marginBottom: '14px' }}>
              <div className="field">
                <label>People</label>
                <input type="number" min={1} max={50} value={people} onChange={e => setPeople(parseInt(e.target.value) || 1)} />
              </div>
              <div className="field">
                <label>Age Group</label>
                <select value={age} onChange={e => setAge(e.target.value)}>
                  <option value="child">Kids / Family</option>
                  <option value="young">Young Adults (18–30)</option>
                  <option value="adult">Adults (30–50)</option>
                  <option value="senior">Senior Citizens (50+)</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Traveller Type</label>
              <div className="toggle-group" style={{ marginTop: '6px' }}>
                {TRAVELLER_TYPES.map(t => (
                  <button key={t.value} className={`toggle-btn ${travellerType === t.value ? 'active' : ''}`} onClick={() => { setTravellerType(t.value); setPeople(t.people); }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="planner-form-section">
            <div className="section-label">
              <span className="step-badge">3</span>
              Preferences
            </div>
            <div className="field" style={{ marginBottom: '14px' }}>
              <label>Budget Range</label>
              <select value={budget} onChange={e => setBudget(e.target.value)}>
                <option value="budget">🪙 Budget (Under ₹5,000/day)</option>
                <option value="moderate">💳 Moderate (₹5,000–15,000/day)</option>
                <option value="premium">💎 Premium (₹15,000–40,000/day)</option>
                <option value="luxury">👑 Luxury (₹40,000+/day)</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: '14px' }}>
              <label>Special Filters</label>
              <div className="toggle-group" style={{ marginTop: '6px' }}>
                <button className={`toggle-btn women-flag ${womenFriendly ? 'active' : ''}`} onClick={() => setWomenFriendly(p => !p)}>👩 Women-Friendly</button>
                <button className={`toggle-btn ${senior ? 'active' : ''}`} onClick={() => setSenior(p => !p)}>👴 Senior Friendly</button>
                <button className={`toggle-btn ${adventure ? 'active' : ''}`} onClick={() => setAdventure(p => !p)}>🧗 Adventure</button>
                <button className={`toggle-btn ${spiritual ? 'active' : ''}`} onClick={() => setSpiritual(p => !p)}>🙏 Spiritual</button>
              </div>
            </div>
            <div className="field">
              <label>Interests <span style={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 400, color: 'var(--subtle)' }}>(optional)</span></label>
              <textarea value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. love street food, prefer AC travel, vegetarian, avoid crowds…" style={{ marginTop: '6px', minHeight: '72px' }} />
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="planner-actions">
              <button className="btn lg" onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? '⏳ Generating…' : '✨ Create My Itinerary'}
              </button>
              <button className="btn secondary" onClick={() => { setIsWeather(true); fetchWeather(to || 'India', month); setStreamedText(' '); }} disabled={isLoading || weatherLoading}>
                🌤️ Best Time to Go
              </button>
              <button className="btn secondary" onClick={() => setShowWomenSafety(true)} style={{ color: 'var(--pink)', borderColor: 'rgba(236,72,153,.3)' }}>
                👩 Women&apos;s Safety Guide
              </button>
            </div>
            <p className="planner-disclaimer">
              ⚠️ AI-generated content is for planning reference only. Always verify prices and safety before booking.
            </p>
          </div>
        </div>

        {/* ── RESULT COLUMN ── */}
        <div className="planner-result-col">
          {showWomenSafety && (
            <div style={{ marginBottom: hasResult ? '20px' : 0 }}>
              <WomenSafetyCard destination={to || 'India'} />
              <button className="btn ghost sm" onClick={() => setShowWomenSafety(false)} style={{ marginTop: '10px' }}>✕ Close</button>
            </div>
          )}
          {hasResult ? (
            <AIResultBox
              streamedText={streamedText}
              isLoading={isLoading}
              destination={to}
              numDays={numDays}
              from={from}
              budget={budget}
              people={people}
              onClear={() => { setStreamedText(''); setIsWeather(false); setWeatherData(null); }}
              showToast={showToast}
              isWeather={isWeather}
              weatherData={weatherData}
              weatherLoading={weatherLoading}
              selectedMonth={selectedMonth}
            />
          ) : !showWomenSafety ? (
            <div className="result-placeholder">
              <div className="result-placeholder-icon">🗺️</div>
              <div className="result-placeholder-text">
                Your AI-generated itinerary will appear here.<br />
                Fill in the details on the left and click <strong>Create My Itinerary</strong>.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
