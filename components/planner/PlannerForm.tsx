'use client';

import { useState, useEffect } from 'react';
import { callAI } from '@/lib/ai-client';
import { buildItineraryPrompt } from '@/lib/prompts';
import { useTrips } from '@/hooks/useTrips';
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
  { label: '👯 Friends', value: 'Friends', people: 4 },
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

  const handleGenerate = async () => {
    if (!to) { showToast('⚠️ Please enter a destination'); return; }
    setStreamedText('');
    setIsLoading(true);

    const formData: PlannerFormData = { from, to, numDays, month, budget, age, interests, people, travellerType, womenFriendly, spiritual, adventure, senior };
    const prompt = buildItineraryPrompt(formData);

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

      const flags = [womenFriendly && 'women-friendly', spiritual && 'spiritual', adventure && 'adventure', senior && 'senior-friendly'].filter(Boolean).join(', ');
      addTrip({ id: Date.now(), name: `${to} – ${numDays} Days, ${people} pax`, destination: to, from, days: numDays, people, month, result: fullText, womenFriendly, flags });
      showToast('✅ Itinerary ready!', 'success');
    } catch (e) {
      setIsLoading(false);
      setStreamedText(`⚠️ Error: ${e instanceof Error ? e.message : 'Please try again.'}`);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>🏠 From (City / State)</label>
            <input value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Mumbai, Delhi" />
          </div>
          <div className="form-group">
            <label>📍 To (Destination) *</label>
            <input value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Goa, Rajasthan, Kerala" />
          </div>
        </div>

        <div className="form-row three">
          <div className="form-group">
            <label>📅 Number of Days</label>
            <input type="number" min={1} max={30} value={numDays} onChange={e => setNumDays(parseInt(e.target.value) || 3)} />
          </div>
          <div className="form-group">
            <label>🗓️ Travel Month</label>
            <select value={month} onChange={e => setMonth(e.target.value)}>
              <option value="">Select month</option>
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>💰 Budget Range</label>
            <select value={budget} onChange={e => setBudget(e.target.value)}>
              <option value="budget">Budget (₹2k–5k/day)</option>
              <option value="moderate">Moderate (₹5k–15k/day)</option>
              <option value="premium">Premium (₹15k–40k/day)</option>
              <option value="luxury">Luxury (₹40k+/day)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>👥 Traveller Type</label>
            <div className="toggle-group" id="traveller-type">
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
          <div className="form-group">
            <label>🔢 Number of People</label>
            <input type="number" min={1} max={50} value={people} onChange={e => setPeople(parseInt(e.target.value) || 1)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>🎂 Age Group</label>
            <select value={age} onChange={e => setAge(e.target.value)}>
              <option value="child">Children (0–12)</option>
              <option value="teen">Teenagers (13–17)</option>
              <option value="adult">Adults (18–40)</option>
              <option value="middle">Middle-aged (40–60)</option>
              <option value="senior">Senior Citizens (60+)</option>
            </select>
          </div>
          <div className="form-group">
            <label>🎯 Interests</label>
            <input value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. temples, food, trekking, photography" />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>✨ Special Preferences</label>
          <div className="toggle-group">
            <button className={`toggle-btn women-flag ${womenFriendly ? 'active' : ''}`} onClick={() => setWomenFriendly(p => !p)}>
              👩 Women-Friendly
            </button>
            <button className={`toggle-btn ${spiritual ? 'active' : ''}`} onClick={() => setSpiritual(p => !p)}>
              🙏 Spiritual
            </button>
            <button className={`toggle-btn ${adventure ? 'active' : ''}`} onClick={() => setAdventure(p => !p)}>
              🧗 Adventure
            </button>
            <button className={`toggle-btn ${senior ? 'active' : ''}`} onClick={() => setSenior(p => !p)}>
              👴 Senior Friendly
            </button>
          </div>
        </div>

        <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? '⏳ Generating…' : '🪄 Generate AI Itinerary'}
        </button>
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
