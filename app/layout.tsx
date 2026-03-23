import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#8B1A1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Roamai – AI Travel Companion for India | Itinerary, Budget & Packing',
  description: 'Roamai (రోమేయ్) — roam around freely. Your AI-powered travel companion for Indian domestic travel. Get personalised itineraries, budget tracking, packing checklists, women-friendly trip flags, seasonal recommendations and more. Free to use!',
  keywords: 'roamai, Indian travel planner, domestic travel India, AI itinerary India, free trip planner India, travel itinerary generator India, budget travel India, women solo travel India safe, Rajasthan trip planner, Kerala backwater travel, Goa trip planner, Himachal Pradesh travel, Ladakh trip planner, Varanasi travel guide, travel budget tracker rupees, packing checklist India, best time to visit India by season, senior citizen travel India, family trip India, solo travel India',
  authors: [{ name: 'Roamai – AI Travel Companion for India' }],
  robots: 'index, follow',
  metadataBase: new URL('https://roamai.in'),
  alternates: {
    canonical: 'https://roamai.in/',
  },
  openGraph: {
    type: 'website',
    url: 'https://roamai.in/',
    title: 'Roamai – Your AI Travel Companion for India 🇮🇳',
    description: 'Roam freely across Incredible India with AI! Personalised itineraries, budget tracking, packing checklists, women-friendly flags & seasonal travel tips. Free to use!',
    siteName: 'Roamai',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roamai – Your AI Travel Companion for India 🇮🇳',
    description: 'Roam freely across Incredible India with AI! Personalised itineraries, budget tracking, women-friendly flags & seasonal tips. Free!',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Roamai',
  alternateName: 'రోమేయ్',
  url: 'https://roamai.in/',
  description: 'AI-powered Indian domestic travel companion with itinerary generation, budget tracking, packing checklists, women-friendly trip planning, and seasonal travel recommendations.',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  featureList: [
    'AI Trip Itinerary Generator',
    'Budget Tracker in INR',
    'Packing Checklist',
    'Women-Friendly Trip Planning',
    'Solo Travel Planning',
    'Seasonal Travel Recommendations',
    'Indian Destinations Guide',
    'Hotel and Flight Search Links',
  ],
  inLanguage: 'en-IN',
  audience: { '@type': 'Audience', audienceType: 'Indian domestic travellers' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('yatra_theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}})()`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Baloo+2:wght@400;600;700&family=Nunito:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
