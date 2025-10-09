import { TagVariant } from '@/types/tag';
import { IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC } from 'react';
import { TAG_VARIANTS_CONFIG } from './constants';
import { DialButton } from '../Button/Button';

export interface DialTagProps {
  tag: string;
  cssClass?: string;
  remove?: () => void;
  variant?: TagVariant;
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
}) => {
  const variantClass = TAG_VARIANTS_CONFIG[variant];

  const containerClass = classNames(
    'flex items-center gap-1 tiny border rounded p-1 h-[22px] text-primary',
    cssClass,
    variantClass,
  );

  return (
    <div key={tag} className={containerClass}>
      <span>{tag}</span>
      {remove && (
        <DialButton iconAfter={<IconX size={16} />} onClick={remove} />
      )}
    </div>
  );
};
