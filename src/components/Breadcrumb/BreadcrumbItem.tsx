import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import type { NavigationGuard } from '@/models/breadcrumb';
import { mergeClasses } from '@/utils/merge-classes';
import type {
  FC,
  HTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
} from 'react';
import {
  breadcrumbCurrentClassName,
  breadcrumbItemBaseClassName,
  breadcrumbItemWidthClassName,
  breadcrumbLinkBaseClassName,
  breadcrumbLinkInteractiveClassName,
  breadcrumbSeparatorClassName,
  defaultSeparator,
} from './constants';

export interface DialBreadcrumbItemProps extends Omit<
  HTMLAttributes<HTMLLIElement>,
  'onClick'
> {
  label: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  disabled?: boolean;
  iconBefore?: ReactNode;
  labelClassName?: string;
  isLast?: boolean;
  isFirst?: boolean;
  separator?: ReactNode;
  onBeforeNavigate?: NavigationGuard;
}

export const DialBreadcrumbItem: FC<DialBreadcrumbItemProps> = ({
  label,
  href,
  onClick,
  disabled,
  isLast,
  isFirst,
  separator = defaultSeparator,
  className,
  iconBefore,
  labelClassName,
  onBeforeNavigate,
  ...props
}) => {
  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    // Check navigation guard before proceeding
    if (onBeforeNavigate && !isLast) {
      const canNavigate = await onBeforeNavigate();
      if (!canNavigate) {
        e.preventDefault();
        return;
      }
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };
  const widthClassName = isLast
    ? breadcrumbItemWidthClassName.last
    : isFirst
      ? breadcrumbItemWidthClassName.first
      : breadcrumbItemWidthClassName.middle;

  const containerClassName = mergeClasses(
    breadcrumbItemBaseClassName,
    widthClassName,
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
        className={mergeClasses('cursor-pointer', labelClassName)}
        text={label}
        id="breadcrumb-item-content"
      />
    ) : (
      <span
        className={mergeClasses(
          'flex-1 min-w-0 truncate cursor-pointer max-w-[300px]',
          labelClassName,
        )}
        aria-label="breadcrumb-item-content"
      >
        {label}
      </span>
    );

  return (
    <li
      {...props}
      className={containerClassName}
      aria-label={props['aria-label'] || 'breadcrumb-item'}
    >
      {interactive ? (
        <a href={href} onClick={handleClick} className={contentClassName}>
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
