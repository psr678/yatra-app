import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DestCard from '@/components/destinations/DestCard';
import type { Destination } from '@/types';

const mockDest: Destination = {
  name: 'Goa',
  state: 'Goa',
  emoji: '🏖️',
  tags: ['single', 'beach', 'winter', 'adventure'],
  desc: 'Beaches, nightlife, Portuguese heritage & seafood',
};

describe('DestCard', () => {
  it('renders the destination name', () => {
    render(<DestCard dest={mockDest} onPlanTrip={() => {}} />);
    expect(screen.getByText('Goa')).toBeInTheDocument();
  });

  it('renders the state', () => {
    render(<DestCard dest={mockDest} onPlanTrip={() => {}} />);
    expect(screen.getByText('📍 Goa')).toBeInTheDocument();
  });

  it('renders the emoji', () => {
    render(<DestCard dest={mockDest} onPlanTrip={() => {}} />);
    expect(screen.getByText('🏖️')).toBeInTheDocument();
  });

  it('calls onPlanTrip with destination name when clicked', () => {
    const onPlanTrip = vi.fn();
    render(<DestCard dest={mockDest} onPlanTrip={onPlanTrip} />);
    fireEvent.click(screen.getByText('Goa'));
    expect(onPlanTrip).toHaveBeenCalledWith('Goa');
  });

  it('shows Solo tag for single-tagged destination', () => {
    render(<DestCard dest={mockDest} onPlanTrip={() => {}} />);
    expect(screen.getByText('🧳 Solo')).toBeInTheDocument();
  });

  it('does not show Women Safe tag when not in tags', () => {
    render(<DestCard dest={mockDest} onPlanTrip={() => {}} />);
    expect(screen.queryByText('👩 Women Safe')).not.toBeInTheDocument();
  });

  it('shows Women Safe tag when women tag is present', () => {
    const womenDest = { ...mockDest, tags: ['women', 'winter'] };
    render(<DestCard dest={womenDest} onPlanTrip={() => {}} />);
    expect(screen.getByText('👩 Women Safe')).toBeInTheDocument();
  });
});
