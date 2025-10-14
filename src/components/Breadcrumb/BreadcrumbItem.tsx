import type { FC, ReactNode } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  breadcrumbItemBaseClasses,
  breadcrumbLinkBaseClasses,
  breadcrumbLinkInteractiveClasses,
  breadcrumbCurrentClasses,
  breadcrumbSeparatorClasses,
  defaultSeparator,
} from './constants';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';

export interface DialBreadcrumbItemProps {
  title: ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  iconBefore?: ReactNode;
  cssClass?: string;
  titleCssClass?: string;
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
  cssClass,
  iconBefore,
  titleCssClass,
}) => {
  const containerClasses = mergeClasses(breadcrumbItemBaseClasses, cssClass);
  const interactive = !!href && !isLast && !disabled;

  const Content =
    typeof title === 'string' ? <DialEllipsisTooltip text={title} /> : title;

  return (
    <li className={containerClasses}>
      {interactive ? (
        <a
          className={mergeClasses(
            breadcrumbLinkBaseClasses,
            breadcrumbLinkInteractiveClasses,
            titleCssClass,
          )}
          href={href}
          onClick={onClick}
        >
          {iconBefore}
          {Content}
        </a>
      ) : (
        <span
          className={mergeClasses(
            breadcrumbLinkBaseClasses,
            breadcrumbCurrentClasses,
            disabled && 'pointer-events-none opacity-75',
            titleCssClass,
          )}
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
