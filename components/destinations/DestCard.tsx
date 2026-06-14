'use client';

import type { Destination } from '@/types';

const BG_MAP: Record<string, string> = {
  beach:     'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
  mountain:  'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
  heritage:  'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
  nature:    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  spiritual: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  adventure: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  default:   'linear-gradient(135deg, #1B3A6B 0%, #254E8E 100%)',
};

function getCardBg(tags: string[]) {
  if (tags.includes('beach'))     return BG_MAP.beach;
  if (tags.includes('heritage'))  return BG_MAP.heritage;
  if (tags.includes('spiritual')) return BG_MAP.spiritual;
  if (tags.includes('adventure')) return BG_MAP.adventure;
  if (tags.includes('nature'))    return BG_MAP.nature;
  return BG_MAP.default;
}

interface DestCardProps {
  dest: Destination;
  onPlanTrip: (name: string) => void;
}

export default function DestCard({ dest, onPlanTrip }: DestCardProps) {
  return (
    <div
      className="dest-card"
      onClick={() => onPlanTrip(dest.name)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onPlanTrip(dest.name)}
    >
      <div className="dest-card-img" style={{ background: getCardBg(dest.tags) }}>
        <span style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,.3))' }}>{dest.emoji}</span>
      </div>
      <div className="dest-card-body">
        <div className="dest-name">{dest.name}</div>
        <div className="dest-state">📍 {dest.state}</div>
        <div className="dest-desc">{dest.desc}</div>
        <div className="dest-tags">
          {dest.tags.includes('women')     && <span className="dest-tag tag-women">👩 Women Safe</span>}
          {dest.tags.includes('single')    && <span className="dest-tag tag-single">🧳 Solo</span>}
          {dest.tags.includes('beach')     && <span className="dest-tag">🏖️ Beach</span>}
          {dest.tags.includes('heritage')  && <span className="dest-tag">🏛️ Heritage</span>}
          {dest.tags.includes('spiritual') && <span className="dest-tag">🙏 Spiritual</span>}
          {dest.tags.includes('adventure') && <span className="dest-tag">🧗 Adventure</span>}
          {dest.tags.includes('nature')    && <span className="dest-tag">🌿 Nature</span>}
          {dest.tags.includes('winter')    && <span className="dest-tag tag-season">❄️ Oct–Feb</span>}
          {dest.tags.includes('summer')    && <span className="dest-tag tag-season">☀️ Mar–Jun</span>}
          {dest.tags.includes('monsoon')   && <span className="dest-tag tag-season">🌧️ Jul–Sep</span>}
        </div>
        <div className="dest-cta">Plan this trip →</div>
      </div>
    </div>
  );
}
