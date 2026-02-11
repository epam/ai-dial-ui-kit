import type { InputHighlightData } from '@epam/pdf-highlighter-kit';
import {
  IconAlertTriangle,
  IconChevronDown,
  IconChevronUp,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react';
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DialButton } from '@/components/Button/Button';
import { DialLoader } from '@/components/Loader/Loader';
import { DialSelect } from '@/components/Select/Select';
import { ButtonSize } from '@/types/button';
import { SelectSize, SelectVariant } from '@/types/select';
import { DialPdfRenderer } from './DialPdfRenderer';
import { useDocumentPreviewCache } from './DocumentPreviewCacheContext';
import {
  AUTO_ZOOM_ID,
  AUTO_ZOOM_VALUE,
  ZOOM_OPTIONS,
} from './pdf-viewer.contants';
import { DialEllipsisTooltip } from '../EllipsisTooltip/EllipsisTooltip';

export interface DialPdfViewerProps {
  fileUrl: string;
  fileName: string;
  loadFileCb: (url: string) => Promise<Blob>;
  highlights: InputHighlightData[];
  errorLabel?: ReactNode;
  occurencesLabel?: ReactNode;
  unsupportedLabel?: ReactNode;
}

/**
 * DialPdfViewer component provides a full-featured PDF document preview
 * with navigation controls, zoom functionality, and highlight navigation.
 *
 * Features:
 * - Automatic file loading and caching via DocumentPreviewCacheProvider
 * - Navigation between multiple highlights
 * - Adjustable zoom levels
 * - Error handling with custom error messages
 * - Loading states
 *
 * @param fileUrl - URL of the document file to load
 * @param fileName - Name of the file to display
 * @param loadFileCb - Callback function to load the file as a Blob
 * @param highlights - Array of highlights to display in the document
 * @param [errorLabel] - Custom label for error message when document fails to load
 * @param [occurencesLabel] - Custom label for the occurrences counter
 * @param [unsupportedLabel] - Custom label for unsupported file type error
 *
 * @example
 * ```tsx
 * <DocumentPreviewCacheProvider>
 *   <DialPdfViewer
 *     fileUrl="https://example.com/document.pdf"
 *     fileName="document.pdf"
 *     loadFileCb={async (url) => {
 *       const response = await fetch(url);
 *       return response.blob();
 *     }}
 *     highlights={[
 *       { id: '1', bboxes: [...] }
 *     ]}
 *   />
 * </DocumentPreviewCacheProvider>
 * ```
 */
export const DialPdfViewer: FC<DialPdfViewerProps> = ({
  fileUrl,
  fileName,
  errorLabel,
  occurencesLabel,
  unsupportedLabel,
  highlights,
  loadFileCb,
}) => {
  const cache = useDocumentPreviewCache();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [zoom, setZoom] = useState(AUTO_ZOOM_ID);

  const isPdfFile = useMemo(
    () => fileName.toLowerCase().endsWith('.pdf'),
    [fileName],
  );

  const changeIndex = useCallback(
    (dir: 1 | -1) => {
      setCurrentIndex(
        (currentIndex + dir + highlights.length) % highlights.length,
      );
    },
    [currentIndex, highlights.length],
  );

  const handleZoomChange = useCallback(
    (dir?: 1 | -1) => {
      const currentZoom = zoom === AUTO_ZOOM_ID ? AUTO_ZOOM_VALUE : zoom;
      const currentIndex = ZOOM_OPTIONS.findIndex(
        (opt) => opt.value === currentZoom,
      );
      let newValue = currentZoom;
      if (dir === -1 && currentIndex > 1) {
        newValue = ZOOM_OPTIONS[currentIndex - 1].value;
      } else if (dir === 1 && currentIndex < ZOOM_OPTIONS.length - 1) {
        newValue = ZOOM_OPTIONS[currentIndex + 1].value;
      } else {
        return;
      }
      setZoom(newValue);
    },
    [zoom],
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    setFile(null);

    if (!isPdfFile) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const loaded = await cache.getFile(fileUrl, () => loadFileCb(fileUrl));
        if (!cancelled) {
          setFile(loaded);
        }
      } catch {
        if (!cancelled) {
          setIsError(true);
          setFile(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [fileUrl, cache, loadFileCb, isPdfFile]);

  return (
    <div className="flex flex-col self-center gap-4 py-3 px-6 h-full w-full bg-layer-2">
      <div>
        <DialEllipsisTooltip
          text={fileName}
          className="dial-tiny text-secondary"
        />
      </div>
      <div className="flex w-full justify-between items-center">
        <div>
          <div className="flex gap-1 py-0.5 px-1.5 min-h-[26px] items-center bg-layer-4 rounded w-fit">
            <span className="dial-small text-primary">
              {occurencesLabel ?? 'Occurrences'}:
              <span className="pl-0.5 min-w-3 inline-block text-right">
                {highlights.length > 0
                  ? `${currentIndex + 1}/${highlights.length}`
                  : '0'}
              </span>
            </span>
            {highlights.length > 0 && (
              <>
                <DialButton
                  className="p-0 text-primary !h-6.5"
                  size={ButtonSize.Small}
                  iconAfter={<IconChevronDown size={16} />}
                  onClick={() => changeIndex(1)}
                />
                <DialButton
                  className="p-0 text-primary !h-6.5"
                  size={ButtonSize.Small}
                  iconAfter={<IconChevronUp size={16} />}
                  onClick={() => changeIndex(-1)}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex gap-0.5 items-center">
          <DialSelect
            size={SelectSize.Sm}
            className="h-6.5! dial-input-border-transparent"
            options={ZOOM_OPTIONS}
            variant={SelectVariant.Secondary}
            value={zoom}
            onChange={(v) => setZoom(v as string)}
          />
          <DialButton
            className="py-3 flex items-center justify-center rounded text-primary bg-layer-4 border border-transparent hover:border-hover"
            iconAfter={<IconMinus size={16} />}
            size={ButtonSize.Small}
            onClick={handleZoomChange.bind(null, -1)}
          />
          <DialButton
            className="py-3 flex items-center justify-center rounded text-primary bg-layer-4 border border-transparent hover:border-hover"
            iconAfter={<IconPlus size={16} />}
            size={ButtonSize.Small}
            onClick={handleZoomChange.bind(null, 1)}
          />
        </div>
      </div>

      {isError && (
        <div className="grow flex items-center justify-center bg-layer-3">
          <div className="flex flex-col items-center gap-6 p-10">
            <IconAlertTriangle
              size={60}
              stroke={2}
              className="text-secondary"
            />
            <div className="text-center dial-small whitespace-pre-wrap">
              {!isPdfFile && unsupportedLabel
                ? unsupportedLabel
                : (errorLabel ?? 'Failed to load document.')}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grow flex items-center justify-center bg-layer-3">
          <DialLoader size={60} />
        </div>
      )}

      {file && (
        <DialPdfRenderer
          pdf={file}
          highlights={highlights}
          selectedHighlightId={highlights[currentIndex]?.id}
          zoom={zoom}
        />
      )}
    </div>
  );
};
