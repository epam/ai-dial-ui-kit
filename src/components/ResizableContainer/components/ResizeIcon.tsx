import { ResizableContainerSide } from '@/types/resizable-container';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import classNames from 'classnames';
import type { FC } from 'react';

interface ResizeIconProps {
  side: ResizableContainerSide;
  className: string;
}

export const ResizeIcon: FC<ResizeIconProps> = ({ side, className }) => {
  const isLeft = side === ResizableContainerSide.Left;
  const Icon = isLeft ? IconChevronLeft : IconChevronRight;

  return (
    <div className={className}>
      <Icon className={classNames('h-full', isLeft && '-ml-6')} />
    </div>
  );
};
