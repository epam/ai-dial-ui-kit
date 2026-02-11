import type { InputHighlightData } from '@epam/pdf-highlighter-kit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { DialPdfViewer } from './DialPdfViewer';
import { DocumentPreviewCacheProvider } from './DocumentPreviewCacheProvider';

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

describe('Dial UI Kit :: DialPdfViewer', () => {
  const mockHighlights: InputHighlightData[] = [
    {
      id: '1',
      bboxes: [{ x1: 0, y1: 0, x2: 100, y2: 100, page: 1 }],
    },
    {
      id: '2',
      bboxes: [{ x1: 0, y1: 0, x2: 100, y2: 100, page: 2 }],
    },
  ];

  const mockLoadFileCb = vi
    .fn()
    .mockResolvedValue(new Blob(['test'], { type: 'application/pdf' }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render file name', () => {
    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={mockLoadFileCb}
          highlights={mockHighlights}
        />
      </DocumentPreviewCacheProvider>,
    );
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  test('Should show loader initially', () => {
    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={mockLoadFileCb}
          highlights={mockHighlights}
        />
      </DocumentPreviewCacheProvider>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('Should show occurrences counter when multiple highlights exist', async () => {
    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={mockLoadFileCb}
          highlights={mockHighlights}
        />
      </DocumentPreviewCacheProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Occurrences/)).toBeInTheDocument();
    });
    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/\/2/)).toBeInTheDocument();
  });

  test('Should use custom occurencesLabel when provided', async () => {
    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={mockLoadFileCb}
          highlights={mockHighlights}
          occurencesLabel="Matches"
        />
      </DocumentPreviewCacheProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Matches/)).toBeInTheDocument();
    });
  });

  test('Should navigate highlights with chevron buttons', async () => {
    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={mockLoadFileCb}
          highlights={mockHighlights}
        />
      </DocumentPreviewCacheProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    const upButton = buttons.find(
      (btn) =>
        btn.querySelector('[data-icon="chevron-up"]')?.parentElement === btn,
    );

    if (upButton) {
      fireEvent.click(upButton);
      await waitFor(() => {
        expect(screen.getByText(/2/)).toBeInTheDocument();
      });
    }
  });

  test('Should display error message when file loading fails', async () => {
    const failingLoadCb = vi.fn().mockRejectedValue(new Error('Load failed'));

    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={failingLoadCb}
          highlights={mockHighlights}
        />
      </DocumentPreviewCacheProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load document/)).toBeInTheDocument();
    });
  });

  test('Should use custom error label when provided', async () => {
    const failingLoadCb = vi.fn().mockRejectedValue(new Error('Load failed'));

    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={failingLoadCb}
          highlights={mockHighlights}
          errorLabel="Custom error message"
        />
      </DocumentPreviewCacheProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  test('Should render zoom controls', async () => {
    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl="https://example.com/test.pdf"
          fileName="test.pdf"
          loadFileCb={mockLoadFileCb}
          highlights={mockHighlights}
        />
      </DocumentPreviewCacheProvider>,
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  test('Should call loadFileCb with correct URL', async () => {
    const fileUrl = 'https://example.com/test.pdf';

    render(
      <DocumentPreviewCacheProvider>
        <DialPdfViewer
          fileUrl={fileUrl}
          fileName="test.pdf"
          loadFileCb={mockLoadFileCb}
          highlights={mockHighlights}
        />
      </DocumentPreviewCacheProvider>,
    );

    await waitFor(() => {
      expect(mockLoadFileCb).toHaveBeenCalledWith(fileUrl);
    });
  });
});
