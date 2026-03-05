import { describe, it, expect, vi, beforeEach } from 'vitest';

// exportPDF uses window.open — mock it
const mockWrite = vi.fn();
const mockClose = vi.fn();
beforeEach(() => {
  vi.stubGlobal('window', {
    ...globalThis.window,
    open: vi.fn(() => ({ document: { write: mockWrite, close: mockClose } })),
  });
  mockWrite.mockClear();
});

// Dynamic import so the window mock is in place first
const { exportPDF } = await import('@/lib/utils');

describe('exportPDF — XSS prevention', () => {
  it('escapes HTML tags in destination', () => {
    exportPDF('Some content', '<script>alert(1)</script>');
    const html: string = mockWrite.mock.calls[0][0];
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes HTML tags in content', () => {
    exportPDF('<img src=x onerror="alert(1)">', 'Goa');
    const html: string = mockWrite.mock.calls[0][0];
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img');
  });

  it('escapes ampersands', () => {
    exportPDF('Day 1 & Day 2', 'Goa & Mangalore');
    const html: string = mockWrite.mock.calls[0][0];
    expect(html).toContain('Day 1 &amp; Day 2');
    expect(html).toContain('Goa &amp; Mangalore');
  });

  it('does nothing when content is empty', () => {
    exportPDF('', 'Goa');
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it('renders safe content unchanged in structure', () => {
    exportPDF('Great trip!', 'Goa');
    const html: string = mockWrite.mock.calls[0][0];
    expect(html).toContain('Great trip!');
    expect(html).toContain('Goa');
  });
});
