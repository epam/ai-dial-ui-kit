import { mergeClasses } from '@/utils/merge-classes';
import {
  type InputHighlightData,
  PDFHighlightViewer,
} from '@epam/pdf-highlighter-kit';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { AUTO_ZOOM_ID, AUTO_ZOOM_VALUE } from './pdf-viewer.contants';

interface Props {
  pdf: string | Blob;
  highlights: InputHighlightData[];
  // should be 'auto' or a string representing a number
  zoom?: string;
  selectedHighlightId?: string;
  containerClassName?: string;
}

export const PDFViewer: FC<Props> = ({
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
