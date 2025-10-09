import { IconX } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC } from 'react';

interface DialTagProps {
  tag: string;
  cssClass?: string;
  remove?: () => void;
}

export const DialTag: FC<DialTagProps> = ({ tag, cssClass, remove }) => {
  const containerClass = classNames(
    'flex items-center gap-1 tiny border rounded px-2 py-1 bg-layer-3 h-[24px]',
    cssClass,
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
