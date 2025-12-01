import { HorizontalResizableContainerSide } from '@/types/resizable-container';
import { mergeClasses } from '@/utils/merge-classes';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import classNames from 'classnames';
import { Resizable, type ResizableProps } from 're-resizable';
import {
  type FC,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

const ResizeIcon = ({
  side,
  className,
}: {
  side: HorizontalResizableContainerSide;
  className: string;
}) => {
  const isLeft = side === HorizontalResizableContainerSide.Left;
  const Icon = isLeft ? IconChevronLeft : IconChevronRight;

  return (
    <div className={className}>
      <Icon className={classNames('h-full', isLeft && '-ml-6')} />
    </div>
  );
};

const ResizeHandle = ({
  side,
  isResizing,
  customHandler,
  handlerClassName,
}: {
  side: HorizontalResizableContainerSide;
  isResizing: boolean;
  customHandler?: ReactNode;
  handlerClassName?: string;
}) => {
  const iconClassName = mergeClasses(
    'invisible h-full w-0.5 group-hover:visible bg-accent-primary text-accent-primary cursor-col-resize transition-opacity',
    isResizing && 'visible',
    handlerClassName,
  );

  const defaultIcon = <ResizeIcon side={side} className={iconClassName} />;

  if (customHandler) {
    return <div className={iconClassName}>{customHandler}</div>;
  }

  return defaultIcon;
};

export interface DialHorizontalResizableContainerProps {
  children: ReactNode;
  minWidth: number;
  maxWidth: number;
  width?: number;
  defaultWidth: number;
  onResizeStop?: (width: number) => void;
  onResize?: (width: number) => void;
  side?: HorizontalResizableContainerSide;
  resizeHandlerClassName?: string;
  resizeHandler?: ReactNode;
}

/**
 * DialHorizontalResizableContainer — A reusable horizontal resizable container
 * supporting both **controlled** and **uncontrolled** width modes.
 *
 * Controlled Mode
 *
 * Provide `width` and optionally `onResizeStop`:
 * ```tsx
 * <DialHorizontalResizableContainer
 *   width={sidebarWidth}
 *   onResizeStop={(w) => setSidebarWidth(w)}
 *   minWidth={180}
 *   maxWidth={520}
 * >
 *   <Sidebar />
 * </DialHorizontalResizableContainer>
 * ```
 *
 * Uncontrolled Mode
 *
 * Omit `width` entirely — the component manages its own width:
 * ```tsx
 * <DialHorizontalResizableContainer
 *   defaultWidth={260}
 *   minWidth={180}
 *   maxWidth={520}
 * >
 *   <Sidebar />
 * </DialHorizontalResizableContainer>
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
 * @param [side=HorizontalResizableContainerSide.Right] - Resize handle side.
 * @param [resizeHandlerClassName] - Optional additional CSS classes.
 * @param [resizeHandler] - Optional custom handler element.
 *
 * @remarks
 * - In uncontrolled mode, width is stored internally.
 * - `onResizeStop` is optional in both modes.
 * - Controlled mode always uses the value from `width`.
 */
export const DialHorizontalResizableContainer: FC<
  DialHorizontalResizableContainerProps
> = ({
  children,
  minWidth,
  maxWidth,
  width,
  defaultWidth,
  onResizeStop,
  onResize,
  side = HorizontalResizableContainerSide.Right,
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
    const isLeft = side === HorizontalResizableContainerSide.Left;

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
