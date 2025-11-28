import classNames from 'classnames';
import { useMemo, type FC, type MouseEvent } from 'react';

import {
  DialBreadcrumb,
  type DialBreadcrumbProps,
} from '@/components/Breadcrumb/Breadcrumb';
import type { DialBreadcrumbPathItem } from '@/models/breadcrumb';
import { DialSearch, type DialSearchProps } from '@/components/Search/Search';

import {
  panelBaseClasses,
  breadcrumbContainerClasses,
  searchContainerClasses,
} from './constants';

export interface DialFileManagerNavigationPanelProps
  extends Omit<
      DialBreadcrumbProps,
      'pathItems' | 'children' | 'className' | 'separator'
    >,
    Omit<
      DialSearchProps,
      | 'onChange'
      | 'elementId'
      | 'value'
      | 'className'
      | 'containerClassName'
      | 'placeholder'
      | 'size'
    > {
  path?: string;
  makeHref?: (segments: string[], index: number) => string | undefined;
  className?: string;
  breadcrumbClassName?: string;
  onItemClick?: (href?: string) => void;
  rootItemPath?: string;
  rootItemLabel?: string;

  searchable?: boolean;
  value?: string | number | null;
  elementId?: string;
  onSearchChange?: (value: string) => void;
  searchClassName?: string;
  searchContainerClassName?: string;
}

/**
 * FileManagerNavigationPanel
 *
 * A navigation header for the File Manager that displays a breadcrumb trail on the left
 * and an optional, controlled Search on the right.
 *
 * Uses the shared {@link DialBreadcrumb} for navigation and the shared {@link DialSearch}
 * for the controlled search input.
 *
 * @example
 * ```tsx
 * <FileManagerNavigationPanel
 *   path="Organization/Folder 4"
 *   searchable
 *   elementId="fm-search"
 *   value={query}
 *   onSearchChange={(val) => setQuery(val)}
 * />
 *
 * // With clickable parents
 * <FileManagerNavigationPanel
 *   path="Org/Design/Assets"
 *   makeHref={(segments, i) => '#' + '/' + segments.slice(0, i + 1).join('/')}
 * />
 * ```
 *
 * @param [ariaLabel="Breadcrumb"] - Aria label for the breadcrumb `<nav>`
 * @param [titleClassName] - Extra classes for breadcrumb titles
 * @param [path] - A full path string that will be split into breadcrumb items
 * @param [makeHref] - Factory to create hrefs for segments
 * @param [onItemClick] - Callback fired when a breadcrumb item is clicked
 * @param [className] - Additional classes for the panel container
 * @param [breadcrumbClassName] - Classes forwarded to inner `DialBreadcrumb`
 * @param [searchable=true] - Whether to render the search control
 * @param [value] - Controlled value for the search input (parent-managed)
 * @param [elementId="fm-search"] - DOM id for the internal DialSearch input
 * @param [size=SearchSize.Base] - Size of the search input (from DialSearchProps)
 * @param [onSearchChange] - Callback fired when the search value changes
 * @param [searchClassName] - Extra classes for the search input element
 * @param [searchContainerClassName] - Extra classes for the search container
 */
export const DialFileManagerNavigationPanel: FC<
  DialFileManagerNavigationPanelProps
> = ({
  ariaLabel = 'Breadcrumb',
  titleClassName,
  onItemClick,

  path,
  makeHref,
  rootItemPath,
  rootItemLabel,

  className,
  breadcrumbClassName,

  searchable = true,
  value,
  elementId = 'fm-search',
  disabled,
  readonly,
  invalid,
  onSearchChange,
  searchClassName,
  searchContainerClassName,
}) => {
  const breadcrumbPathItems: DialBreadcrumbPathItem[] | undefined =
    useMemo(() => {
      if (!path) return undefined;
      const segments = path
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!segments.length) return [{ title: '/' }];

      const items = segments.map((segment, index) => {
        const acc = segments.slice(0, index + 1);
        const href =
          typeof makeHref === 'function' ? makeHref(acc, index) : undefined;

        return {
          title: segment,
          href,
          onClick: onItemClick
            ? (e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                onItemClick(href);
              }
            : undefined,
        };
      });

      if (rootItemPath && rootItemLabel) {
        const rootPathSegments = rootItemPath.split('/').filter(Boolean);
        const currentPathSegments = path.split('/').filter(Boolean);

        const isRootPath = rootPathSegments.every(
          (segment, idx) => currentPathSegments[idx] === segment,
        );

        if (isRootPath && items.length > 0) {
          const remainingItems = items.slice(rootPathSegments.length);

          return [
            {
              title: rootItemLabel,
              href: rootItemPath,
              onClick: onItemClick
                ? (e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    onItemClick(rootItemPath);
                  }
                : undefined,
            },
            ...remainingItems,
          ];
        }
      }

      return items;
    }, [path, makeHref, onItemClick, rootItemPath, rootItemLabel]);

  return (
    <div className={classNames(panelBaseClasses, className)}>
      <div className={breadcrumbContainerClasses}>
        <DialBreadcrumb
          pathItems={breadcrumbPathItems}
          ariaLabel={ariaLabel}
          titleClassName={titleClassName}
          className={breadcrumbClassName}
        />
      </div>

      {searchable && (
        <div
          className={searchContainerClasses}
          role="search"
          aria-label="Search"
        >
          <DialSearch
            elementId={elementId}
            value={value ?? ''}
            onChange={onSearchChange}
            disabled={disabled}
            readonly={readonly}
            invalid={invalid}
            className={searchClassName}
            containerClassName={searchContainerClassName}
          />
        </div>
      )}
    </div>
  );
};
