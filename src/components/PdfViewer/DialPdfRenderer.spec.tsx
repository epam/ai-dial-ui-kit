import { render } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { DialPdfRenderer } from './DialPdfRenderer';
import type { InputHighlightData } from '@epam/pdf-highlighter-kit';

// Mock the PDFHighlightViewer
vi.mock('@epam/pdf-highlighter-kit', () => ({
  PDFHighlightViewer: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    setZoom: vi.fn(),
    loadPDF: vi.fn().mockResolvedValue(undefined),
    loadHighlights: vi.fn(),
    goToHighlight: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe('Dial UI Kit :: DialPdfRenderer', () => {
  const mockHighlights: InputHighlightData[] = [
    {
      id: '1',
      bboxes: [{ x1: 0, y1: 0, x2: 100, y2: 100, page: 1 }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render container with correct className', () => {
    const { container } = render(
      <DialPdfRenderer
        pdf="test.pdf"
        highlights={mockHighlights}
        containerClassName="custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass(
      'grow',
      'bg-layer-3',
      'custom-class',
    );
  });

  test('Should render with default className when containerClassName is not provided', () => {
    const { container } = render(
      <DialPdfRenderer pdf="test.pdf" highlights={mockHighlights} />,
    );
    expect(container.firstChild).toHaveClass('grow', 'bg-layer-3');
  });

  test('Should accept pdf as string', () => {
    const { container } = render(
      <DialPdfRenderer
        pdf="https://example.com/test.pdf"
        highlights={mockHighlights}
      />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Should accept pdf as Blob', () => {
    const blob = new Blob(['test'], { type: 'application/pdf' });
    const { container } = render(
      <DialPdfRenderer pdf={blob} highlights={mockHighlights} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Should render with empty highlights array', () => {
    const { container } = render(
      <DialPdfRenderer pdf="test.pdf" highlights={[]} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
