import { DialButton } from '@/components/Button/Button';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { DialIcon } from '@/components/Icon/Icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { IconX } from '@tabler/icons-react';
import type { FC, MouseEvent, ReactNode } from 'react';

/**
 * Props for the `DialTag` component.
 */
export interface DialTagProps {
  /** Text content displayed inside the tag. */
  label: string;
  /** Additional CSS classes applied to the root container. */
  className?: string;
  /** Applies selected visual styles when `true`. */
  selected?: boolean;

  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /** Enables rendering of the remove button. */
  closable?: boolean;

  /** Fired when the tag container is clicked. */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  /** Fired when the remove button is clicked. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A compact label element used for selections, filters, or categories.
 */
export const DialTag: FC<DialTagProps> = ({
  label,
  className,
  icon,
  selected,
  closable,
  onClick,
  onRemove,
}) => {
  const containerClassName = mergeClasses(
    'flex items-center gap-1 cursor-pointer dial-tiny-text px-2 h-[24px] border text-primary rounded-[8px]',
    selected
      ? 'hover:bg-controls-accent-primary-alpha-active bg-accent-primary-alpha border-accent-primary'
      : 'bg-neutral border-primary',
    className,
  );

  return (
    <div key={label} className={containerClassName} onClick={onClick}>
      <DialIcon icon={icon} />
      <DialEllipsisTooltip text={label} />
      {closable && onRemove && (
        <DialButton
          className="p-0"
          iconAfter={<IconX size={DIAL_ICON_SIZE.SM} />}
          onClick={(e) => onRemove(e)}
        />
      )}
    </div>
  );
};
