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
  useState,
} from 'react';

import { DialButton } from '@/components/Button/Button';
import { DialLoader } from '@/components/Loader/Loader';
import { DialSelect } from '@/components/Select/Select';
import { ButtonSize } from '@/types/button';
import { SelectSize } from '@/types/select';
import { useDocumentPreviewCache } from './DocumentPreviewCacheContext';
import { PDFViewer } from './PdfViewer';
import {
  AUTO_ZOOM_ID,
  AUTO_ZOOM_VALUE,
  ZOOM_OPTIONS,
} from './pdf-viewer.contants';

interface Props {
  fileUrl: string;
  fileName: string;
  loadFileCb: (url: string) => Promise<Blob>;
  highlights: InputHighlightData[];
  errorLabel?: ReactNode;
  occurencesLabel?: ReactNode;
}

export const DocumentPreview: FC<Props> = ({
  fileUrl,
  fileName,
  errorLabel,
  occurencesLabel,
  highlights,
  loadFileCb,
}) => {
  const cache = useDocumentPreviewCache();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [zoom, setZoom] = useState(AUTO_ZOOM_ID);

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
  }, [fileUrl, cache, loadFileCb]);

  return (
    <div className="flex flex-col self-center gap-4 py-3 px-6 h-full w-full bg-layer-2">
      <div className="dial-tiny text-secondary truncate">{fileName}</div>
      <div className="flex w-full justify-between items-center">
        <div>
          {highlights.length > 1 && (
            <div className="flex gap-1 py-1 px-[6px] items-center bg-layer-4 rounded w-fit">
              <span className="dial-small">
                {occurencesLabel ?? 'Occurrences'}:
                <span className="min-w-3 inline-block text-right">
                  {currentIndex + 1}
                </span>
                /{highlights.length}
              </span>
              <DialButton
                className="p-0 text-primary"
                iconAfter={<IconChevronDown size={16} />}
                onClick={() => changeIndex(-1)}
              />
              <DialButton
                className="p-0 text-primary"
                iconAfter={<IconChevronUp size={16} />}
                onClick={() => changeIndex(1)}
              />
            </div>
          )}
        </div>
        <div className="flex gap-0.5 items-center">
          <DialSelect
            size={SelectSize.Sm}
            className="bg-layer-4 border-transparent hover:border-hover rounded"
            options={ZOOM_OPTIONS}
            value={zoom}
            onChange={(v) => setZoom(v as string)}
          />
          <DialButton
            className="p-1 rounded text-primary bg-layer-4 border border-transparent hover:border-hover"
            iconAfter={<IconMinus size={16} />}
            size={ButtonSize.Small}
            onClick={handleZoomChange.bind(null, -1)}
          />
          <DialButton
            className="p-1 rounded text-primary bg-layer-4 border border-transparent hover:border-hover"
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
              {errorLabel ?? 'Failed to load document.'}
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
        <PDFViewer
          pdf={file}
          highlights={highlights}
          selectedHighlightId={highlights[currentIndex]?.id}
          zoom={zoom}
        />
      )}
    </div>
  );
};
