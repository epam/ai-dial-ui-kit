import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { mergeClasses } from '@/utils/merge-classes';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { DialIconButton } from '@/components/IconButton/IconButton';
import { ElementSize } from '@/types/size';

export interface DialCollapsibleSidebarProps {
  children: ReactNode;
  width?: number;
  title: ReactNode;
  titleClassName?: string;
  containerClassName?: string;
  iconSize?: number;
  additionalButtons?: ReactNode;
  iconStroke?: number;

  isOpened?: boolean;
  onToggle?: (nextOpened: boolean, e: MouseEvent<HTMLButtonElement>) => void;

  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
}

const CLOSED_WIDTH = 48;
const DEFAULT_MIN_WIDTH = 100;

/**
 * A collapsible horizontal bar component that allows toggling between an expanded and collapsed state.
 * It supports customizable width, title, icons, additional buttons, and flexible styling options.
 * When `resizable` is enabled, the sidebar edge can be dragged with the mouse to change its width.
 *
 * @example
 * ```tsx
 * <DialCollapsibleSidebar
 *   width={300}
 *   title="Menu"
 *   titleClassName="text-primary font-bold"
 *   containerClassName="bg-gray-100 shadow-md"
 *   iconSize={24}
 *   additionalButtons={<button>Extra</button>}
 *   resizable
 *   minWidth={200}
 *   maxWidth={600}
 * >
 *   <div>Content goes here</div>
 * </DialCollapsibleSidebar>
 * ```
 *
 * @param children - The content to display inside the collapsible bar when expanded
 * @param [width = 280] - The width of the bar when expanded
 * @param title - The title displayed when the bar is collapsed
 * @param [titleClassName] - Additional CSS classes applied to the title element
 * @param [containerClassName] - Additional CSS classes applied to the container element
 * @param [iconSize = 32] - The size of the toggle icons. Defaults to 32
 * @param [iconStroke = 1.5] - The stroke width of the toggle icons. Defaults to 1.5
 * @param [additionalButtons] - Additional buttons or elements displayed next to the toggle button when expanded
 * @param [isOpened] - When provided, the component becomes controlled by this value
 * @param [onToggle] - Fired when user clicks the toggle in controlled mode, with the next state
 * @param [resizable = false] - When true, allows resizing the sidebar width by dragging the edge
 * @param [minWidth = 100] - Minimum width when resizing (in px)
 * @param [maxWidth] - Maximum width when resizing (in px). Defaults to no limit
 */
export const DialCollapsibleSidebar: FC<DialCollapsibleSidebarProps> = ({
  containerClassName,
  children,
  width = 280,
  title,
  iconSize = 24,
  iconStroke = 1.5,
  titleClassName,
  additionalButtons,
  isOpened,
  onToggle,
  resizable = false,
  minWidth = DEFAULT_MIN_WIDTH,
  maxWidth,
}) => {
  const [containerWidth, setContainerWidth] = useState(width);
  const [internalOpened, setInternalOpened] = useState(true);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const resizedWidthRef = useRef(width);

  const controlled = useMemo(() => typeof isOpened === 'boolean', [isOpened]);

  const opened = controlled ? isOpened : internalOpened;

  useEffect(() => {
    if (controlled) {
      setContainerWidth(isOpened ? resizedWidthRef.current : CLOSED_WIDTH);
    }
  }, [controlled, isOpened]);

  const clampWidth = useCallback(
    (w: number) => {
      let clamped = Math.max(w, minWidth);
      if (maxWidth !== undefined) {
        clamped = Math.min(clamped, maxWidth);
      }
      return Math.round(clamped);
    },
    [minWidth, maxWidth],
  );

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = clampWidth(startWidthRef.current + delta);
      setContainerWidth(newWidth);
      resizedWidthRef.current = newWidth;
    },
    [clampWidth],
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!opened || !resizable) return;

      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = containerWidth;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [opened, resizable, containerWidth, handleMouseMove, handleMouseUp],
  );

  const titleClass = mergeClasses([
    `transform rotate-180 [writing-mode:tb-rl] py-4 px-3`,
    opened && 'hidden',
    titleClassName,
  ]);

  const buttonClass = mergeClasses([
    'flex flex-row gap-2 cursor-pointer text-secondary py-2 items-center',
    opened ? 'justify-end px-4' : 'justify-center',
  ]);

  const changeVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    const next = !opened;

    if (controlled) {
      setContainerWidth(next ? resizedWidthRef.current : CLOSED_WIDTH);
      onToggle?.(next, e);
      return;
    }

    setContainerWidth(next ? resizedWidthRef.current : CLOSED_WIDTH);
    setInternalOpened(next);
  };

  const resizeHandle = resizable && opened && (
    <div
      role="separator"
      onMouseDown={handleMouseDown}
      className={mergeClasses([
        'absolute top-0 bottom-0 right-0 w-1 cursor-col-resize transition-colors hover:bg-accent-primary z-10',
        isResizing && 'bg-accent-primary',
      ])}
    />
  );

  return (
    <div
      ref={containerRef}
      className={mergeClasses([
        'rounded flex flex-col justify-between relative',
        containerClassName,
      ])}
      style={{ width: `${containerWidth}px` }}
      aria-label="collapsible-sidebar"
    >
      {resizeHandle}
      <div
        className={mergeClasses([
          'flex-1 p-4 min-h-0 overflow-auto',
          !opened && 'hidden',
        ])}
      >
        {children}
      </div>
      <div className={titleClass}>{title}</div>
      <div
        className={mergeClasses('border-t border-tertiary h-12', buttonClass)}
      >
        {opened && additionalButtons}
        <DialIconButton
          className="hover:text-accent-primary"
          onClick={changeVisibility}
          aria-label="sidebar-state"
          size={ElementSize.Small}
          icon={
            opened ? (
              <IconChevronsLeft size={iconSize} stroke={iconStroke} />
            ) : (
              <IconChevronsRight size={iconSize} stroke={iconStroke} />
            )
          }
        />
      </div>
    </div>
  );
};
