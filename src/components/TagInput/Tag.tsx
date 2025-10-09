import { TagVariant } from '@/types/tag';
import { IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC } from 'react';
import { TAG_VARIANTS_CONFIG } from './constants';

interface DialTagProps {
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
    'flex items-center gap-1 tiny border rounded px-2 py-1 h-[24px]',
    cssClass,
    variantClass,
  );

  return (
    <div key={tag} className={containerClass}>
      <span>{tag}</span>
      {remove && (
        <button type="button" aria-label="button" onClick={remove}>
          <IconX height={16} width={16} />
        </button>
      )}
    </div>
  );
};
