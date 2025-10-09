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
