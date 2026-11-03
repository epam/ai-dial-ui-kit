import type {
  IOverlayParams,
  OverlaySelectorFunc,
  OverlayType,
} from 'ag-grid-community';

import {
  NoDataContent,
  type NoDataContentProps,
} from '@/components/New/NoDataContent/NoDataContent';

/** What the grid shows for each of its two empty states. */
export interface GridEmptyStateParams {
  /** The grid has no rows at all. */
  empty: NoDataContentProps;
  /** The grid has rows, but its column filters leave none of them. */
  filtered: NoDataContentProps;
}

export type GridEmptyStateProps = IOverlayParams & GridEmptyStateParams;

const EMPTY_OVERLAY_TYPES: OverlayType[] = ['noRows', 'noMatchingRows'];

/**
 * The grid's no-rows and no-matching-rows overlays, both drawn with
 * {@link NoDataContent} so an empty grid looks like every other empty list.
 */
export const GridEmptyState = ({
  overlayType,
  empty,
  filtered,
}: GridEmptyStateProps) => (
  <NoDataContent {...(overlayType === 'noMatchingRows' ? filtered : empty)} />
);

/**
 * Hands the two empty overlays to {@link GridEmptyState} and leaves the rest —
 * loading, exporting — to ag-Grid. The selector is read once, so what the
 * overlay shows travels in `overlayComponentParams`, which ag-Grid refreshes.
 */
export const selectGridEmptyStateOverlay: OverlaySelectorFunc = ({
  overlayType,
}) =>
  EMPTY_OVERLAY_TYPES.includes(overlayType)
    ? { component: GridEmptyState }
    : undefined;
