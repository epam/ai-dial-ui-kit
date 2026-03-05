import type { FC, MouseEvent, ReactNode } from 'react';
import { Children, isValidElement, useMemo, useCallback } from 'react';
import { mergeClasses } from '@/utils/merge-classes';
import {
  breadcrumbBaseClassName,
  breadcrumbListClassName,
  defaultSeparator,
  breadcrumbItemBaseClassName,
  breadcrumbSeparatorClassName,
  breadcrumbEllipsisButtonClassName,
} from './constants';
import {
  DialBreadcrumbItem,
  type DialBreadcrumbItemProps,
} from './BreadcrumbItem';
import type {
  DialBreadcrumbPathItem,
  NavigationGuard,
} from '@/models/breadcrumb';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { IconDots } from '@tabler/icons-react';
import type { DropdownItem } from '@/models/dropdown';
import { DIAL_ICON_SIZE } from '@/constants/icon';

export interface DialBreadcrumbProps {
  pathItems?: DialBreadcrumbPathItem[];
  separator?: ReactNode;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
  labelClassName?: string;
  onBeforeNavigate?: NavigationGuard;
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
 *     { label: 'Home', href: '/' },
 *     { label: 'Section', href: '/section' },
 *     { label: 'Current Page' },
 *   ]}
 * />
 *
 * <DialBreadcrumb>
 *   <DialBreadcrumbItem label="Home" href="/" />
 *   <DialBreadcrumbItem label="Section" href="/section" />
 *   <DialBreadcrumbItem label="Current Page" />
 * </DialBreadcrumb>
 * ```
 *
 * @param [pathItems] - Array of breadcrumb pathItems (see `DialBreadcrumbItem`).
 * @param [separator] - Custom separator node (default: right chevron icon).
 * @param [ariaLabel] - Aria label for the `<nav>` element (default: "Breadcrumb").
 * @param [className] - Additional CSS classes for the `<nav>` container.
 * @param [children] - Alternatively, compose with `<DialBreadcrumbItem/>` as children.
 * @param [labelClassName] - Additional CSS classes applied to each item when using `pathItems` prop.
 * @param [onBeforeNavigate] - Navigation guard called before navigating to a breadcrumb item.
 *  Guard function called before navigating to a different breadcrumb item.
 *  Return `true` to allow navigation, `false` to prevent it.
 *  Can return a Promise for async checks (e.g., showing a confirmation dialog).
 *
 *  @example
 *  ```tsx
 *  <DialBreadcrumb
 *    pathItems={items}
 *    onBeforeNavigate={async () => {
 *      if (hasUnsavedChanges) {
 *        return await confirmLeave();
 *      }
 *      return true;
 *    }}
 *  />
 *  ```
 */
export const DialBreadcrumb: FC<DialBreadcrumbProps> = ({
  pathItems,
  separator = defaultSeparator,
  ariaLabel = 'Breadcrumb',
  className,
  children,
  labelClassName,
  onBeforeNavigate,
}) => {
  const items = useMemo(() => {
    if (pathItems?.length) {
      return pathItems;
    }
    return Children.toArray(children)
      .filter(isValidElement)
      .map((child) => {
        const childProps = child.props as DialBreadcrumbItemProps;
        const { labelClassName, isLast, separator, ...props } = childProps;
        return props;
      });
  }, [pathItems, children]);

  const handleDropdownItemClick = useCallback(
    async (info: { key: string; domEvent: MouseEvent }) => {
      const index = parseInt(info.key, 10);
      const item = items[index];

      // Check navigation guard before proceeding
      if (onBeforeNavigate) {
        const canNavigate = await onBeforeNavigate();
        if (!canNavigate) {
          info.domEvent.preventDefault();
          return;
        }
      }

      if (item.onClick) {
        item.onClick(info.domEvent as MouseEvent<HTMLAnchorElement>);
      } else if (item.href) {
        window.location.href = item.href;
      }
    },
    [items, onBeforeNavigate],
  );

  const content = useMemo(() => {
    if (items.length === 0) return null;

    if (items.length <= 3) {
      return items.map((item, index) => (
        <DialBreadcrumbItem
          {...item}
          key={`item-${index}`}
          isLast={index === items.length - 1}
          separator={separator}
          labelClassName={labelClassName}
          onBeforeNavigate={onBeforeNavigate}
        />
      ));
    }

    const first = items.at(0);
    const middle = items.slice(1, -2);
    const preLast = items.at(-2);
    const last = items.at(-1);

    if (!first || !preLast || !last) return null;

    const dropdownItems: DropdownItem[] = middle.map((item, idx) => ({
      key: String(idx + 1),
      label: typeof item.label === 'string' ? item.label : `Item ${idx + 1}`,
      disabled: item.disabled,
    }));

    return (
      <>
        <DialBreadcrumbItem
          {...first}
          key="item-0"
          separator={separator}
          labelClassName={labelClassName}
          onBeforeNavigate={onBeforeNavigate}
        />

        <li className={mergeClasses(breadcrumbItemBaseClassName)}>
          <DialDropdown
            menu={{
              items: dropdownItems,
              onClick: handleDropdownItemClick,
            }}
            placement="bottom-start"
            matchReferenceWidth={false}
          >
            <button
              type="button"
              aria-label="More breadcrumbs"
              className={breadcrumbEllipsisButtonClassName}
            >
              <IconDots size={DIAL_ICON_SIZE.SM} />
            </button>
          </DialDropdown>
          <span className={breadcrumbSeparatorClassName}>{separator}</span>
        </li>

        <DialBreadcrumbItem
          {...preLast}
          key={`item-${items.length - 2}`}
          separator={separator}
          labelClassName={labelClassName}
          onBeforeNavigate={onBeforeNavigate}
        />

        <DialBreadcrumbItem
          {...last}
          key={`item-${items.length - 1}`}
          isLast
          separator={separator}
          labelClassName={labelClassName}
          onBeforeNavigate={onBeforeNavigate}
        />
      </>
    );
  }, [
    items,
    separator,
    labelClassName,
    handleDropdownItemClick,
    onBeforeNavigate,
  ]);

  return (
    <nav
      aria-label={ariaLabel}
      className={mergeClasses(breadcrumbBaseClassName, className)}
    >
      <ol className={breadcrumbListClassName}>{content}</ol>
    </nav>
  );
};
