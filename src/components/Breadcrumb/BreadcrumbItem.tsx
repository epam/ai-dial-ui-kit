import type { FC, MouseEventHandler, ReactNode } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  breadcrumbItemBaseClassName,
  breadcrumbLinkBaseClassName,
  breadcrumbLinkInteractiveClassName,
  breadcrumbCurrentClassName,
  breadcrumbSeparatorClassName,
  defaultSeparator,
  breadcrumbItemVisibleClassName,
  breadcrumbItemLastClassName,
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
  const containerClassName = mergeClasses(
    breadcrumbItemBaseClassName,
    isLast ? breadcrumbItemLastClassName : breadcrumbItemVisibleClassName,
    className,
  );
  const interactive = (!!href || !!onClick) && !isLast && !disabled;

  const contentClassName = interactive
    ? mergeClasses(
        breadcrumbLinkBaseClassName,
        breadcrumbLinkInteractiveClassName,
      )
    : mergeClasses(
        breadcrumbLinkBaseClassName,
        breadcrumbCurrentClassName,
        disabled ? 'pointer-events-none opacity-75' : '',
      );

  const Content =
    typeof title === 'string' ? (
      <DialEllipsisTooltip
        className={titleClassName}
        text={title}
        id="breadcrumb-item-content"
      />
    ) : (
      <span
        className={mergeClasses(
          'flex-1 min-w-0 max-w-full truncate',
          titleClassName,
        )}
        aria-label="breadcrumb-item-content"
      >
        {title}
      </span>
    );

  return (
    <li className={containerClassName} aria-label="breadcrumb-item">
      {interactive ? (
        <a href={href} onClick={onClick} className={contentClassName}>
          {iconBefore}
          {Content}
        </a>
      ) : (
        <span
          className={contentClassName}
          aria-current={isLast ? 'page' : undefined}
          aria-disabled={disabled ? 'true' : undefined}
        >
          {iconBefore}
          {Content}
        </span>
      )}

      {!isLast && (
        <span className={breadcrumbSeparatorClassName} aria-label="separator">
          {separator}
        </span>
      )}
    </li>
  );
};
