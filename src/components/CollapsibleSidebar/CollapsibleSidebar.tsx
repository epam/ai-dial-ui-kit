import { useState, type FC, type ReactNode } from 'react';

import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import classNames from 'classnames';
import { BASE_ICON_PROPS, BASE_ICON_SIZE } from '@/constants/icon';
import { DialButton } from '@/components/Button/Button';

export interface DialCollapsibleSidebarProps {
  children: ReactNode;
  width: number;
  title: string;
  titleCssClass?: string;
  containerCssClass?: string;
  iconSize?: number;
  additionalButtons?: ReactNode;
}

const CLOSED_WIDTH = 60;

/**
 * A collapsible horizontal bar component that allows toggling between an expanded and collapsed state.
 * It supports customizable width, title, icons, additional buttons, and flexible styling options.
 *
 * @example
 * ```tsx
 * <DialCollapsibleSidebar
 *   width={300}
 *   title="Menu"
 *   titleCssClass="text-primary font-bold"
 *   containerCssClass="bg-gray-100 shadow-md"
 *   iconSize={24}
 *   additionalButtons={<button>Extra</button>}
 * >
 *   <div>Content goes here</div>
 * </DialCollapsibleSidebar>
 * ```
 *
 * @param children - The content to display inside the collapsible bar when expanded
 * @param width - The width of the bar when expanded
 * @param title - The title displayed when the bar is collapsed
 * @param [titleCssClass] - Additional CSS classes applied to the title element
 * @param [containerCssClass] - Additional CSS classes applied to the container element
 * @param [iconSize] - The size of the toggle icons. Defaults to {@link BASE_ICON_SIZE}
 * @param [additionalButtons] - Additional buttons or elements displayed next to the toggle button when expanded
 */
export const DialCollapsibleSidebar: FC<DialCollapsibleSidebarProps> = ({
  containerCssClass,
  children,
  width,
  title,
  iconSize = BASE_ICON_SIZE,
  titleCssClass,
  additionalButtons,
}) => {
  const [containerWidth, setContainerWidth] = useState(width);
  const [isOpened, setIsOpened] = useState(true);

  const titleClass = classNames([
    `transform rotate-180 [writing-mode:tb-rl]`,
    isOpened && 'hidden',
    titleCssClass,
  ]);

  const buttonClass = classNames([
    'flex flex-row gap-2 cursor-pointer text-secondary',
    isOpened ? 'justify-end' : 'justify-center',
  ]);

  const changeVisibility = () => {
    setContainerWidth(isOpened ? CLOSED_WIDTH : width);
    setIsOpened(!isOpened);
  };

  return (
    <div
      className={classNames([
        'rounded p-4 flex flex-col justify-between overflow-y-auto flex-shrink-0',
        containerCssClass,
      ])}
      style={{ width: `${containerWidth}px` }}
    >
      <div
        className={classNames([
          'flex-1 min-h-0 overflow-auto',
          !isOpened && 'hidden',
        ])}
      >
        {children}
      </div>
      <div className={titleClass}>{title}</div>
      <div className={buttonClass}>
        {isOpened && additionalButtons}
        <DialButton
          cssClass={'hover:text-icon-accent-primary'}
          onClick={changeVisibility}
          iconBefore={
            isOpened ? (
              <IconChevronsLeft
                size={iconSize}
                stroke={BASE_ICON_PROPS.stroke}
              />
            ) : (
              <IconChevronsRight
                size={iconSize}
                stroke={BASE_ICON_PROPS.stroke}
              />
            )
          }
        />
      </div>
    </div>
  );
};
