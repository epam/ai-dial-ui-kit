import { Resizable, type ResizableProps } from 're-resizable';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';

import { ResizableContainerSide } from '@/types/resizable-container';
import { mergeClasses } from '@/utils/merge-classes';

import { ResizeHandle } from './components/ResizeHandle';

/** Width change per arrow key press while the handle has keyboard focus. */
const DEFAULT_KEYBOARD_STEP = 16;

export interface ResizableContainerProps {
  /** Content placed inside the container. */
  children: ReactNode;
  /** Minimum allowed width in px. */
  minWidth: number;
  /** Maximum allowed width in px. */
  maxWidth: number;
  /** Controlled width in px. When provided, the component becomes controlled. */
  width?: number;
  /** Initial width when uncontrolled. Defaults to `minWidth`. */
  defaultWidth?: number;
  /** Fired when a resize ends, and once per arrow key press. */
  onResizeStop?: (width: number) => void;
  /** Fired continuously while dragging, with the current width. */
  onResize?: (width: number) => void;
  /** Edge carrying the resize handle. Defaults to `ResizableContainerSide.Right`. */
  side?: ResizableContainerSide;
  /** Width change per arrow key press. Defaults to `16`. */
  keyboardStep?: number;
  /** Accessible name of the handle. Defaults to `'Resize panel'`. */
  ariaLabel?: string;
  /** Additional CSS classes for the inner content wrapper. */
  className?: string;
  /** Additional CSS classes for the resize handle. */
  resizeHandlerClassName?: string;
  /** Custom node rendered inside the handle. */
  resizeHandler?: ReactNode;
}

/**
 * A panel the user can widen or narrow by dragging its edge.
 * aliases: ResizePanel|SizableContainer|Splitter
 * Design system 2.0
 *
 * Works as a controlled component when `width` is provided, otherwise it keeps
 * its own width from `defaultWidth`. The handle appears on hover and while
 * dragging, and stays within `minWidth`–`maxWidth` in both modes.
 *
 * The handle is a focusable `separator`, so the panel resizes with the arrow
 * keys — `Home` and `End` jump to the bounds — and each press reports through
 * `onResize` and `onResizeStop`. Unlike the 1.0 container this one draws no
 * dividers between its children; pass `divide-y divide-tertiary` through
 * `className` if you want them.
 *
 * @example
 * ```tsx
 * <ResizableContainer minWidth={180} maxWidth={520} defaultWidth={260}>
 *   <Sidebar />
 * </ResizableContainer>
 *
 * <ResizableContainer
 *   minWidth={180}
 *   maxWidth={520}
 *   width={sidebarWidth}
 *   onResizeStop={setSidebarWidth}
 * >
 *   <Sidebar />
 * </ResizableContainer>
 * ```
 *
 * @param children - Content placed inside the container.
 * @param minWidth - Minimum allowed width in px.
 * @param maxWidth - Maximum allowed width in px.
 * @param [width] - Controlled width. If omitted the container is uncontrolled.
 * @param [defaultWidth] - Initial width when uncontrolled. Defaults to `minWidth`.
 * @param [onResizeStop] - Fired when a resize ends, and once per arrow key press.
 * @param [onResize] - Fired continuously while dragging.
 * @param [side=ResizableContainerSide.Right] - Edge carrying the resize handle.
 * @param [keyboardStep=16] - Width change per arrow key press.
 * @param [ariaLabel='Resize panel'] - Accessible name of the handle.
 * @param [className] - Additional CSS classes for the inner content wrapper.
 * @param [resizeHandlerClassName] - Additional CSS classes for the resize handle.
 * @param [resizeHandler] - Custom node rendered inside the handle.
 */
export const ResizableContainer: FC<ResizableContainerProps> = ({
  children,
  minWidth,
  maxWidth,
  width,
  defaultWidth,
  onResizeStop,
  onResize,
  side = ResizableContainerSide.Right,
  keyboardStep = DEFAULT_KEYBOARD_STEP,
  ariaLabel = 'Resize panel',
  className,
  resizeHandlerClassName,
  resizeHandler,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [internalWidth, setInternalWidth] = useState(defaultWidth ?? minWidth);

  const isControlled = width !== undefined;
  const effectiveWidth = isControlled ? width : internalWidth;

  const resizableRef = useRef<Resizable>(null);

  const resizeStartHandler = useCallback(() => {
    setIsResizing(true);
  }, []);

  const resizeStopHandler = useCallback(() => {
    setIsResizing(false);

    const rect = resizableRef.current?.resizable?.getBoundingClientRect();
    const finalWidth = rect ? Math.round(rect.width) : minWidth;

    if (!isControlled) {
      setInternalWidth(finalWidth);
    }

    onResizeStop?.(finalWidth);
  }, [onResizeStop, isControlled, minWidth]);

  /**
   * Keyboard resizing has no drag to end, so one press is both the move and the
   * commit: it reports through `onResize` and `onResizeStop` at once.
   */
  const keyboardResizeHandler = useCallback(
    (nextWidth: number) => {
      const clamped = Math.min(maxWidth, Math.max(minWidth, nextWidth));

      if (clamped === effectiveWidth) return;

      if (!isControlled) {
        setInternalWidth(clamped);
        // `defaultSize` only seeds the first render — in uncontrolled mode
        // re-resizable owns the rendered size, so the new width has to be
        // pushed into it or the panel would not move.
        resizableRef.current?.updateSize({ width: clamped, height: '100%' });
      }

      onResize?.(clamped);
      onResizeStop?.(clamped);
    },
    [maxWidth, minWidth, effectiveWidth, isControlled, onResize, onResizeStop],
  );

  const resizeSettings: ResizableProps = useMemo(() => {
    const isLeft = side === ResizableContainerSide.Left;

    const handleComponent = (
      <ResizeHandle
        side={side}
        isResizing={isResizing}
        width={effectiveWidth}
        minWidth={minWidth}
        maxWidth={maxWidth}
        step={keyboardStep}
        ariaLabel={ariaLabel}
        onWidthChange={keyboardResizeHandler}
        customHandler={resizeHandler}
        handlerClassName={resizeHandlerClassName}
      />
    );

    return {
      size: isControlled
        ? { width: effectiveWidth, height: '100%' }
        : undefined,
      defaultSize: isControlled
        ? undefined
        : { width: effectiveWidth, height: '100%' },
      minWidth,
      maxWidth,
      enable: {
        left: isLeft,
        right: !isLeft,
      },
      handleClasses: {
        right: 'group',
        left: 'group',
      },
      handleStyles: {
        right: { right: '-8px', zIndex: 10 },
        left: { left: 0, zIndex: 10 },
      },
      handleComponent: {
        left: isLeft ? handleComponent : undefined,
        right: !isLeft ? handleComponent : undefined,
      },
      onResizeStart: resizeStartHandler,
      onResize: (_e, _dir, ref) => {
        onResize?.(Math.round(ref.offsetWidth));
      },
      onResizeStop: resizeStopHandler,
    };
  }, [
    side,
    isControlled,
    effectiveWidth,
    minWidth,
    maxWidth,
    keyboardStep,
    ariaLabel,
    keyboardResizeHandler,
    resizeHandler,
    resizeHandlerClassName,
    isResizing,
    resizeStartHandler,
    resizeStopHandler,
    onResize,
  ]);

  return (
    <Resizable ref={resizableRef} {...resizeSettings}>
      <div
        className={mergeClasses(
          'group flex size-full flex-col bg-layer-raised transition-all motion-reduce:transition-none',
          className,
        )}
      >
        {children}
      </div>
    </Resizable>
  );
};
