import { IconArrowsHorizontal } from '@tabler/icons-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { Tooltip } from '@/components/New/Tooltip/Tooltip';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { TooltipPlacement } from '@/types/tooltip';
import { mergeClasses } from '@/utils/merge-classes';

/** Width change of one arrow key press, in px. */
const DEFAULT_KEYBOARD_STEP = 16;
/** How long the pointer has to rest on the handle before the line and tooltip appear, in ms. */
const REST_DELAY_MS = 1000;
/** How far the pointer may drift and still count as resting, in px. */
const REST_TOLERANCE_PX = 4;

/** Props for `ResizeHandle`. */
export interface ResizeHandleProps {
  /** Current width of the panel the handle resizes, in px. */
  width: number;
  /** Smallest width the handle can set, in px. */
  minWidth: number;
  /** Largest width the handle can set, in px. */
  maxWidth: number;
  /** Width a double click resets the panel to, in px. Without it a double click does nothing. */
  defaultWidth?: number;
  /** Called with the next width, already limited to `minWidth`–`maxWidth`. */
  onWidthChange: (width: number) => void;
  /** Accessible name of the separator. */
  label: string;
  /** Hint shown beside the pointer once it rests on the handle. */
  tooltip?: ReactNode;
  /** Width change of one arrow key press, in px. Defaults to `16`. */
  keyboardStep?: number;
  /** Additional CSS classes for the handle, e.g. to change its position. */
  className?: string;
}

const isRtl = (element: HTMLElement | null): boolean => {
  if (element == null) {
    return false;
  }
  const direction =
    element.closest('[dir]')?.getAttribute('dir') ??
    element.ownerDocument.defaultView?.getComputedStyle(element).direction;

  return direction === 'rtl';
};

/**
 * A vertical separator on the inline-end edge of a panel that resizes the panel
 * by pointer or keyboard.
 * aliases: Splitter|ColumnResizer|DragHandle|Divider
 * Design system 2.0
 *
 * The component is controlled: it reports every width through `onWidthChange`
 * and the host applies it to the panel. It is a focusable `separator` — the
 * window-splitter pattern — so the arrow keys move it by `keyboardStep`, `Home`
 * and `End` jump to the bounds, and a double click resets it to `defaultWidth`.
 * Drag and keys follow the writing direction, so a panel at the inline start
 * grows as the pointer moves towards the inline end, in RTL as well.
 *
 * It is positioned absolutely against its nearest positioned ancestor, over the
 * panel's inline-end edge, and draws a thin line. The accent line and the hint
 * appear once the pointer has rested on the handle, and a themed arrow follows
 * the pointer instead of the native cursor. Hide it on screens too narrow to
 * drag on by wrapping it, e.g. in `hidden desktop:block`.
 *
 * @example
 * ```tsx
 * <div className="relative" style={{ width }}>
 *   <Sidebar />
 *   <ResizeHandle
 *     width={width}
 *     minWidth={280}
 *     maxWidth={640}
 *     defaultWidth={400}
 *     onWidthChange={setWidth}
 *     label="Resize sidebar"
 *     tooltip="Drag to resize"
 *   />
 * </div>
 * ```
 *
 * @param width - Current width of the panel in px.
 * @param minWidth - Smallest width in px.
 * @param maxWidth - Largest width in px.
 * @param [defaultWidth] - Width a double click resets to.
 * @param onWidthChange - Called with the next, limited width.
 * @param label - Accessible name of the separator.
 * @param [tooltip] - Hint shown beside the pointer once it rests on the handle.
 * @param [keyboardStep=16] - Width change of one arrow key press in px.
 * @param [className] - Additional CSS classes for the handle.
 */
