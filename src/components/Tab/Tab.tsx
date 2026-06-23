import {
  IconAlertTriangle,
  IconCheck,
  IconExclamationCircle,
} from '@tabler/icons-react';
import type { ButtonHTMLAttributes, FC } from 'react';

import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { BASE_ICON_PROPS, DIAL_ICON_SIZE } from '@/constants/icon';
import type { TabModel } from '@/models/tab';
import { TabView } from '@/types/tab';
import { mergeClasses } from '@/utils/merge-classes';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'children' | 'type' | 'role' | 'disabled'
>;

export interface DialTabProps extends NativeButtonProps {
  tab: TabModel;
  active: boolean;
  invalid?: boolean;
  horizontal?: boolean;
  view?: TabView;
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
 * @param tab - The tab model containing its `id`, `name`, [`disabled`], [`invalid`], [`warning`].
 * @param active - Whether the tab is currently active.
 * @param [horizontal=false] - Whether the tab is displayed in horizontal orientation.
 * @param [view=TabView.Default] - Visual style of the tab. Uses the {@link TabView} enum.
 *   `Inline` renders a compact pill with a leading check icon when active.
 * @param onClick - Callback fired when the tab is clicked. Receives the tab’s `id`.
 */
export const DialTab: FC<DialTabProps> = ({
  tab,
  active,
  invalid,
  className,
  horizontal,
  view = TabView.Default,
  onClick,
}) => {
  const isInline = view === TabView.Inline;

  const defaultClassName = mergeClasses(
    'rounded h-[38px] items-center flex flex-row border-transparent cursor-pointer dial-small-text hover:text-accent-primary',
    { 'border-b-2 px-4': horizontal, 'border-l-2 px-3': !horizontal },
    {
      'bg-layer-4': horizontal,
      'bg-layer-1 text-secondary pointer-events-none': tab.disabled,
      'bg-accent-primary-alpha text-primary': active && !tab.disabled,
      'text-primary': !active && !tab.disabled,
      'border-b-accent-primary': active && horizontal && !tab.disabled,
      'border-l-accent-primary': active && !horizontal && !tab.disabled,
    },
  );

  const inlineClassName = mergeClasses(
    'flex flex-row gap-1 h-6 items-center py-1 px-2 rounded cursor-pointer hover:bg-accent-primary-alpha',
    active ? 'dial-small-semi' : 'dial-small',
    {
      'text-secondary pointer-events-none': tab.disabled,
      'bg-accent-primary-alpha text-primary': active && !tab.disabled,
      'text-secondary': !active && !tab.disabled,
    },
  );

  const tabClassName = mergeClasses(
    isInline ? inlineClassName : defaultClassName,
    className,
  );

  return (
    <button
      role="tab"
      className={tabClassName}
      onClick={() => onClick(tab.id)}
      disabled={tab.disabled}
    >
      {isInline && active && !tab.disabled && (
        <IconCheck size={DIAL_ICON_SIZE.SM} />
      )}
      <DialEllipsisTooltip
        text={tab.label}
        contentClassName="max-w-[200px]"
        className="max-w-[200px]"
      />

      {(invalid || tab.invalid) && (
        <div className="text-error pl-1">
          <IconExclamationCircle {...BASE_ICON_PROPS} />
        </div>
      )}
      {tab.warning && (
        <div className="text-warning pl-1">
          <IconAlertTriangle {...BASE_ICON_PROPS} />
        </div>
      )}
    </button>
  );
};
