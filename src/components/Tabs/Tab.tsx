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

export const DialTab: FC<DialTabProps> = ({
  tab,
  isActive,
  disabled,
  invalid,
  cssClass,
  isHorizontal,
  onClick,
}) => {
  let tabClassNames = classNames(
    'rounded px-3 py-2 flex flex-row gap-2 h-[32px]',
    'cursor-pointer text-sm leading-4 hover:text-accent-primary',
    isHorizontal && 'bg-layer-4',
  );

  if (disabled) {
    tabClassNames = classNames(
      tabClassNames,
      'bg-layer-1 text-secondary pointer-events-none',
    );
  } else if (isActive) {
    tabClassNames = classNames(
      tabClassNames,
      'bg-accent-primary-alpha ',
      isHorizontal
        ? 'border-b-2 border-b-accent-primary'
        : 'border-l-2 border-l-accent-primary',
    );
  } else {
    tabClassNames = classNames(tabClassNames, 'text-primary');
  }

  return (
    <button
      role="tab"
      className={twMerge(tabClassNames, cssClass)}
      onClick={() => onClick(tab.id)}
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
