import type { Column, GridApi } from 'ag-grid-community';
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/Skeleton/Skeleton';
import {
  SKELETON_BAR_CLASS_NAME,
  SKELETON_BAR_HEIGHT,
  SKELETON_BAR_WIDTHS,
} from '@/components/Skeleton/constants';
import { SkeletonShimmer } from '@/components/Skeleton/SkeletonShimmer';
import { SkeletonTone, SkeletonVariant } from '@/types/skeleton';
import { mergeClasses } from '@/utils/merge-classes';

import { ROW_HEIGHT } from '../constants';

/** Identifies a cell in the loading overlay, not a real grid row. */
export interface GridLoadingCellParams {
  columnId: string;
  rowIndex: number;
}

export interface GridLoadingSkeletonState {
  showSkeleton: boolean;
  suppressEmptyState: boolean;
  rowHeight: number;
  selectionColumnId: string;
  renderCell?: (params: GridLoadingCellParams) => ReactNode;
}

export const GridLoadingSkeletonContext =
  createContext<GridLoadingSkeletonState>({
    showSkeleton: false,
    suppressEmptyState: false,
    rowHeight: ROW_HEIGHT,
    selectionColumnId: '',
  });

/**
 * A non-interactive overlay that leaves the grid's real rows and selection
 * intact. Placeholders are not AG Grid rows and the entire overlay is hidden
 * and inert, so it adds no accessible rows and does not change `aria-rowcount`.
 */
export const GridLoadingSkeleton = ({
  api,
  gridRoot,
}: {
  api: GridApi;
  gridRoot: HTMLElement;
}) => {
  const { showSkeleton, rowHeight, selectionColumnId, renderCell } = useContext(
    GridLoadingSkeletonContext,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(ROW_HEIGHT * 12);
  const [insets, setInsets] = useState({ top: 0, bottom: 0 });
  const [, refresh] = useState(0);

  // AG Grid's built-in loading overlay is exclusive and covers the header.
  // Position our independent layer over the body and pinned rows only.
  useLayoutEffect(() => {
    const header = gridRoot.querySelector<HTMLElement>(':scope > .ag-header');
    const regions = Array.from(
      gridRoot.querySelectorAll<HTMLElement>(
        ':scope > .ag-body, :scope > .ag-floating-top, :scope > .ag-sticky-top, :scope > .ag-sticky-bottom, :scope > .ag-floating-bottom',
      ),
    );
    const update = () => {
      const rootRect = gridRoot.getBoundingClientRect();
      const headerRect = header?.getBoundingClientRect();
      const top = headerRect
        ? Math.max(0, headerRect.bottom - rootRect.top)
        : 0;
      const bottoms = regions
        .map((region) => region.getBoundingClientRect())
        .filter((rect) => rect.height > 0)
        .map((rect) => rect.bottom);
      const bodyBottom = bottoms.length
        ? Math.max(...bottoms)
        : rootRect.bottom;
      const bottom = Math.max(0, rootRect.bottom - bodyBottom);
      setInsets((previous) =>
        previous.top === top && previous.bottom === bottom
          ? previous
          : { top, bottom },
      );
    };
    update();
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(update);
    [gridRoot, header, ...regions].forEach((element) => {
      if (element) observer?.observe(element);
    });
    api.addEventListener('gridSizeChanged', update);
    api.addEventListener('modelUpdated', update);
    return () => {
      observer?.disconnect();
      if (!api.isDestroyed()) {
        api.removeEventListener('gridSizeChanged', update);
        api.removeEventListener('modelUpdated', update);
      }
    };
  }, [api, gridRoot]);

  useEffect(() => {
    const update = () => refresh((value) => value + 1);
    const events = [
      'displayedColumnsChanged',
      'columnResized',
      'bodyScroll',
      'gridSizeChanged',
    ] as const;
    events.forEach((event) => api.addEventListener(event, update));
    return () => {
      if (!api.isDestroyed()) {
        events.forEach((event) => api.removeEventListener(event, update));
      }
    };
  }, [api]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.height > 0) setHeight(entry.contentRect.height);
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const columns = api.getAllDisplayedColumns();
  const left = columns.filter((column) => column.getPinned() === 'left');
  const right = columns.filter((column) => column.getPinned() === 'right');
  const center = columns.filter((column) => !column.getPinned());
  const widthOf = (items: Column[]) =>
    items.reduce((total, column) => total + column.getActualWidth(), 0);
  const scrollLeft = api.getHorizontalPixelRange().left;
  const count = Math.max(1, Math.ceil(height / Math.max(1, rowHeight)));

  const cells = (items: Column[], rowIndex: number) =>
    items.map((column) => {
      const columnId = column.getColId();
      return (
        <div
          key={columnId}
          className="flex shrink-0 items-center overflow-hidden px-3"
          style={{ width: column.getActualWidth() }}
        >
          {columnId === selectionColumnId ? null : renderCell ? (
            renderCell({ columnId, rowIndex })
          ) : (
            <Skeleton
              variant={SkeletonVariant.Text}
              width={
                SKELETON_BAR_WIDTHS[
                  (rowIndex + columns.indexOf(column)) %
                    SKELETON_BAR_WIDTHS.length
                ]
              }
              height={SKELETON_BAR_HEIGHT}
              tone={rowIndex % 2 === 0 ? SkeletonTone.Dark : SkeletonTone.Light}
              className={SKELETON_BAR_CLASS_NAME}
            />
          )}
        </div>
      );
    });

  return (
    <div
      aria-hidden="true"
      className="dial-kit-grid-skeleton-overlay"
      style={insets}
    >
      <div
        ref={rootRef}
        aria-hidden="true"
        inert
        className={mergeClasses(
          'size-full overflow-hidden text-start',
          showSkeleton && 'bg-layer-raised',
        )}
      >
        <SkeletonShimmer
          className={mergeClasses('size-full', !showSkeleton && 'invisible')}
        >
          {Array.from({ length: count }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex overflow-hidden border-b-[0.5px] border-tertiary"
              style={{ height: rowHeight }}
            >
              <div className="flex shrink-0" style={{ width: widthOf(left) }}>
                {cells(left, rowIndex)}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div
                  className="flex h-full"
                  style={{
                    width: widthOf(center),
                    transform: `translateX(-${scrollLeft}px)`,
                  }}
                >
                  {cells(center, rowIndex)}
                </div>
              </div>
              <div className="flex shrink-0" style={{ width: widthOf(right) }}>
                {cells(right, rowIndex)}
              </div>
            </div>
          ))}
        </SkeletonShimmer>
      </div>
    </div>
  );
};
