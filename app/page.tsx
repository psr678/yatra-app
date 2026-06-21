'use client';

import { useState, useCallback } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Toast from '@/components/Toast';
import PlannerForm from '@/components/planner/PlannerForm';
import TripHistory from '@/components/trips/TripHistory';
import BudgetPage from '@/components/budget/BudgetPage';
import ChecklistPage from '@/components/checklist/ChecklistPage';
import DestinationsPage from '@/components/destinations/DestinationsPage';
import { useToast } from '@/hooks/useToast';
import type { TabId, TripSelection } from '@/types';

type PlannerPreset = { destination?: string; travellerType?: string; ageGroup?: string; month?: string } | null;

const BOOK_NOW_SECTIONS = [
  {
    title: '✈️ Flights',
    links: [
      { icon: '✈️', bg: '#FFF3E0', title: 'MakeMyTrip', desc: 'Domestic flights & packages', url: 'https://www.makemytrip.com/flights/' },
      { icon: '🛫', bg: '#E8F5E9', title: 'Goibibo', desc: 'Good deals on Indian flights', url: 'https://www.goibibo.com/flights/' },
      { icon: '🌐', bg: '#E3F2FD', title: 'EaseMyTrip', desc: 'Affordable flight bookings', url: 'https://www.easemytrip.com' },
      { icon: '🦅', bg: '#FCE4EC', title: 'Yatra.com', desc: 'Flights, hotels, holidays', url: 'https://www.yatra.com' },
    ],
  },
  {
    title: '🚆 Trains',
    links: [
      { icon: '🚆', bg: '#E8F5E9', title: 'IRCTC', desc: 'Official Indian Railways', url: 'https://www.irctc.co.in' },
      { icon: '🎫', bg: '#FFF8E1', title: 'ConfirmTkt', desc: 'Availability & waitlist tips', url: 'https://www.confirmtkt.com' },
      { icon: '🛤️', bg: '#F3E5F5', title: 'RailYatri', desc: 'Live tracking & food booking', url: 'https://www.railyatri.in' },
    ],
  },
  {
    title: '🏨 Hotels & Stays',
    links: [
      { icon: '🏠', bg: '#FCE4EC', title: 'OYO Rooms', desc: 'Budget to mid-range hotels', url: 'https://www.oyo.com' },
      { icon: '🏨', bg: '#E3F2FD', title: 'Booking.com', desc: 'Wide range of hotels & resorts', url: 'https://www.booking.com' },
      { icon: '🌿', bg: '#E8F5E9', title: 'Treebo Hotels', desc: 'Quality-assured budget hotels', url: 'https://www.treebo.com' },
      { icon: '🎒', bg: '#FFF3E0', title: 'Zostel', desc: 'Hostels for solo & budget travel', url: 'https://www.zostel.com' },
    ],
  },
  {
    title: '🚌 Buses & Cabs',
    links: [
      { icon: '🚌', bg: '#FCE4EC', title: 'RedBus', desc: 'Buses across all Indian routes', url: 'https://www.redbus.in' },
      { icon: '🚕', bg: '#FFF8E1', title: 'Ola Cabs', desc: 'City cabs & intercity travel', url: 'https://www.olacabs.com' },
      { icon: '🏍️', bg: '#E8F5E9', title: 'Rapido', desc: 'Bike taxis and autos', url: 'https://www.rapido.bike' },
    ],
  },
  {
    title: '🎡 Activities & Tours',
    links: [
      { icon: '🎡', bg: '#E3F2FD', title: 'Thrillophilia', desc: 'Activities, tours & experiences', url: 'https://www.thrillophilia.com' },
      { icon: '🗺️', bg: '#FFF3E0', title: 'Viator', desc: 'Sightseeing experiences', url: 'https://www.viator.com' },
      { icon: '🇮🇳', bg: '#E8F5E9', title: 'Incredible India', desc: 'Official India tourism portal', url: 'https://incredibleindia.gov.in' },
    ],
  },
  {
    title: '🍛 Food',
    links: [
      { icon: '🍽️', bg: '#FCE4EC', title: 'Zomato', desc: 'Restaurants, menus & reviews', url: 'https://www.zomato.com' },
      { icon: '🛵', bg: '#FFF3E0', title: 'Swiggy', desc: 'Food delivery at your stay', url: 'https://www.swiggy.com' },
      { icon: '⭐', bg: '#E8F5E9', title: 'TripAdvisor Eats', desc: 'Top-rated local restaurants', url: 'https://www.tripadvisor.in/Restaurants' },
    ],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('planner');
  const [plannerPreset, setPlannerPreset] = useState<PlannerPreset>(null);
  const [tripSelection, setTripSelection] = useState<TripSelection | null>(null);
  const [heroDestination, setHeroDestination] = useState('');
  const [exploreInitialTab, setExploreInitialTab] = useState<'destinations' | 'circuits' | 'vibes' | 'quiz'>('destinations');
  const { toast, showToast } = useToast();
  const [plannerContext, setPlannerContext] = useState<{ to?: string; month?: string; age?: string; womenFriendly?: boolean }>({});
  const handlePresetConsumed = useCallback(() => setPlannerPreset(null), []);
  const handleTripSelectionConsumed = useCallback(() => setTripSelection(null), []);

  const scrollToPlanner = () => {
    setTimeout(() => {
      const el = document.getElementById('planner-form-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const goToPlanner = (destination: string, month?: string) => {
    setPlannerPreset({ destination, month });
    setTripSelection(null);
    setActiveTab('planner');
    scrollToPlanner();
  };

  const handleTripSelection = (sel: TripSelection) => {
    setTripSelection(sel);
    setPlannerPreset(null);
    setActiveTab('planner');
    scrollToPlanner();
  };

  const handleHeroSearch = () => {
    if (!heroDestination.trim()) {
      showToast('⚠️ Please enter a destination first');
      return;
    }
    goToPlanner(heroDestination.trim());
  };

  return (
    <>
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Only show hero on planner tab */}
      {activeTab === 'planner' && (
        <Hero
          destination={heroDestination}
          onDestinationChange={setHeroDestination}
          onSearch={handleHeroSearch}
          onChipClick={dest => { setHeroDestination(dest); goToPlanner(dest); }}
          onExplore={(tab) => { setExploreInitialTab(tab ?? 'destinations'); setActiveTab('destinations'); }}
        />
      )}

      <div className="page-content">

        {/* AI Planner */}
        {activeTab === 'planner' && (
          <div>
            <h1 className="page-heading" id="planner-form-anchor">✨ AI Trip Planner</h1>
            <p className="page-sub">Fill in your trip details — our AI builds a personalised day-by-day itinerary with hotels, food, budget and local tips</p>
            <PlannerForm
              plannerPreset={plannerPreset}
              onPresetConsumed={handlePresetConsumed}
              tripSelection={tripSelection}
              onTripSelectionConsumed={handleTripSelectionConsumed}
              showToast={showToast}
              onContextChange={setPlannerContext}
            />
          </div>
        )}

        {/* My Trips */}
        {activeTab === 'itinerary' && (
          <div>
            <h1 className="page-heading">📅 My Saved Trips</h1>
            <p className="page-sub">All your AI-generated itineraries in one place — click any card to view the full plan</p>
            <TripHistory showToast={showToast} />
          </div>
        )}

        {/* Budget */}
        {activeTab === 'budget' && (
          <div>
            <h1 className="page-heading">💰 Budget Tracker</h1>
            <p className="page-sub">Set your trip budget and track every expense in ₹ INR — data stays saved in your browser</p>
            <BudgetPage showToast={showToast} />
          </div>
        )}

        {/* Checklist */}
        {activeTab === 'checklist' && (
          <div>
            <h1 className="page-heading">✅ Packing Checklist</h1>
            <p className="page-sub">Check items as you pack — your progress saves automatically</p>
            <ChecklistPage plannerContext={plannerContext} showToast={showToast} />
          </div>
        )}

        {/* Explore — Destinations + Circuits + Vibes + Quiz */}
        {activeTab === 'destinations' && (
          <div>
            <h1 className="page-heading">🏔️ Explore India</h1>
            <p className="page-sub">Browse destinations, curated circuits, travel vibes — or let us recommend the perfect trip for you</p>
            <DestinationsPage
              initialFilter="all"
              initialExploreTab={exploreInitialTab}
              plannerContext={plannerContext}
              onPlanTrip={(dest, month) => goToPlanner(dest, month)}
              onSelectTrip={sel => { handleTripSelection(sel); }}
              showToast={showToast}
            />
          </div>
        )}

        {/* Book Now */}
        {activeTab === 'links' && (
          <div>
            <h1 className="page-heading">🔖 Book & Explore</h1>
            <p className="page-sub">Quick links to trusted Indian booking platforms — flights, trains, hotels, cabs, food and activities</p>
            {BOOK_NOW_SECTIONS.map(section => (
              <div key={section.title} style={{ marginBottom: '32px' }}>
                <div className="book-cat-head">{section.title}</div>
                <div className="book-grid">
                  {section.links.map(link => (
                    <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="book-card">
                      <div className="book-icon" style={{ background: link.bg }}>{link.icon}</div>
                      <div>
                        <h4>{link.title}</h4>
                        <p>{link.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <p style={{ fontSize: '0.72rem', color: 'var(--subtle)', lineHeight: 1.7 }}>
              ℹ️ Roamai is not affiliated with any of the above services. Links are provided for convenience only.
            </p>
          </div>
        )}

      </div>

      <div className="footer-strip">
        © {new Date().getFullYear()} Roamai — AI Travel Companion for India 🇮🇳
        <span style={{ color: 'rgba(255,255,255,.25)' }}> · AI content is for planning reference only — always verify before booking.</span>
      </div>

      <Toast toast={toast} />
    </>
  );
}
