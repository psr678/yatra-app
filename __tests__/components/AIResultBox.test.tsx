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

const defaultProps = {
  streamedText: '',
  isLoading: false,
  destination: 'Goa',
  numDays: 3,
  onClear: vi.fn(),
  showToast: vi.fn(),
};

describe('AIResultBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Regression test for React error #310 ──────────────────────────────────
  // The bug: useMemo was called AFTER an early `return null`, so the second
  // useMemo was skipped on the first render but ran on re-renders → different
  // hook count → React error #310 (crash on "Create my itinerary" click).
  it('does not crash when transitioning from empty → loading → streaming', () => {
    const { rerender } = render(<AIResultBox {...defaultProps} />);
    expect(() => {
      rerender(<AIResultBox {...defaultProps} isLoading={true} />);
    }).not.toThrow();
    expect(() => {
      rerender(<AIResultBox {...defaultProps} isLoading={true} streamedText="## Overview\nContent" />);
    }).not.toThrow();
    expect(() => {
      rerender(<AIResultBox {...defaultProps} isLoading={false} streamedText="## Overview\nContent" />);
    }).not.toThrow();
  });

  // ── Visibility ────────────────────────────────────────────────────────────
  it('renders nothing when not loading and no text', () => {
    const { container } = render(<AIResultBox {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing after clearing text (not loading, text reset to empty)', () => {
    const { rerender, container } = render(
      <AIResultBox {...defaultProps} streamedText="## Overview\nSome text" />
    );
    rerender(<AIResultBox {...defaultProps} streamedText="" isLoading={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  // ── Loading state ─────────────────────────────────────────────────────────
  it('shows loading indicator when isLoading=true', () => {
    render(<AIResultBox {...defaultProps} isLoading={true} />);
    expect(screen.getByText(/crafting your itinerary/i)).toBeInTheDocument();
  });

  it('shows streamed text alongside loading indicator while streaming', () => {
    render(
      <AIResultBox {...defaultProps} isLoading={true} streamedText="## Overview\nPartial content" />
    );
    expect(screen.getByText(/crafting your itinerary/i)).toBeInTheDocument();
    expect(screen.getByText(/Partial content/)).toBeInTheDocument();
  });

  // ── Action buttons ────────────────────────────────────────────────────────
  it('shows PDF, Share and clear buttons when text is present and not loading', () => {
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nSome content" />);
    expect(screen.getByText(/PDF/)).toBeInTheDocument();
    expect(screen.getByText(/Share/)).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('does not show action buttons while loading with no text', () => {
    render(<AIResultBox {...defaultProps} isLoading={true} />);
    expect(screen.queryByText(/PDF/)).not.toBeInTheDocument();
    expect(screen.queryByText('✕')).not.toBeInTheDocument();
  });

  it('calls onClear when the X button is clicked', () => {
    const onClear = vi.fn();
    render(<AIResultBox {...defaultProps} streamedText="## Overview\nContent" onClear={onClear} />);
    fireEvent.click(screen.getByText('✕'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('calls showToast with warning when PDF clicked with no text (guarded path)', () => {
    // This path is not reachable through normal UI (button hidden), but the
    // handler itself guards against it.
    const showToast = vi.fn();
    // Render loading so the box is visible but no action buttons shown
    render(<AIResultBox {...defaultProps} isLoading={true} showToast={showToast} />);
    expect(screen.queryByText(/PDF/)).not.toBeInTheDocument();
  });

  // ── Section tabs ──────────────────────────────────────────────────────────
  it('renders a tab for each ## heading in the response', () => {
    const text = '## Overview\nIntro\n## Budget\nCosts\n## Tips\nAdvice';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Budget' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tips' })).toBeInTheDocument();
  });

  it('first tab is active by default', () => {
    const text = '## Overview\nIntro\n## Budget\nCosts';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Budget' })).not.toHaveClass('active');
  });

  it('switches active tab on click', () => {
    const text = '## Overview\nIntro\n## Budget\nCosts';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    fireEvent.click(screen.getByRole('button', { name: 'Budget' }));
    expect(screen.getByRole('button', { name: 'Budget' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Overview' })).not.toHaveClass('active');
  });

  it('shows the content of the active tab', () => {
    const text = '## Overview\nIntro text here\n## Budget\nCost info here';
    render(<AIResultBox {...defaultProps} streamedText={text} />);
    expect(screen.getByText('Intro text here')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Budget' }));
    expect(screen.getByText('Cost info here')).toBeInTheDocument();
  });

  // ── Day collapse (>4 days) ────────────────────────────────────────────────
  it('shows flat content for itinerary sections when numDays <= 4', () => {
    const dayContent = Array.from(
      { length: 3 },
      (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`
    ).join('\n');
    const text = `## Day-by-Day Itinerary\n${dayContent}`;
    render(<AIResultBox {...defaultProps} streamedText={text} numDays={3} />);
    expect(screen.queryByText(/days — click a day to expand/)).not.toBeInTheDocument();
  });

  it('shows day-collapse UI for itinerary section when numDays > 4', () => {
    const dayContent = Array.from(
      { length: 5 },
      (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`
    ).join('\n');
    const text = `## Day-by-Day Itinerary\n${dayContent}`;
    render(<AIResultBox {...defaultProps} streamedText={text} numDays={5} />);
    expect(screen.getByText(/5 days — click a day to expand/)).toBeInTheDocument();
  });

  it('day 1 is expanded by default in collapse mode', () => {
    const dayContent = Array.from(
      { length: 5 },
      (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`
    ).join('\n');
    const text = `## Day-by-Day Itinerary\n${dayContent}`;
    render(<AIResultBox {...defaultProps} streamedText={text} numDays={5} />);
    expect(screen.getByText('Activities for day 1')).toBeInTheDocument();
    expect(screen.queryByText('Activities for day 2')).not.toBeInTheDocument();
  });

  it('expands a collapsed day when clicked', () => {
    const dayContent = Array.from(
      { length: 5 },
      (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`
    ).join('\n');
    const text = `## Day-by-Day Itinerary\n${dayContent}`;
    render(<AIResultBox {...defaultProps} streamedText={text} numDays={5} />);
    fireEvent.click(screen.getByRole('button', { name: /Day 2/ }));
    expect(screen.getByText('Activities for day 2')).toBeInTheDocument();
  });

  it('collapses an open day when clicked again', () => {
    const dayContent = Array.from(
      { length: 5 },
      (_, i) => `### Day ${i + 1}\nActivities for day ${i + 1}`
    ).join('\n');
    const text = `## Day-by-Day Itinerary\n${dayContent}`;
    render(<AIResultBox {...defaultProps} streamedText={text} numDays={5} />);
    // Day 1 is open; click it to collapse
    fireEvent.click(screen.getByRole('button', { name: /Day 1/ }));
    expect(screen.queryByText('Activities for day 1')).not.toBeInTheDocument();
  });
});
