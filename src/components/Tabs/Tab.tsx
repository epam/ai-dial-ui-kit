import { BASE_ICON_PROPS } from '@/constants/icon';
import type { TabModel } from '@/models/tab';
import { IconExclamationCircle } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface DialTabProps {
  tab: TabModel;
  isActive: boolean;
  disabled?: boolean;
  invalid?: boolean;
  isHorizontal?: boolean;
  cssClass?: string;
  onClick: (id: string) => void;
}

/**
 * A single tab element used within the {@link DialTabs} component.
 * Supports active, disabled, and invalid states, and can render in
 * horizontal or vertical orientations. Displays an optional error icon
 * when marked as invalid.
 *
 * @example
 * ```tsx
 * <DialTab
 *   tab={{ id: 'overview', name: 'Overview' }}
 *   isActive={true}
 *   onClick={(id) => console.log('Selected tab:', id)}
 * />
 * ```
 *
 * @param tab - The tab model containing its `id` and `name`.
 * @param isActive - Whether the tab is currently active.
 * @param [disabled=false] - Whether the tab is disabled and non-interactive.
 * @param [invalid=false] - Whether the tab is marked as invalid, displaying an error icon.
 * @param [isHorizontal=false] - Whether the tab is displayed in horizontal orientation.
 * @param [cssClass] - Additional CSS classes applied to the tab element.
 * @param onClick - Callback fired when the tab is clicked. Receives the tab’s `id`.
 */
export const DialTab: FC<DialTabProps> = ({
  tab,
  isActive,
  disabled,
  invalid,
  cssClass,
  isHorizontal,
  onClick,
}) => {
  const baseClasses =
    'rounded px-3 py-2 flex flex-row gap-2 h-[32px] cursor-pointer text-sm leading-4 hover:text-accent-primary';

  const tabClassNames = twMerge(
    classNames(
      baseClasses,
      {
        'bg-layer-4': isHorizontal,
        'bg-layer-1 text-secondary pointer-events-none': disabled,
        'bg-accent-primary-alpha text-primary': isActive && !disabled,
        'text-primary': !isActive && !disabled,
        'border-b-2 border-b-accent-primary':
          isActive && isHorizontal && !disabled,
        'border-l-2 border-l-accent-primary':
          isActive && !isHorizontal && !disabled,
      },
      cssClass,
    ),
  );

  return (
    <button
      role="tab"
      className={tabClassNames}
      onClick={() => onClick(tab.id)}
      disabled={disabled}
    >
      <span>{tab.name}</span>
      {invalid && (
        <div className="text-error">
          <IconExclamationCircle {...BASE_ICON_PROPS} />
        </div>
      )}
    </button>
  );
};
