import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: 'var(--saffron)',
        'deep-saffron': 'var(--deep-saffron)',
        gold: 'var(--gold)',
        teal: 'var(--teal)',
        'teal-light': 'var(--teal-light)',
        maroon: 'var(--maroon)',
        cream: 'var(--cream)',
        'card-bg': 'var(--card-bg)',
        border: 'var(--border)',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        baloo: ['"Baloo 2"', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
