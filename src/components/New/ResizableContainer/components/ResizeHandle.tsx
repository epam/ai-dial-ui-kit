import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { FC, KeyboardEvent, ReactNode } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ResizableContainerSide } from '@/types/resizable-container';
import { mergeClasses } from '@/utils/merge-classes';

interface ResizeHandleProps {
  side: ResizableContainerSide;
  isResizing: boolean;
  width: number;
  minWidth: number;
  maxWidth: number;
  step: number;
  ariaLabel: string;
  onWidthChange: (nextWidth: number) => void;
  customHandler?: ReactNode;
  handlerClassName?: string;
}

/**
 * The draggable edge of {@link ResizableContainer}. It is a focusable
 * `separator` — the window-splitter pattern — so the panel can be resized with
 * the arrow keys as well as the pointer.
 */
export const ResizeHandle: FC<ResizeHandleProps> = ({
  side,
  isResizing,
  width,
  minWidth,
  maxWidth,
  step,
  ariaLabel,
  onWidthChange,
  customHandler,
  handlerClassName,
}) => {
  const isLeft = side === ResizableContainerSide.Left;
  const Chevron = isLeft ? IconChevronLeft : IconChevronRight;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number;

    switch (e.key) {
      // A left-side handle is the panel's left edge, so moving it left grows
      // the panel; a right-side handle works the other way round.
      case 'ArrowLeft':
        next = width + (isLeft ? step : -step);
        break;
      case 'ArrowRight':
        next = width + (isLeft ? -step : step);
        break;
      case 'Home':
        next = minWidth;
        break;
      case 'End':
        next = maxWidth;
        break;
      default:
        return;
    }

    // Arrow keys would otherwise scroll the page while the handle has focus.
    e.preventDefault();
    onWidthChange(next);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-valuenow={width}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={mergeClasses(
        'relative h-full w-0.5 cursor-col-resize bg-control-accent text-accent',
        // Faded out rather than `invisible`: a `visibility: hidden` element
        // cannot be focused, which would leave the handle keyboard-only in
        // theory and unreachable in practice.
        'opacity-0 transition-opacity motion-reduce:transition-none',
        'group-hover:opacity-100 focus-visible:opacity-100',
        'focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-focus',
        isResizing && 'opacity-100',
        handlerClassName,
      )}
    >
      {customHandler ?? (
        // The chevron sits beside the line rather than on it — the line is 2px
        // wide, so anything drawn inside it would be clipped to a sliver. It
        // points away from the panel, and takes no pointer events of its own:
        // the drag zone is the strip re-resizable puts around the line, and an
        // icon hanging outside that strip must not look draggable.
        <Chevron
          size={DIAL_ICON_SIZE.MD}
          stroke={DIAL_KIT_ICON_STROKE}
          aria-hidden="true"
          className={mergeClasses(
            'pointer-events-none absolute top-1/2 -translate-y-1/2',
            isLeft ? 'right-full' : 'left-full',
          )}
        />
      )}
    </div>
  );
};
