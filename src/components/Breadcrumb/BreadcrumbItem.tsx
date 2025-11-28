import type { FC, MouseEventHandler, ReactNode } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  breadcrumbItemBaseClasses,
  breadcrumbLinkBaseClasses,
  breadcrumbLinkInteractiveClasses,
  breadcrumbCurrentClasses,
  breadcrumbSeparatorClasses,
  defaultSeparator,
  breadcrumbItemVisibleClasses,
  breadcrumbItemLastClasses,
} from './constants';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';

export interface DialBreadcrumbItemProps {
  title: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  iconBefore?: ReactNode;
  className?: string;
  titleClassName?: string;
  isLast?: boolean;
  separator?: ReactNode;
}

export const DialBreadcrumbItem: FC<DialBreadcrumbItemProps> = ({
  title,
  href,
  onClick,
  disabled,
  isLast,
  separator = defaultSeparator,
  className,
  iconBefore,
  titleClassName,
}) => {
  const containerClasses = mergeClasses(
    breadcrumbItemBaseClasses,
    isLast ? breadcrumbItemLastClasses : breadcrumbItemVisibleClasses,
    className,
  );
  const interactive = (!!href || !!onClick) && !isLast && !disabled;

  const contentClassNames = interactive
    ? mergeClasses(breadcrumbLinkBaseClasses, breadcrumbLinkInteractiveClasses)
    : mergeClasses(
        breadcrumbLinkBaseClasses,
        breadcrumbCurrentClasses,
        disabled ? 'pointer-events-none opacity-75' : '',
      );

  const Content =
    typeof title === 'string' ? (
      <DialEllipsisTooltip className={titleClassName} text={title} />
    ) : (
      <span
        className={mergeClasses(
          'flex-1 min-w-0 max-w-full truncate',
          titleClassName,
        )}
      >
        {title}
      </span>
    );

  return (
    <li className={containerClasses}>
      {interactive ? (
        <a href={href} onClick={onClick} className={contentClassNames}>
          {iconBefore}
          {Content}
        </a>
      ) : (
        <span
          className={contentClassNames}
          aria-current={isLast ? 'page' : undefined}
          aria-disabled={disabled ? 'true' : undefined}
        >
          {iconBefore}
          {Content}
        </span>
      )}

      {!isLast && (
        <span className={breadcrumbSeparatorClasses}>{separator}</span>
      )}
    </li>
  );
};
