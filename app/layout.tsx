import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#8B1A1A',
};

export const metadata: Metadata = {
  title: 'Yatra – Indian Domestic Travel Planner | AI Trip Itinerary, Budget & Packing',
  description: 'Plan your perfect Indian trip with Yatra – the AI-powered travel planner for domestic travel. Get personalised itineraries, budget tracking, packing checklists, women-friendly trip flags, seasonal recommendations and more. Free to use!',
  keywords: 'Indian travel planner, domestic travel India, AI itinerary India, free trip planner India, travel itinerary generator India, budget travel India, women solo travel India safe, Rajasthan trip planner, Kerala backwater travel, Goa trip planner, Himachal Pradesh travel, Ladakh trip planner, Varanasi travel guide, travel budget tracker rupees, packing checklist India, best time to visit India by season, senior citizen travel India, family trip India, solo travel India, yatra planner, safar plan India',
  authors: [{ name: 'Yatra – Indian Travel Planner' }],
  robots: 'index, follow',
  metadataBase: new URL('https://roamai.in'),
  alternates: {
    canonical: 'https://roamai.in/',
  },
  openGraph: {
    type: 'website',
    url: 'https://roamai.in/',
    title: 'Yatra – AI-Powered Indian Travel Planner 🇮🇳',
    description: 'Plan your dream Indian trip with AI! Get personalised itineraries, budget tracking, packing checklists, women-friendly flags & seasonal travel tips. Free to use!',
    images: ['https://roamai.in/preview.png'],
    siteName: 'Yatra – Indian Travel Planner',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yatra – AI-Powered Indian Travel Planner 🇮🇳',
    description: 'Plan your dream Indian trip with AI! Personalised itineraries, budget tracking, women-friendly flags & seasonal tips. Free!',
    images: ['https://roamai.in/preview.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Yatra – Indian Travel Planner',
  url: 'https://roamai.in/',
  description: 'AI-powered Indian domestic travel planner with itinerary generation, budget tracking, packing checklists, women-friendly trip planning, and seasonal travel recommendations.',
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
