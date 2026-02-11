import { mergeClasses } from '@/utils/merge-classes';
import {
  type InputHighlightData,
  PDFHighlightViewer,
} from '@epam/pdf-highlighter-kit';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { AUTO_ZOOM_ID, AUTO_ZOOM_VALUE } from './pdf-viewer.contants';

export interface DialPdfRendererProps {
  pdf: string | Blob;
  highlights: InputHighlightData[];
  zoom?: string;
  selectedHighlightId?: string;
  containerClassName?: string;
}

/**
 * DialPdfRenderer component displays PDF documents with highlighting capabilities.
 * Uses pdf-highlighter-kit to render PDFs with text selection and highlighting support.
 *
 * @param pdf - PDF document to display, can be a URL string or Blob object
 * @param highlights - Array of highlights to display in the PDF
 * @param [zoom] - Zoom level - should be 'auto' or a string representing a number
 * @param [selectedHighlightId] - ID of the currently selected highlight to scroll to
 * @param [containerClassName] - Additional CSS classes for the container
 *
 * @example
 * ```tsx
 * <DialPdfRenderer
 *   pdf={pdfBlob}
 *   highlights={[
 *     { id: '1', bboxes: [...] }
 *   ]}
 *   zoom="1.5"
 *   selectedHighlightId="1"
 * />
 * ```
 */
export const DialPdfRenderer: FC<DialPdfRendererProps> = ({
  pdf,
  highlights,
  selectedHighlightId,
  zoom,
  containerClassName,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<PDFHighlightViewer | null>(null);
  const viewerInitted = useRef(false);
  const [isHighlighInit, setIsHightlightInit] = useState(false);

  const goTo = useCallback(
    (id: string) => viewerRef.current?.goToHighlight(id),
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    viewerInitted.current = false;
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    let viewer: PDFHighlightViewer | null = null;
    let mounted = true;

    const initViewer = async () => {
      try {
        viewer = new PDFHighlightViewer();

        await viewer.init(containerRef.current as HTMLElement, {
          enableTextSelection: true,
          enableVirtualScrolling: true,
        });
        viewer.setZoom(1.1);
        await viewer.loadPDF(pdf);
        viewer.loadHighlights(highlights);

        viewerInitted.current = true;

        if (mounted) {
          viewerRef.current = viewer;
        }
        if (highlights && highlights[0]) {
          goTo(highlights[0].id);
        }
      } catch (err) {
        console.error('Error in initViewer:', err);
      }
    };

    initViewer();

    return () => {
      mounted = false;
      if (viewer) viewer.destroy();
    };
  }, [pdf, highlights, goTo]);

  useEffect(() => {
    if (viewerInitted.current && zoom) {
      let zoomValue = parseFloat(
        zoom === AUTO_ZOOM_ID ? AUTO_ZOOM_VALUE : zoom,
      );
      if (isNaN(zoomValue) || zoomValue <= 0) {
        zoomValue = parseFloat(AUTO_ZOOM_VALUE);
      }
      viewerRef.current?.setZoom(zoomValue);
    }
  }, [zoom]);

  useEffect(() => {
    setIsHightlightInit(true);
  }, [highlights]);

  useEffect(() => {
    if (viewerInitted.current && isHighlighInit && selectedHighlightId) {
      goTo(selectedHighlightId);
    }
  }, [goTo, isHighlighInit, selectedHighlightId]);

  return (
    <div
      ref={containerRef}
      className={mergeClasses('grow bg-layer-3', containerClassName)}
    ></div>
  );
};
