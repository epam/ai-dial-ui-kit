import { TagVariant } from '@/types/tag';
import { IconX } from '@tabler/icons-react';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { TAG_VARIANTS_CONFIG } from './constants';
import { DialButton } from '@/components/Button/Button';
import { DialIcon } from '@/components/Icon/Icon';

export interface DialTagProps {
  tag: string;
  cssClass?: string;
  remove?: () => void;
  variant?: TagVariant;
  iconBefore?: ReactNode;
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
 */
export const DialTag: FC<DialTagProps> = ({
  tag,
  cssClass,
  remove,
  variant = TagVariant.Default,
  iconBefore,
}) => {
  const variantClass = TAG_VARIANTS_CONFIG[variant];

  const containerClass = twMerge(
    classNames(
      'flex items-center gap-1 dial-tiny border rounded p-1 h-[22px] text-primary',
      variantClass,
      cssClass,
    ),
  );

  return (
    <div key={tag} className={containerClass}>
      <DialIcon icon={iconBefore} />
      <span>{tag}</span>
      {remove && (
        <DialButton iconAfter={<IconX size={16} />} onClick={remove} />
      )}
    </div>
  );
};
