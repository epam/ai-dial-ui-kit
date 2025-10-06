import type { FC, ReactNode } from 'react';
import { IconClipboardX } from '@tabler/icons-react';

export interface NoDataContentProps {
  icon?: ReactNode;
  title: string;
}
/**
 * A component for displaying a message and icon when there is no data to show.
 *
 * @example
 * ```tsx
 * <NoDataContent
 *   emptyDataTitle="No results found"
 *   icon={<CustomIcon />}
 * />
 * ```
 *
 * @param [icon] - Custom icon to display (defaults to clipboard icon)
 * @param title - The message to display when no data is present
 */
export const NoDataContent: FC<NoDataContentProps> = ({ icon, title }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-secondary">
      {icon || <IconClipboardX width={60} height={60} />}
      <span className="small mt-2 text-primary">{title}</span>
    </div>
  );
};
