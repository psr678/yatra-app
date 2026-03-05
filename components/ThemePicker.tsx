'use client';

import { useState, useEffect } from 'react';

export interface AppTheme {
  id: string;
  label: string;
  emoji: string;
  vars: Record<string, string>;
}

export const themes: AppTheme[] = [
  {
    id: 'default',
    label: 'Classic Roamai',
    emoji: '🪔',
    vars: {
      '--saffron': '#FF6B00', '--deep-saffron': '#E85D00', '--gold': '#F0A500',
      '--teal': '#00897B', '--maroon': '#8B1A1A', '--cream': '#FFF8F0',
      '--card-bg': '#FFFAF4', '--border': '#F0D5B0',
    },
  },
  {
    id: 'modern',
    label: 'Modern Coast',
    emoji: '🌊',
    vars: {
      '--saffron': '#3949AB', '--deep-saffron': '#303F9F', '--gold': '#00BCD4',
      '--teal': '#00897B', '--maroon': '#1A237E', '--cream': '#F5F7FF',
      '--card-bg': '#FFFFFF', '--border': '#C5CAE9',
    },
  },
  {
    id: 'earthy',
    label: 'Earthy Wanderer',
    emoji: '🏺',
    vars: {
      '--saffron': '#C0622F', '--deep-saffron': '#A0522D', '--gold': '#D4A017',
      '--teal': '#2E7D32', '--maroon': '#5D3A1A', '--cream': '#FAF3E0',
      '--card-bg': '#FDF6E3', '--border': '#E8D5B0',
    },
  },
  {
    id: 'diwali',
    label: 'Diwali',
    emoji: '✨',
    vars: {
      '--saffron': '#FFB300', '--deep-saffron': '#FF8F00', '--gold': '#FFD54F',
      '--teal': '#7B1FA2', '--maroon': '#4A148C', '--cream': '#1A0A2E',
      '--card-bg': '#231040', '--border': '#5C2D91',
    },
  },
  {
    id: 'holi',
    label: 'Holi',
    emoji: '🌈',
    vars: {
      '--saffron': '#E91E8C', '--deep-saffron': '#C2185B', '--gold': '#FF9800',
      '--teal': '#00BCD4', '--maroon': '#9C27B0', '--cream': '#FFF0F8',
      '--card-bg': '#FFF5FB', '--border': '#F8BBD9',
    },
  },
  {
    id: 'monsoon',
    label: 'Monsoon',
    emoji: '🌧️',
    vars: {
      '--saffron': '#0288D1', '--deep-saffron': '#0277BD', '--gold': '#4FC3F7',
      '--teal': '#00897B', '--maroon': '#01579B', '--cream': '#E3F2FD',
      '--card-bg': '#EBF5FB', '--border': '#B3E5FC',
    },
  },
  {
    id: 'himalaya',
    label: 'Himalayan',
    emoji: '🏔️',
    vars: {
      '--saffron': '#546E7A', '--deep-saffron': '#455A64', '--gold': '#B0BEC5',
      '--teal': '#00838F', '--maroon': '#263238', '--cream': '#ECEFF1',
      '--card-bg': '#F5F7F8', '--border': '#CFD8DC',
    },
  },
  {
    id: 'desert',
    label: 'Rajasthan Desert',
    emoji: '🏜️',
    vars: {
      '--saffron': '#E64A19', '--deep-saffron': '#BF360C', '--gold': '#F9A825',
      '--teal': '#795548', '--maroon': '#6D4C41', '--cream': '#FBE9E7',
      '--card-bg': '#FFF3E0', '--border': '#FFCCBC',
    },
  },
  {
    id: 'ocean',
    label: 'Goa Beach',
    emoji: '🌊',
    vars: {
      '--saffron': '#0097A7', '--deep-saffron': '#00838F', '--gold': '#FFD740',
      '--teal': '#00BFA5', '--maroon': '#006064', '--cream': '#E0F7FA',
      '--card-bg': '#E8FDF9', '--border': '#B2EBF2',
    },
  },
  {
    id: 'forest',
    label: 'Coorg Forest',
    emoji: '🌿',
    vars: {
      '--saffron': '#388E3C', '--deep-saffron': '#2E7D32', '--gold': '#8BC34A',
      '--teal': '#00695C', '--maroon': '#1B5E20', '--cream': '#F1F8E9',
      '--card-bg': '#F9FBF5', '--border': '#DCEDC8',
    },
  },
];

const STORAGE_KEY = 'yatra_theme_id';

export function useAppTheme() {
  const [themeId, setThemeId] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || 'default';
    setThemeId(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (id: string) => {
    const theme = themes.find(t => t.id === id) || themes[0];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  };

  const setTheme = (id: string) => {
    setThemeId(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyTheme(id);
  };

  return { themeId, setTheme };
}

interface ThemePickerProps {
  themeId: string;
  setTheme: (id: string) => void;
}

export default function ThemePicker({ themeId, setTheme }: ThemePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="dark-toggle"
        onClick={() => setOpen(o => !o)}
        title="Change theme"
        style={{ gap: '4px' }}
      >
        {themes.find(t => t.id === themeId)?.emoji || '🎨'} <span>Theme</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '44px', right: 0, zIndex: 2000,
          background: 'var(--card-bg)', border: '1.5px solid var(--border)',
          borderRadius: '14px', padding: '12px', minWidth: '200px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: 'var(--maroon)', marginBottom: '8px', paddingLeft: '4px' }}>
            🎨 Choose Theme
          </div>
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => { setTheme(theme.id); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '8px 10px', borderRadius: '8px', border: 'none',
                background: themeId === theme.id ? 'rgba(255,107,0,0.1)' : 'transparent',
                cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text)',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: themeId === theme.id ? 700 : 400,
                textAlign: 'left',
                outline: themeId === theme.id ? '2px solid var(--saffron)' : 'none',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{theme.emoji}</span>
              {theme.label}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1999 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
