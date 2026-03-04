'use client';

import { useState } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Toast from '@/components/Toast';
import PlannerForm from '@/components/planner/PlannerForm';
import TripHistory from '@/components/trips/TripHistory';
import BudgetPage from '@/components/budget/BudgetPage';
import ChecklistPage from '@/components/checklist/ChecklistPage';
import DestinationsPage from '@/components/destinations/DestinationsPage';
import { useToast } from '@/hooks/useToast';
import type { TabId } from '@/types';

type PlannerPreset = {
  destination?: string;
  travellerType?: string;
  ageGroup?: string;
} | null;

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('planner');
  const [plannerPreset, setPlannerPreset] = useState<PlannerPreset>(null);
  const [destFilter, setDestFilter] = useState('all');
  const [plannerContext, setPlannerContext] = useState<{ to?: string; month?: string; age?: string; womenFriendly?: boolean }>({});
  const { toast, showToast } = useToast();

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const handlePlanTripFromDest = (destination: string) => {
    setPlannerPreset({ destination });
    setActiveTab('planner');
  };

  const handleFilterDestinations = (filter: string) => {
    setDestFilter(filter);
  };

  return (
    <>
      <Nav activeTab={activeTab} onTabChange={handleTabChange} />
      <Hero
        onTabChange={handleTabChange}
        onFilterDestinations={handleFilterDestinations}
        showToast={showToast}
      />

      <div className="main">
        {/* Planner */}
        <div className={`page ${activeTab === 'planner' ? 'active' : ''}`}>
          <div className="section-title">🗺️ Plan Your Trip</div>
          <p className="section-sub">AI-powered itinerary generator for Indian destinations</p>
          <PlannerForm
            plannerPreset={plannerPreset}
            onPresetConsumed={() => setPlannerPreset(null)}
            showToast={showToast}
          />
        </div>

        {/* My Schedule / Saved Trips */}
        <div className={`page ${activeTab === 'itinerary' ? 'active' : ''}`}>
          <TripHistory showToast={showToast} />
        </div>

        {/* Budget */}
        <div className={`page ${activeTab === 'budget' ? 'active' : ''}`}>
          <BudgetPage showToast={showToast} />
        </div>

        {/* Checklist */}
        <div className={`page ${activeTab === 'checklist' ? 'active' : ''}`}>
          <ChecklistPage plannerContext={plannerContext} showToast={showToast} />
        </div>

        {/* Destinations */}
        <div className={`page ${activeTab === 'destinations' ? 'active' : ''}`}>
          <DestinationsPage
            initialFilter={destFilter}
            plannerContext={plannerContext}
            onPlanTrip={handlePlanTripFromDest}
            showToast={showToast}
          />
        </div>

        {/* Book Now (links) */}
        <div className={`page ${activeTab === 'links' ? 'active' : ''}`}>
          <div className="section-title">🔖 Book Now</div>
          <p className="section-sub">Trusted platforms for flights, trains, hotels & activities</p>
          <div className="link-grid">
            {[
              { icon: '✈️', bg: '#E3F2FD', title: 'MakeMyTrip', desc: 'Flights, hotels & holiday packages', url: 'https://www.makemytrip.com' },
              { icon: '🚆', bg: '#E8F5E9', title: 'IRCTC', desc: 'Official Indian Railways ticket booking', url: 'https://www.irctc.co.in' },
              { icon: '🏨', bg: '#FFF3E0', title: 'OYO Rooms', desc: 'Affordable hotels across India', url: 'https://www.oyorooms.com' },
              { icon: '🚌', bg: '#F3E5F5', title: 'RedBus', desc: 'Bus tickets for intercity travel', url: 'https://www.redbus.in' },
              { icon: '🏔️', bg: '#E0F2F1', title: 'Thrillophilia', desc: 'Adventure & experiential travel', url: 'https://www.thrillophilia.com' },
              { icon: '🌴', bg: '#FFF8E1', title: 'Airbnb India', desc: 'Unique stays and experiences', url: 'https://www.airbnb.co.in' },
              { icon: '🚗', bg: '#FCE4EC', title: 'Zoomcar', desc: 'Self-drive car rentals', url: 'https://www.zoomcar.com' },
              { icon: '📍', bg: '#E8EAF6', title: 'TripAdvisor India', desc: 'Reviews, attractions & restaurants', url: 'https://www.tripadvisor.in' },
            ].map(link => (
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
      </div>

      <Toast toast={toast} />
    </>
  );
}
