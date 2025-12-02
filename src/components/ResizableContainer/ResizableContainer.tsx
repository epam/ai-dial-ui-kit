import { ResizableContainerSide } from '@/types/resizable-container';
import { Resizable, type ResizableProps } from 're-resizable';
import {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ResizeHandle } from './components/ResizeHandle';

export interface DialResizableContainerProps {
  children: ReactNode;
  minWidth: number;
  maxWidth: number;
  width?: number;
  defaultWidth: number;
  onResizeStop?: (width: number) => void;
  onResize?: (width: number) => void;
  side?: ResizableContainerSide;
  resizeHandlerClassName?: string;
  resizeHandler?: ReactNode;
}

/**
 * DialResizableContainer — A reusable resizable container
 * supporting both **controlled** and **uncontrolled** width modes.
 *
 * Controlled Mode
 *
 * Provide `width` and optionally `onResizeStop`:
 * ```tsx
 * <DialResizableContainer
 *   width={sidebarWidth}
 *   onResizeStop={(w) => setSidebarWidth(w)}
 *   minWidth={180}
 *   maxWidth={520}
 * >
 *   <Sidebar />
 * </DialResizableContainer>
 * ```
 *
 * Uncontrolled Mode
 *
 * Omit `width` entirely — the component manages its own width:
 * ```tsx
 * <DialResizableContainer
 *   defaultWidth={260}
 *   minWidth={180}
 *   maxWidth={520}
 * >
 *   <Sidebar />
 * </DialResizableContainer>
 * ```
 *
 * Features:
 * - Resize from left or right
 * - Fully supports controlled & uncontrolled sizing
 * - Custom resize handler (icon or any ReactNode)
 * - Callback when resize stops (optional)
 * - Smooth hover/drag visibility transitions
 *
 * @param [children] - Content placed inside the container.
 * @param [minWidth] - Minimum allowed width (px).
 * @param [maxWidth] - Maximum allowed width (px).
 * @param [width] - Controlled width. If omitted → uncontrolled mode.
 * @param [defaultWidth] - Initial width in uncontrolled mode.
 * @param [onResizeStop] - Optional callback fired when resize ends.
 * @param [onResize] - Optional callback fired continuously during resizing with current width.
 * @param [side=ResizableContainerSide.Right] - Resize handle side.
 * @param [resizeHandlerClassName] - Optional additional CSS classes.
 * @param [resizeHandler] - Optional custom handler element.
 *
 * @remarks
 * - In uncontrolled mode, width is stored internally.
 * - `onResizeStop` is optional in both modes.
 * - Controlled mode always uses the value from `width`.
 */
export const DialResizableContainer: FC<DialResizableContainerProps> = ({
  children,
  minWidth,
  maxWidth,
  width,
  defaultWidth,
  onResizeStop,
  onResize,
  side = ResizableContainerSide.Right,
  resizeHandlerClassName,
  resizeHandler,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [internalWidth, setInternalWidth] = useState(defaultWidth);

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

  const resizeSettings: ResizableProps = useMemo(() => {
    const isLeft = side === ResizableContainerSide.Left;

    const handleComponent = (
      <ResizeHandle
        side={side}
        isResizing={isResizing}
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
        right: { right: '-11px' },
        left: { left: '-3px' },
      },
      handleComponent: {
        left: isLeft ? handleComponent : undefined,
        right: !isLeft ? handleComponent : undefined,
      },
      onResizeStart: resizeStartHandler,
      onResize: (_e, _dir, ref) => {
        const w = Math.round(ref.offsetWidth);
        onResize?.(w);
      },
      onResizeStop: resizeStopHandler,
    };
  }, [
    side,
    isControlled,
    effectiveWidth,
    minWidth,
    maxWidth,
    resizeHandler,
    resizeHandlerClassName,
    isResizing,
    resizeStartHandler,
    resizeStopHandler,
    onResize,
  ]);

  return (
    <Resizable ref={resizableRef} {...resizeSettings}>
      <div className="group flex size-full flex-col bg-layer-3 divide-y divide-tertiary transition-all">
        {children}
      </div>
    </Resizable>
  );
};
