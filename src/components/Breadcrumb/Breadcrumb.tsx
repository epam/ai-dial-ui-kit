import type { FC, MouseEvent, ReactElement, ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  breadcrumbBaseClasses,
  breadcrumbListClasses,
  defaultSeparator,
} from './constants';
import {
  DialBreadcrumbItem,
  type DialBreadcrumbItemProps,
} from './BreadcrumbItem';

export interface DialBreadcrumbRoute {
  title: ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  disabled?: boolean;
  cssClass?: string;
  iconBefore?: ReactNode;
}

export interface DialBreadcrumbProps {
  items?: DialBreadcrumbRoute[];
  separator?: ReactNode;
  ariaLabel?: string;
  cssClass?: string;
  children?: ReactNode;
  titleCssClass?: string;
}

/**
 * Breadcrumb navigation component with horizontal scroll on overflow.
 *
 * Use either the `items` prop or compose with `<DialBreadcrumbItem/>` as children.
 * The last item is treated as the current page.
 *
 * @example
 * ```tsx
 * <DialBreadcrumb
 *   items={[
 *     { title: 'Home', href: '/' },
 *     { title: 'Section', href: '/section' },
 *     { title: 'Current Page' },
 *   ]}
 * />
 *
 * <DialBreadcrumb>
 *   <DialBreadcrumbItem title="Home" href="/" />
 *   <DialBreadcrumbItem title="Section" href="/section" />
 *   <DialBreadcrumbItem title="Current Page" />
 * </DialBreadcrumb>
 * ```
 *
 * @param items - Array of breadcrumb items (see `DialBreadcrumbRoute`).
 * @param separator - Custom separator node (default: right chevron icon).
 * @param ariaLabel - Aria label for the `<nav>` element (default: "Breadcrumb").
 * @param cssClass - Additional CSS classes for the `<nav>` container.
 * @param children - Alternatively, compose with `<DialBreadcrumbItem/>` as children.
 * @param titleCssClass - Additional CSS classes applied to each item when using `items` prop.
 */
const DialBreadcrumb: FC<DialBreadcrumbProps> = ({
  items,
  separator = defaultSeparator,
  ariaLabel = 'Breadcrumb',
  cssClass,
  children,
  titleCssClass,
}) => {
  const content = items?.length
    ? items.map((item, index) => (
        <DialBreadcrumbItem
          key={`item-${index}`}
          {...item}
          isLast={index === items.length - 1}
          separator={separator}
          titleCssClass={titleCssClass}
        />
      ))
    : Children.toArray(children).map((child, index, arr) => {
        if (!isValidElement(child)) return child;
        const isLast = index === arr.length - 1;
        return cloneElement(child as ReactElement<DialBreadcrumbItemProps>, {
          isLast,
          separator,
        });
      });

  return (
    <nav
      aria-label={ariaLabel}
      className={mergeClasses(breadcrumbBaseClasses, cssClass)}
    >
      <ol className={breadcrumbListClasses}>{content}</ol>
    </nav>
  );
};

Object.assign(DialBreadcrumb, { Item: DialBreadcrumbItem });

export { DialBreadcrumb };
