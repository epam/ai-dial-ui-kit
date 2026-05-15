import { IconCaretLeftFilled, IconCaretRightFilled } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialIconButton } from '@/components/IconButton/IconButton';
import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { getPageRange } from './utils';

export interface DialPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const DialPagination: FC<DialPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  const pages = getPageRange(page, totalPages, siblingCount);

  return (
    <nav
      aria-label="Pagination"
      className={mergeClasses('flex items-center gap-2', className)}
    >
      <DialIconButton
        icon={
          <IconCaretLeftFilled
            size={DIAL_ICON_SIZE.SM}
            className="text-secondary"
          />
        }
        size={ElementSize.Small}
        className="!p-0 items-center flex justify-center"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      />

      <div className="flex flex-row items-center gap-2">
        {pages.map((p) =>
          p === page ? (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={mergeClasses(
                'bg-secondary h-[8px] w-[32px] rounded-full focus-visible:outline outline-offset-0',
              )}
            />
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={mergeClasses(
                'bg-secondary size-[8px] rounded-full focus-visible:outline outline-offset-0',
              )}
            />
          ),
        )}
      </div>

      <DialIconButton
        icon={
          <IconCaretRightFilled
            size={DIAL_ICON_SIZE.SM}
            className="text-secondary"
          />
        }
        size={ElementSize.Small}
        className="!p-0 items-center flex justify-center"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      />
    </nav>
  );
};
