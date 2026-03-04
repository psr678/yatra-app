import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from '@/components/Toast';

describe('Toast', () => {
  it('renders the message', () => {
    render(<Toast toast={{ message: 'Hello!', type: '', visible: true }} />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('has show class when visible', () => {
    const { container } = render(<Toast toast={{ message: 'Hi', type: '', visible: true }} />);
    expect(container.firstChild).toHaveClass('show');
  });

  it('does not have show class when not visible', () => {
    const { container } = render(<Toast toast={{ message: 'Hi', type: '', visible: false }} />);
    expect(container.firstChild).not.toHaveClass('show');
  });

  it('adds success class for success type', () => {
    const { container } = render(<Toast toast={{ message: 'Done!', type: 'success', visible: true }} />);
    expect(container.firstChild).toHaveClass('success');
  });
});
