'use client';

import { useDarkMode } from '@/hooks/useDarkMode';
import ThemePicker, { useAppTheme } from '@/components/ThemePicker';
import CompassLogo from '@/components/CompassLogo';

export default function Nav() {
  const { isDark, toggle } = useDarkMode();
  const { themeId, setTheme } = useAppTheme();

  return (
    <nav>
      <div className="logo">
        <CompassLogo size={44} />
        <div>
          <div className="logo-text">Roamai</div>
          <span className="logo-sub">రోమేయ్ · Travel Companion</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ThemePicker themeId={themeId} setTheme={setTheme} />
        <button className="dark-toggle" onClick={toggle} title="Toggle dark mode">
          {isDark ? '☀️' : '🌙'} <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  );
}
