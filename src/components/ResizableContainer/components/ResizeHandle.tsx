import { ResizableContainerSide } from '@/types/resizable-container';
import { mergeClasses } from '@/utils/merge-classes';
import { type FC, type ReactNode } from 'react';
import { ResizeIcon } from './ResizeIcon';

interface ResizeHandleProps {
  side: ResizableContainerSide;
  isResizing: boolean;
  customHandler?: ReactNode;
  handlerClassName?: string;
}

export const ResizeHandle: FC<ResizeHandleProps> = ({
  side,
  isResizing,
  customHandler,
  handlerClassName,
}) => {
  const iconClassName = mergeClasses(
    'invisible h-full w-0.5 group-hover:visible bg-accent-primary text-accent-primary cursor-col-resize transition-opacity',
    isResizing && 'visible',
    handlerClassName,
  );

  const defaultIcon = <ResizeIcon side={side} className={iconClassName} />;

  if (customHandler) {
    return <div className={iconClassName}>{customHandler}</div>;
  }

  return defaultIcon;
};
