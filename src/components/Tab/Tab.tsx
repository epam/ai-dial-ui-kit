import { BASE_ICON_PROPS } from '@/constants/icon';
import type { TabModel } from '@/models/tab';
import { mergeClasses } from '@/utils/merge-classes';
import { IconExclamationCircle } from '@tabler/icons-react';
import type { FC } from 'react';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';

export interface DialTabProps {
  tab: TabModel;
  active: boolean;
  disabled?: boolean;
  invalid?: boolean;
  horizontal?: boolean;
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
 * @param active - Whether the tab is currently active.
 * @param [disabled=false] - Whether the tab is disabled and non-interactive.
 * @param [invalid=false] - Whether the tab is marked as invalid, displaying an error icon.
 * @param [horizontal=false] - Whether the tab is displayed in horizontal orientation.
 * @param [cssClass] - Additional CSS classes applied to the tab element.
 * @param onClick - Callback fired when the tab is clicked. Receives the tab’s `id`.
 */
export const DialTab: FC<DialTabProps> = ({
  tab,
  active,
  disabled,
  invalid,
  cssClass,
  horizontal,
  onClick,
}) => {
  const baseClasses = mergeClasses(
    'rounded h-[32px] items-center flex flex-row border-transparent cursor-pointer dial-small leading-4 hover:text-accent-primary',
    { 'border-b-2 px-4': horizontal, 'border-l-2 px-3': !horizontal },
  );
  const tabClassNames = mergeClasses(
    baseClasses,
    {
      'bg-layer-4': horizontal,
      'bg-layer-1 text-secondary pointer-events-none': disabled,
      'bg-accent-primary-alpha text-primary': active && !disabled,
      'text-primary': !active && !disabled,
      'border-b-accent-primary': active && horizontal && !disabled,
      'border-l-accent-primary': active && !horizontal && !disabled,
    },
    cssClass,
  );

  return (
    <button
      role="tab"
      className={tabClassNames}
      onClick={() => onClick(tab.id)}
      disabled={disabled}
    >
      <DialEllipsisTooltip
        text={tab.name}
        contentClassName="max-w-[200px]"
        cssClass="max-w-[200px]"
      />
      {(invalid || tab.invalid) && (
        <div className="text-error">
          <IconExclamationCircle {...BASE_ICON_PROPS} />
        </div>
      )}
    </button>
  );
};
