import type { FC, ReactElement, ReactNode } from 'react';
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
import type { DialBreadcrumbPathItem } from '@/models/breadcrumb';

export interface DialBreadcrumbProps {
  pathItems?: DialBreadcrumbPathItem[];
  separator?: ReactNode;
  ariaLabel?: string;
  cssClass?: string;
  children?: ReactNode;
  titleCssClass?: string;
}

/**
 * Breadcrumb navigation component with horizontal scroll on overflow.
 *
 * Use either the `pathItems` prop or compose with `<DialBreadcrumbItem/>` as children.
 * The last item is treated as the current page.
 *
 * @example
 * ```tsx
 * <DialBreadcrumb
 *   pathItems={[
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
 * @param pathItems - Array of breadcrumb pathItems (see `DialBreadcrumbItem`).
 * @param separator - Custom separator node (default: right chevron icon).
 * @param ariaLabel - Aria label for the `<nav>` element (default: "Breadcrumb").
 * @param cssClass - Additional CSS classes for the `<nav>` container.
 * @param children - Alternatively, compose with `<DialBreadcrumbItem/>` as children.
 * @param titleCssClass - Additional CSS classes applied to each item when using `pathItems` prop.
 */
export const DialBreadcrumb: FC<DialBreadcrumbProps> = ({
  pathItems,
  separator = defaultSeparator,
  ariaLabel = 'Breadcrumb',
  cssClass,
  children,
  titleCssClass,
}) => {
  const content = pathItems?.length
    ? pathItems.map((item, index) => (
        <DialBreadcrumbItem
          key={`item-${index}`}
          {...item}
          isLast={index === pathItems.length - 1}
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
