import { TagVariant } from '@/types/tag';
import { IconX } from '@tabler/icons-react';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { TAG_VARIANTS_CONFIG } from './constants';
import { DialButton } from '@/components/Button/Button';
import { DialIcon } from '@/components/Icon/Icon';
import { DialEllipsisTooltip } from '../EllipsisTooltip/EllipsisTooltip';

export interface DialTagProps {
  tag: string;
  cssClass?: string;
  remove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: TagVariant;
  iconBefore?: ReactNode;
  bordered?: boolean;
}

/**
 * A small tag component used to display labeled items such as categories, filters, or selections.
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
 * @param [cssClass] - Optional additional CSS classes applied to the tag container.
 * @param [remove] - Optional callback invoked when the remove button is clicked.
 *                   If not provided, the remove button will not be rendered.
 * @param [variant=TagVariant.Default] - Visual style of the tag. Uses the {@link TagVariant} enum.
 * @param [iconBefore] - Optional icon or element to display before the tag text.
 * @param [bordered=true] - When true, adds a border to the tag for better visibility on light backgrounds.
 */
export const DialTag: FC<DialTagProps> = ({
  tag,
  cssClass,
  remove,
  variant = TagVariant.Default,
  iconBefore,
  bordered = true,
}) => {
  const variantClass = TAG_VARIANTS_CONFIG[variant];

  const containerClass = twMerge(
    classNames(
      'flex items-center gap-1 dial-tiny rounded p-1 h-[22px] text-primary',
      variantClass,
      !bordered ? 'border-transparent' : 'border',
      cssClass,
    ),
  );

  return (
    <div key={tag} className={containerClass}>
      <DialIcon icon={iconBefore} />
      <DialEllipsisTooltip text={tag} />
      {remove && (
        <DialButton
          iconAfter={<IconX size={16} />}
          onClick={(e) => remove(e)}
        />
      )}
    </div>
  );
};