export const ResizeHandle: FC<ResizeHandleProps> = ({
  width,
  minWidth,
  maxWidth,
  defaultWidth,
  onWidthChange,
  label,
  tooltip,
  keyboardStep = DEFAULT_KEYBOARD_STEP,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHoverReady, setIsHoverReady] = useState(false);
  const [isCursorReady, setIsCursorReady] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const restPoint = useRef({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; width: number } | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const frame = useRef<number>(undefined);

  useEffect(
    () => () => {
      clearTimeout(hoverTimer.current);
      if (frame.current != null) {
        cancelAnimationFrame(frame.current);
      }
    },
    [],
  );

  const clamp = useCallback(
    (value: number) => {
      const finite = Number.isFinite(value) ? value : minWidth;

      return Math.round(Math.min(maxWidth, Math.max(minWidth, finite)));
    },
    [maxWidth, minWidth],
  );

  /* The arrow replaces the native cursor only once it sits under the pointer, so no frame has neither. */
  const moveCursor = (event: PointerEvent<HTMLDivElement>) => {
    cursorRef.current?.style.setProperty(
      'transform',
      `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`,
    );
    setIsCursorReady(true);
  };

  /* The line and hint appear once the pointer has rested, so they restart whenever it moves away. */
  const startRestTimer = (event: PointerEvent<HTMLDivElement>) => {
    restPoint.current = { x: event.clientX, y: event.clientY };
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsHoverReady(true), REST_DELAY_MS);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    moveCursor(event);
    startRestTimer(event);
  };

  const handlePointerLeave = () => {
    setIsCursorReady(false);
    clearTimeout(hoverTimer.current);
    setIsHoverReady(false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, width };
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    moveCursor(event);
    const start = dragStart.current;
    if (start == null) {
      const moved =
        Math.hypot(
          event.clientX - restPoint.current.x,
          event.clientY - restPoint.current.y,
        ) > REST_TOLERANCE_PX;
      if (moved) {
        setIsHoverReady(false);
        startRestTimer(event);
      }

      return;
    }
    const direction = isRtl(handleRef.current) ? -1 : 1;
    const next = clamp(start.width + (event.clientX - start.x) * direction);
    if (frame.current != null) {
      cancelAnimationFrame(frame.current);
    }
    frame.current = requestAnimationFrame(() => onWidthChange(next));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current == null) {
      return;
    }
    dragStart.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction = isRtl(handleRef.current) ? -1 : 1;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
        next = width + keyboardStep * direction;
        break;
      case 'ArrowLeft':
        next = width - keyboardStep * direction;
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
    /* Arrow keys would otherwise scroll the page while the handle has focus. */
    event.preventDefault();
    onWidthChange(clamp(next));
  };

  const handleDoubleClick = () => {
    if (defaultWidth != null) {
      onWidthChange(clamp(defaultWidth));
    }
  };

  return (
    /* A focusable separator is the ARIA window-splitter widget, so it is interactive. */
    <div
      ref={handleRef}
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={width}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      tabIndex={0}
      className={mergeClasses(
        'absolute inset-y-0 end-0 -me-1 w-2 touch-none select-none',
        'dial-resize-handle',
        isCursorReady && 'dial-resize-handle-cursor-ready',
        isHoverReady && 'dial-resize-handle-hover',
        isDragging && 'dial-resize-handle-dragging',
        className,
        DIAL_KIT_CLASS.resizeHandle,
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drawn instead of a CSS cursor image, which cannot read theme tokens. */}
      <Tooltip
        tooltip={tooltip}
        open={isHoverReady && !isDragging}
        placement={
          isRtl(handleRef.current)
            ? TooltipPlacement.Left
            : TooltipPlacement.Right
        }
        asChild
      >
        <span
          ref={cursorRef}
          aria-hidden="true"
          className={mergeClasses(
            'pointer-events-none fixed start-0 top-0 z-tooltip hidden text-secondary',
            'dial-resize-handle-arrow',
          )}
        >
          <IconArrowsHorizontal
            size={DIAL_ICON_SIZE.LG}
            stroke={DIAL_KIT_ICON_STROKE}
          />
        </span>
      </Tooltip>
    </div>
  );
};
