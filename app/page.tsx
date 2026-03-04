'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Toast from '@/components/Toast';
import Footer from '@/components/Footer';
import PlannerForm from '@/components/planner/PlannerForm';
import TripHistory from '@/components/trips/TripHistory';
import BudgetPage from '@/components/budget/BudgetPage';
import ChecklistPage from '@/components/checklist/ChecklistPage';
import DestinationsPage from '@/components/destinations/DestinationsPage';
import { useToast } from '@/hooks/useToast';
import type { TabId } from '@/types';

type PlannerPreset = { destination?: string; travellerType?: string; ageGroup?: string } | null;

const bookNowSections = [
  {
    title: '🗺️ Maps & Navigation',
    links: [
      { icon: '📍', bg: '#E8F5E9', title: 'Google Maps', desc: 'Navigate, find places & get directions', url: 'https://maps.google.com' },
      { icon: '🏛️', bg: '#FFF3E0', title: 'Tourist Attractions', desc: 'Find top spots near your destination', url: 'https://maps.google.com/maps?q=tourist+attractions+india' },
      { icon: '🗺️', bg: '#E3F2FD', title: 'Trip Ideas India', desc: 'Curated itineraries by region', url: 'https://www.makemytrip.com/tripideas/india-itinerary' },
    ],
  },
  {
    title: '✈️ Flights',
    links: [
      { icon: '✈️', bg: '#FFF3E0', title: 'MakeMyTrip', desc: 'Popular for domestic flights & packages', url: 'https://www.makemytrip.com/flights/' },
      { icon: '🛫', bg: '#E8F5E9', title: 'Goibibo', desc: 'Good deals on flights across India', url: 'https://www.goibibo.com/flights/' },
      { icon: '🌐', bg: '#E3F2FD', title: 'EaseMyTrip', desc: 'Affordable flight bookings', url: 'https://www.easemytrip.com' },
      { icon: '🦅', bg: '#FCE4EC', title: 'Yatra.com', desc: 'Flights, hotels and holiday packages', url: 'https://www.yatra.com' },
    ],
  },
  {
    title: '🚆 Trains',
    links: [
      { icon: '🚆', bg: '#E8F5E9', title: 'IRCTC', desc: 'Official Indian Railways booking', url: 'https://www.irctc.co.in' },
      { icon: '🎫', bg: '#FFF8E1', title: 'ConfirmTkt', desc: 'Train availability & waitlist prediction', url: 'https://www.confirmtkt.com' },
      { icon: '🛤️', bg: '#F3E5F5', title: 'RailYatri', desc: 'Live train tracking & food booking', url: 'https://www.railyatri.in' },
    ],
  },
  {
    title: '🏨 Hotels',
    links: [
      { icon: '🏠', bg: '#FCE4EC', title: 'OYO Rooms', desc: 'Budget to mid-range hotels across India', url: 'https://www.oyo.com' },
      { icon: '🏨', bg: '#E3F2FD', title: 'Booking.com', desc: 'Wide range of hotels & resorts', url: 'https://www.booking.com' },
      { icon: '🌿', bg: '#E8F5E9', title: 'Treebo Hotels', desc: 'Quality-assured budget hotels', url: 'https://www.treebo.com' },
      { icon: '🎒', bg: '#FFF3E0', title: 'Zostel', desc: 'Hostels – great for solo & budget travel', url: 'https://www.zostel.com' },
    ],
  },
  {
    title: '🚌 Buses & Cabs',
    links: [
      { icon: '🚌', bg: '#FCE4EC', title: 'RedBus', desc: 'Book buses across all Indian routes', url: 'https://www.redbus.in' },
      { icon: '🚕', bg: '#FFF8E1', title: 'Ola Cabs', desc: 'City cabs and intercity travel', url: 'https://www.olacabs.com' },
      { icon: '🏍️', bg: '#E8F5E9', title: 'Rapido', desc: 'Bike taxis and autos', url: 'https://www.rapido.bike' },
    ],
  },
  {
    title: '🎡 Activities & Tours',
    links: [
      { icon: '🎡', bg: '#E3F2FD', title: 'Thrillophilia', desc: 'Activities, tours and experiences', url: 'https://www.thrillophilia.com' },
      { icon: '🗺️', bg: '#FFF3E0', title: 'Viator', desc: 'Tours and sightseeing experiences', url: 'https://www.viator.com' },
      { icon: '🇮🇳', bg: '#E8F5E9', title: 'Incredible India', desc: 'Official India tourism portal', url: 'https://incredibleindia.gov.in' },
    ],
  },
  {
    title: '🍛 Food & Cuisine',
    links: [
      { icon: '🍽️', bg: '#FCE4EC', title: 'Zomato', desc: 'Find restaurants, menus & reviews', url: 'https://www.zomato.com' },
      { icon: '🛵', bg: '#FFF3E0', title: 'Swiggy', desc: 'Food delivery wherever you stay', url: 'https://www.swiggy.com' },
      { icon: '⭐', bg: '#E8F5E9', title: 'TripAdvisor Eats', desc: 'Top-rated local restaurants & reviews', url: 'https://www.tripadvisor.in/Restaurants' },
      { icon: '🪑', bg: '#E3F2FD', title: 'EazyDiner', desc: 'Table reservations at premium restaurants', url: 'https://www.eazydinerhq.com' },
    ],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('planner');
  const [plannerPreset, setPlannerPreset] = useState<PlannerPreset>(null);
  const [destFilter, setDestFilter] = useState('all');
  const [plannerContext] = useState<{ to?: string; month?: string; age?: string; womenFriendly?: boolean }>({});
  const { toast, showToast } = useToast();

  const handlePlanTripFromDest = (destination: string) => {
    setPlannerPreset({ destination });
    setActiveTab('planner');
  };

  const handleFilterDestinations = (filter: string) => {
    setDestFilter(filter);
  };

  return (
    <>
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />
      <Hero onTabChange={setActiveTab} onFilterDestinations={handleFilterDestinations} showToast={showToast} />

      <div className="main">

        {/* ── Plan Trip ── */}
        <div className={`page ${activeTab === 'planner' ? 'active' : ''}`}>
          <div className="section-title">🌟 AI Trip Planner</div>
          <p className="section-sub">Tell us about your dream trip and our AI will create a personalised itinerary</p>
          <PlannerForm plannerPreset={plannerPreset} onPresetConsumed={() => setPlannerPreset(null)} showToast={showToast} />
        </div>

        {/* ── My Schedule / Saved Trips ── */}
        <div className={`page ${activeTab === 'itinerary' ? 'active' : ''}`}>
          <TripHistory showToast={showToast} />
        </div>

        {/* ── Budget ── */}
        <div className={`page ${activeTab === 'budget' ? 'active' : ''}`}>
          <BudgetPage showToast={showToast} />
        </div>

        {/* ── Checklist ── */}
        <div className={`page ${activeTab === 'checklist' ? 'active' : ''}`}>
          <ChecklistPage plannerContext={plannerContext} showToast={showToast} />
        </div>

        {/* ── Destinations ── */}
        <div className={`page ${activeTab === 'destinations' ? 'active' : ''}`}>
          <DestinationsPage
            initialFilter={destFilter}
            plannerContext={plannerContext}
            onPlanTrip={handlePlanTripFromDest}
            showToast={showToast}
          />
        </div>

        {/* ── Book Now ── */}
        <div className={`page ${activeTab === 'links' ? 'active' : ''}`}>
          <div className="section-title">🔖 Book & Explore</div>
          <p className="section-sub">Quick links to book hotels, flights, trains and find your way around India</p>

          {bookNowSections.map(section => (
            <div key={section.title} style={{ marginBottom: '28px' }}>
              <h3 style={{ fontFamily: "'Baloo 2', sans-serif", color: 'var(--maroon)', marginBottom: '12px' }}>{section.title}</h3>
              <div className="link-grid">
                {section.links.map(link => (
                  <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="link-card">
                    <div className="link-icon" style={{ background: link.bg }}>{link.icon}</div>
                    <div>
                      <h4>{link.title}</h4>
                      <p>{link.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '8px', lineHeight: 1.6 }}>
            ℹ️ Yatra is not affiliated with any of the above services. Links are provided for convenience. Always verify prices and terms on the respective platforms before booking.
          </p>
        </div>

      </div>

      <Footer />
      <Toast toast={toast} />
    </>
  );
}
