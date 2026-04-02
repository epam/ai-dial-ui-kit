import { TagVariant } from '@/types/tag';
import { IconX } from '@tabler/icons-react';
import type { FC, MouseEvent, ReactNode } from 'react';
import { TAG_VARIANTS_CONFIG } from './constants';
import { DialButton } from '@/components/Button/Button';
import { DialIcon } from '@/components/Icon/Icon';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_ICON_SIZE } from '@/constants/icon';

export interface DialTagProps {
  tag: string;
  className?: string;
  remove?: (event: MouseEvent<HTMLButtonElement>) => void;
  variant?: TagVariant;
  iconBefore?: ReactNode;
  bordered?: boolean;
}

/**
 * A small tag component used to display labeled items such as categories, filters, or selections.
 * aliases: Badge|Chip
 *
 * Optionally supports removal via a close button and multiple colors variants defined by {@link TagVariant}.
 *
 * @example
 * ```tsx
 * <DialTag
 *   tag="React"
 *   variant={TagVariant.Default}
 *   remove={() => console.log('Tag removed')}
 * />
 * ```
 *
 * @param tag - The text label displayed inside the tag.
 * @param [className] - Optional additional CSS classes applied to the tag container.
 * @param [remove] - Optional callback invoked when the remove button is clicked.
 *                   If not provided, the remove button will not be rendered.
 * @param [variant=TagVariant.Default] - Visual style of the tag. Uses the {@link TagVariant} enum.
 * @param [iconBefore] - Optional icon or element to display before the tag text.
 * @param [bordered=true] - When true, adds a border to the tag for better visibility on light backgrounds.
 */
export const DialTag: FC<DialTagProps> = ({
  tag,
  className,
  remove,
  variant = TagVariant.Default,
  iconBefore,
  bordered = true,
}) => {
  const variantClass = TAG_VARIANTS_CONFIG[variant];

  const containerClassName = mergeClasses(
    'flex items-center gap-1 dial-tiny rounded p-1 h-[22px] text-primary',
    variantClass,
    !bordered ? 'border-transparent' : 'border',
    className,
  );

  return (
    <div key={tag} className={containerClassName}>
      <DialIcon icon={iconBefore} />
      <DialEllipsisTooltip text={tag} />
      {remove && (
        <DialButton
          className="p-0"
          iconAfter={<IconX size={DIAL_ICON_SIZE.SM} />}
          onClick={(e) => remove(e)}
        />
      )}
    </div>
  );
};
