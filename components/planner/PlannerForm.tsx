'use client';

import { useState, useEffect } from 'react';
import { callAI } from '@/lib/ai-client';
import { buildItineraryPrompt, buildSeasonalTipPrompt, buildWomenTipPrompt } from '@/lib/prompts';
import { useTrips } from '@/hooks/useTrips';
import { indianCities } from '@/lib/cities-data';
import AIResultBox from './AIResultBox';
import type { PlannerFormData } from '@/types';

interface PlannerFormProps {
  plannerPreset: { destination?: string; travellerType?: string; ageGroup?: string } | null;
  onPresetConsumed: () => void;
  showToast: (msg: string, type?: 'success' | '') => void;
}

const travellerTypes = [
  { label: '👤 Solo', value: 'Solo', people: 1 },
  { label: '👫 Couple', value: 'Couple', people: 2 },
  { label: '👨‍👩‍👧 Family', value: 'Family', people: 4 },
  { label: '🎊 Group', value: 'Group of Friends', people: 6 },
  { label: '🧳 Single Traveller', value: 'Single Traveller', people: 1 },
];

export default function PlannerForm({ plannerPreset, onPresetConsumed, showToast }: PlannerFormProps) {
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

  const [streamedText, setStreamedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (plannerPreset?.destination) {
      setTo(plannerPreset.destination);
      onPresetConsumed();
    }
    if (plannerPreset?.travellerType) setTravellerType(plannerPreset.travellerType);
    if (plannerPreset?.ageGroup) setAge(plannerPreset.ageGroup);
  }, [plannerPreset, onPresetConsumed]);

  const runAI = async (prompt: string) => {
    setStreamedText('');
    setIsLoading(true);
    try {
      let fullText = '';
      await callAI(prompt, {
        onChunk: chunk => {
          fullText += chunk;
          setStreamedText(fullText);
          if (isLoading) setIsLoading(false);
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
    if (!to) { showToast('⚠️ Please enter a destination'); return; }
    const formData: PlannerFormData = { from, to, numDays, month, budget, age, interests, people, travellerType, womenFriendly, spiritual, adventure, senior };
    const fullText = await runAI(buildItineraryPrompt(formData));
    if (fullText) {
      const flags = [womenFriendly && 'women-friendly', spiritual && 'spiritual', adventure && 'adventure', senior && 'senior-friendly'].filter(Boolean).join(', ');
      addTrip({ id: Date.now(), name: `${to} – ${numDays} Days, ${people} pax`, destination: to, from, days: numDays, people, month, result: fullText, womenFriendly, flags });
      showToast('✅ Itinerary ready!', 'success');
    }
  };

  const handleSeasonalTip = async () => {
    const dest = to || 'India';
    const mon = month || 'this season';
    await runAI(buildSeasonalTipPrompt(dest, mon));
  };

  const handleWomenTip = async () => {
    const dest = to || 'India';
    await runAI(buildWomenTipPrompt(dest));
  };

  return (
    <div>
      {/* Cities datalist */}
      <datalist id="cities-list">
        {indianCities.map(city => <option key={city} value={city} />)}
      </datalist>

      <div className="card" style={{ marginBottom: '24px' }}>
        {/* Row 1: From / To / Days / People */}
        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <div className="form-group">
            <label>📍 From (City)</label>
            <input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Mumbai" list="cities-list" />
          </div>
          <div className="form-group">
            <label>🏁 Destination *</label>
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Rajasthan, Goa" list="cities-list" />
          </div>
          <div className="form-group">
            <label>📅 Number of Days</label>
            <input type="number" min={1} max={60} value={numDays} onChange={e => setNumDays(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))} />
          </div>
          <div className="form-group">
            <label>👥 Number of People</label>
            <input type="number" min={1} max={50} value={people} onChange={e => setPeople(parseInt(e.target.value) || 1)} />
          </div>
        </div>

        {/* Row 2: Month / Budget / Age */}
        <div className="form-row three">
          <div className="form-group">
            <label>🗓️ Travel Month</label>
            <select value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">Select Month</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>💰 Budget Range</label>
            <select value={budget} onChange={e => setBudget(e.target.value)}>
              <option value="budget">Budget (Under ₹5,000/day)</option>
              <option value="moderate">Moderate (₹5,000–15,000/day)</option>
              <option value="premium">Premium (₹15,000–40,000/day)</option>
              <option value="luxury">Luxury (₹40,000+/day)</option>
            </select>
          </div>
          <div className="form-group">
            <label>🎂 Age Group</label>
            <select value={age} onChange={e => setAge(e.target.value)}>
              <option value="child">Kids / Family (with children)</option>
              <option value="young">Young Adults (18–30)</option>
              <option value="adult">Adults (30–50)</option>
              <option value="senior">Senior Citizens (50+)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Traveller type */}
        <div className="form-row full">
          <div className="form-group">
            <label>👥 Traveller Type <span style={{ color: '#aaa', fontWeight: 400, fontSize: '0.8rem' }}>(auto-sets people count)</span></label>
            <div className="toggle-group">
              {travellerTypes.map(t => (
                <button
                  key={t.value}
                  className={`toggle-btn ${travellerType === t.value ? 'active' : ''}`}
                  onClick={() => { setTravellerType(t.value); setPeople(t.people); }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Special flags */}
        <div className="form-row full">
          <div className="form-group">
            <label>🌟 Special Flags</label>
            <div className="toggle-group">
              <button className={`toggle-btn women-flag ${womenFriendly ? 'active' : ''}`} onClick={() => setWomenFriendly(p => !p)}>👩 Women-Friendly</button>
              <button className={`toggle-btn ${senior ? 'active' : ''}`} onClick={() => setSenior(p => !p)}>👴 Senior Friendly</button>
              <button className={`toggle-btn ${adventure ? 'active' : ''}`} onClick={() => setAdventure(p => !p)}>🧗 Adventure</button>
              <button className={`toggle-btn ${spiritual ? 'active' : ''}`} onClick={() => setSpiritual(p => !p)}>🙏 Spiritual</button>
            </div>
          </div>
        </div>

        {/* Row 5: Interests */}
        <div className="form-row full">
          <div className="form-group">
            <label>💭 Interests & Special Requests <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
            <textarea
              value={interests}
              onChange={e => setInterests(e.target.value)}
              placeholder="e.g. I love street food, historical monuments, local markets. Prefer AC travel. Vegetarian. Want to avoid crowded places..."
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn" onClick={handleGenerate} disabled={isLoading}>
            ✨ Create My Itinerary
          </button>
          <button className="btn teal" onClick={handleSeasonalTip} disabled={isLoading}>
            🌤️ When Should I Go?
          </button>
          <button
            onClick={handleWomenTip}
            disabled={isLoading}
            title="Get a women's safety guide for your destination"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--pink, #E91E8C)', fontSize: '0.82rem', fontFamily: "'Nunito', sans-serif",
              textDecoration: 'underline', textDecorationStyle: 'dotted', padding: '4px 0',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            👩 Women&apos;s Safety Guide
          </button>
        </div>

        {/* AI disclaimer */}
        <p style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '12px', lineHeight: 1.5 }}>
          ⚠️ <strong>AI Disclaimer:</strong> Itineraries are AI-generated and for planning reference only. Always verify prices, availability, safety conditions and local regulations independently before travel. Roamai is not responsible for inaccuracies.
        </p>
      </div>

      <AIResultBox
        streamedText={streamedText}
        isLoading={isLoading}
        destination={to}
        onClear={() => setStreamedText('')}
        showToast={showToast}
      />
    </div>
  );
}
