import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AIResultBox from '@/components/planner/AIResultBox';

vi.mock('@/lib/utils', () => ({
  exportPDF: vi.fn(),
  shareItinerary: vi.fn(),
}));

vi.mock('@/components/MarkdownRenderer', () => ({
  default: ({ content }: { content: string }) => <div data-testid="markdown">{content}</div>,
}));

// Mock fetch for lazy tabs
global.fetch = vi.fn();

const defaultProps = {
  streamedText: '',
  isLoading: false,
  destination: 'Goa',
  numDays: 3,
  from: 'Mumbai',
  budget: 'moderate',
  people: 2,
  onClear: vi.fn(),
  showToast: vi.fn(),
};

// Helper: check if a tab button is visually active (orange color in inline style)
function isTabActive(btn: HTMLElement) {
  return btn.style.color === 'var(--orange)' || btn.style.borderBottomColor === 'var(--orange)';
}

describe('AIResultBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Regression: React error #310 ──────────────────────────────────────────
  it('does not crash when transitioning from empty → loading → streaming', () => {
    const { rerender } = render(<AIResultBox {...defaultProps} />);
    expect(() => rerender(<AIResultBox {...defaultProps} isLoading={true} />)).not.toThrow();
    expect(() => rerender(<AIResultBox {...defaultProps} isLoading={true} streamedText="## Overview\nContent" />)).not.toThrow();
    expect(() => rerender(<AIResultBox {...defaultProps} isLoading={false} streamedText="## Overview\nContent" />)).not.toThrow();
  });

  // ── Visibility ────────────────────────────────────────────────────────────
  it('renders nothing when not loading and no text', () => {
    const { container } = render(<AIResultBox {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing after clearing text', () => {
    const { rerender, container } = render(<AIResultBox {...defaultProps} streamedText="## Overview\nSome text" />);
    rerender(<AIResultBox {...defaultProps} streamedText="" isLoading={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  // ── Loading state ─────────────────────────────────────────────────────────
  it('shows loading indicator when isLoading=true', () => {
    render(<AIResultBox {...defaultProps} isLoading={true} />);
    expect(screen.getByText(/crafting your itinerary/i)).toBeInTheDocument();
  });

  it('shows streamed text alongside loading indicator while streaming', () => {
    render(<AIResultBox {...defaultProps} isLoading={true} streamedText="## Overview\nPartial content" />);
    expect(screen.getByText(/crafting your itinerary/i)).toBeInTheDocument();
    expect(screen.getByText(/Partial content/)).toBeInTheDocument();
  });

  // ── Action buttons ────────────────────────────────────────────────────────
  it('shows PDF, Share and close buttons when text is present and not loading', () => {
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nSome content" />);
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
    expect(screen.getByText(/Share/)).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('hides PDF/Share buttons when in error state', () => {
    render(<AIResultBox {...defaultProps} streamedText="⚠️ Our AI assistants are taking a short break" />);
    expect(screen.queryByText(/PDF/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Share/)).not.toBeInTheDocument();
  });

  it('calls onClear when the X button is clicked', () => {
    const onClear = vi.fn();
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nContent" onClear={onClear} />);
    fireEvent.click(screen.getByText('✕'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  // ── Section tabs ──────────────────────────────────────────────────────────
  it('renders a tab for each ## heading plus Budget, Day Trips, Getting There', () => {
    const text = '## Overview\nIntro\n## Tips\nAdvice';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tips' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Budget/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Day Trips/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Getting There/ })).toBeInTheDocument();
  });

  it('first AI tab is active by default', () => {
    const text = '## Overview\nIntro\n## Tips\nAdvice';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    const overviewBtn = screen.getByRole('button', { name: 'Overview' });
    const tipsBtn = screen.getByRole('button', { name: 'Tips' });
    expect(isTabActive(overviewBtn)).toBe(true);
    expect(isTabActive(tipsBtn)).toBe(false);
  });

  it('switches active tab on click', () => {
    const text = '## Overview\nIntro\n## Tips\nAdvice';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    const overviewBtn = screen.getByRole('button', { name: 'Overview' });
    const tipsBtn = screen.getByRole('button', { name: 'Tips' });
    fireEvent.click(tipsBtn);
    expect(isTabActive(tipsBtn)).toBe(true);
    expect(isTabActive(overviewBtn)).toBe(false);
  });

  it('shows the content of the active AI tab', () => {
    const text = '## Overview\nIntro text here\n## Tips\nTip info here';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    expect(screen.getByText('Intro text here')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tips' }));
    expect(screen.getByText('Tip info here')).toBeInTheDocument();
  });

  // ── Budget tab (static) ───────────────────────────────────────────────────
  it('shows budget estimate card when Budget tab is clicked', () => {
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nContent" />);
    fireEvent.click(screen.getByRole('button', { name: /Budget/ }));
    expect(screen.getByText(/Budget Estimate/i)).toBeInTheDocument();
  });

  it('budget card shows correct trip details', () => {
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nContent" people={2} numDays={3} />);
    fireEvent.click(screen.getByRole('button', { name: /Budget/ }));
    // Header shows "2p × 3d" in the table column heading
    expect(screen.getByText(/2p.*3d/i)).toBeInTheDocument();
  });

  // ── Emergency contacts ────────────────────────────────────────────────────
  it('shows emergency contacts on itinerary tab', () => {
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nContent" />);
    expect(screen.getByText(/Emergency Contacts/i)).toBeInTheDocument();
  });

  it('hides emergency contacts on Budget tab', () => {
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nContent" />);
    fireEvent.click(screen.getByRole('button', { name: /Budget/ }));
    expect(screen.queryByText(/Emergency Contacts/i)).not.toBeInTheDocument();
  });

  it('hides emergency contacts on Day Trips tab', () => {
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nContent" />);
    fireEvent.click(screen.getByRole('button', { name: /Day Trips/ }));
    expect(screen.queryByText(/Emergency Contacts/i)).not.toBeInTheDocument();
  });

  // ── Error state ───────────────────────────────────────────────────────────
  it('shows error panel inside Itinerary tab when AI fails', () => {
    render(<AIResultBox {...defaultProps} streamedText="⚠️ Our AI assistants are taking a short break due to high traffic." />);
    expect(screen.getByText(/AI is taking a short break/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('still shows all tabs (Budget, Day Trips, Getting There) in error state', () => {
    render(<AIResultBox {...defaultProps} streamedText="⚠️ Our AI assistants are taking a short break due to high traffic." />);
    expect(screen.getByRole('button', { name: /Itinerary/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Budget/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Day Trips/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Getting There/ })).toBeInTheDocument();
  });

  it('Budget tab works in error state', () => {
    render(<AIResultBox {...defaultProps} streamedText="⚠️ Our AI assistants are taking a short break due to high traffic." />);
    fireEvent.click(screen.getByRole('button', { name: /Budget/ }));
    expect(screen.getByText(/Budget Estimate/i)).toBeInTheDocument();
  });

  it('does not show emergency contacts in error state', () => {
    render(<AIResultBox {...defaultProps} streamedText="⚠️ Our AI assistants are taking a short break due to high traffic." />);
    expect(screen.queryByText(/Emergency Contacts/i)).not.toBeInTheDocument();
  });

  // ── Day collapse (>4 days) ────────────────────────────────────────────────
  it('shows flat content for itinerary when numDays <= 4', () => {
    const dayContent = Array.from({ length: 3 }, (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`).join('\n');
    render(<AIResultBox {...defaultProps} streamedText={`## Day-by-Day Itinerary\n${dayContent}`} numDays={3} />);
    expect(screen.queryByText(/days — click a day to expand/)).not.toBeInTheDocument();
  });

  it('shows day-collapse UI for itinerary when numDays > 4', () => {
    const dayContent = Array.from({ length: 5 }, (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`).join('\n');
    render(<AIResultBox {...defaultProps} streamedText={`## Day-by-Day Itinerary\n${dayContent}`} numDays={5} />);
    expect(screen.getByText(/5 days — click a day to expand/)).toBeInTheDocument();
  });

  it('day 1 is expanded by default in collapse mode', () => {
    const dayContent = Array.from({ length: 5 }, (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`).join('\n');
    render(<AIResultBox {...defaultProps} streamedText={`## Day-by-Day Itinerary\n${dayContent}`} numDays={5} />);
    expect(screen.getByText('Activities for day 1')).toBeInTheDocument();
    expect(screen.queryByText('Activities for day 2')).not.toBeInTheDocument();
  });

  it('expands a collapsed day when clicked', () => {
    const dayContent = Array.from({ length: 5 }, (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`).join('\n');
    render(<AIResultBox {...defaultProps} streamedText={`## Day-by-Day Itinerary\n${dayContent}`} numDays={5} />);
    fireEvent.click(screen.getByRole('button', { name: /Day 2/ }));
    expect(screen.getByText('Activities for day 2')).toBeInTheDocument();
  });

  it('collapses an open day when clicked again', () => {
    const dayContent = Array.from({ length: 5 }, (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`).join('\n');
    render(<AIResultBox {...defaultProps} streamedText={`## Day-by-Day Itinerary\n${dayContent}`} numDays={5} />);
    fireEvent.click(screen.getByRole('button', { name: /Day 1/ }));
    expect(screen.queryByText('Activities for day 1')).not.toBeInTheDocument();
  });
});
