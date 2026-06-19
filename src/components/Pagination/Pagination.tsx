import { IconCaretLeftFilled, IconCaretRightFilled } from '@tabler/icons-react';
import type { FC } from 'react';

import { DialIconButton } from '@/components/IconButton/IconButton';
import { mergeClasses } from '@/utils/merge-classes';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { ElementSize } from '@/types/size';
import { getPageRange, getPageDisplayType, PageDisplayType } from './utils';

export interface DialPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const DialPagination: FC<DialPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  className,
}) => {
  const pages = getPageRange(totalPages);

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
        {pages.map((p) => {
          const displayType = getPageDisplayType(p, page, totalPages);
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={mergeClasses(
                'dial-pagination-dot rounded-full focus-visible:outline outline-offset-0 transition-all duration-300 ease-in-out',
                displayType === PageDisplayType.Active && 'h-[8px] w-[32px]',
                displayType === PageDisplayType.Adjacent && 'size-[8px]',
                displayType === PageDisplayType.Far && 'size-[4px]',
              )}
            />
          );
        })}
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
