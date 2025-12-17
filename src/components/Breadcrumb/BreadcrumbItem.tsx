import type { FC, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
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

export interface DialBreadcrumbItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, 'onClick'> {
  label: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  iconBefore?: ReactNode;
  labelClassName?: string;
  isLast?: boolean;
  separator?: ReactNode;
}

export const DialBreadcrumbItem: FC<DialBreadcrumbItemProps> = ({
  label,
  href,
  onClick,
  disabled,
  isLast,
  separator = defaultSeparator,
  className,
  iconBefore,
  labelClassName,
  ...rest
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
    typeof label === 'string' ? (
      <DialEllipsisTooltip
        className={labelClassName}
        text={label}
        id="breadcrumb-item-content"
      />
    ) : (
      <span
        className={mergeClasses(
          'flex-1 min-w-0 max-w-full truncate',
          labelClassName,
        )}
        aria-label="breadcrumb-item-content"
      >
        {label}
      </span>
    );

  return (
    <li
      {...rest}
      className={containerClassName}
      aria-label={rest['aria-label'] || 'breadcrumb-item'}
    >
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
