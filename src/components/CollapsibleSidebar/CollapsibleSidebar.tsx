import {
  useEffect,
  useState,
  type FC,
  type ReactNode,
  type MouseEvent,
  useMemo,
} from 'react';

import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import classNames from 'classnames';
import { DialButton } from '@/components/Button/Button';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialCollapsibleSidebarProps {
  children: ReactNode;
  width?: number;
  title: string;
  titleClassName?: string;
  containerClassName?: string;
  iconSize?: number;
  additionalButtons?: ReactNode;
  iconStroke?: number;

  isOpened?: boolean;
  onToggle?: (nextOpened: boolean, e: MouseEvent<HTMLButtonElement>) => void;
}

const CLOSED_WIDTH = 48;

/**
 * A collapsible horizontal bar component that allows toggling between an expanded and collapsed state.
 * It supports customizable width, title, icons, additional buttons, and flexible styling options.
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
}) => {
  const [containerWidth, setContainerWidth] = useState(width);
  const [internalOpened, setInternalOpened] = useState(true);

  const controlled = useMemo(() => typeof isOpened === 'boolean', [isOpened]);

  const opened = controlled ? isOpened : internalOpened;

  useEffect(() => {
    if (controlled) {
      setContainerWidth(isOpened ? width : CLOSED_WIDTH);
    }
  }, [controlled, isOpened, width]);

  const titleClass = classNames([
    `transform rotate-180 [writing-mode:tb-rl] py-4 px-3`,
    opened && 'hidden',
    titleClassName,
  ]);

  const buttonClass = classNames([
    'flex flex-row gap-2 cursor-pointer text-secondary p-2 px-4',
    opened ? 'justify-end' : 'justify-center',
  ]);

  const changeVisibility = (e: MouseEvent<HTMLButtonElement>) => {
    const next = !opened;

    if (controlled) {
      setContainerWidth(next ? width : CLOSED_WIDTH);
      onToggle?.(next, e);
      return;
    }

    setContainerWidth(next ? width : CLOSED_WIDTH);
    setInternalOpened(next);
  };

  return (
    <div
      className={classNames([
        'rounded flex flex-col justify-between overflow-y-auto flex-shrink-0',
        containerClassName,
      ])}
      style={{ width: `${containerWidth}px` }}
      aria-label="collapsible-sidebar"
    >
      <div
        className={classNames([
          'flex-1 p-4 min-h-0 overflow-auto',
          !opened && 'hidden',
        ])}
      >
        {children}
      </div>
      <div className={titleClass}>{title}</div>
      <div
        className={mergeClasses('border-t border-primary h-12', buttonClass)}
      >
        {opened && additionalButtons}
        <DialButton
          className={'hover:text-accent-primary p-1'}
          onClick={changeVisibility}
          aria-label="sidebar-state"
          iconBefore={
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
