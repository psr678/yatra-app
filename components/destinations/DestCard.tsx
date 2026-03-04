'use client';

import type { Destination } from '@/types';

interface DestCardProps {
  dest: Destination;
  onPlanTrip: (name: string) => void;
}

export default function DestCard({ dest, onPlanTrip }: DestCardProps) {
  return (
    <div className="dest-card" onClick={() => onPlanTrip(dest.name)}>
      <div className="dest-img">{dest.emoji}</div>
      <div className="dest-info">
        <div className="dest-name">{dest.name}</div>
        <div className="dest-state">📍 {dest.state}</div>
        <p style={{ fontSize: '0.78rem', color: '#666', margin: '4px 0' }}>{dest.desc}</p>
        <div className="dest-tags">
          {dest.tags.includes('women') && <span className="dest-tag tag-women">👩 Women Safe</span>}
          {dest.tags.includes('single') && <span className="dest-tag tag-single">🧳 Solo</span>}
          {dest.tags.includes('winter') && <span className="dest-tag tag-season">❄️ Oct–Feb</span>}
          {dest.tags.includes('summer') && <span className="dest-tag tag-season">☀️ Mar–Jun</span>}
          {dest.tags.includes('monsoon') && <span className="dest-tag tag-season">🌧️ Jul–Sep</span>}
          {dest.tags.includes('spiritual') && <span className="dest-tag">🙏 Spiritual</span>}
          {dest.tags.includes('adventure') && <span className="dest-tag">🧗 Adventure</span>}
          {dest.tags.includes('beach') && <span className="dest-tag">🏖️ Beach</span>}
        </div>
      </div>
    </div>
  );
}
