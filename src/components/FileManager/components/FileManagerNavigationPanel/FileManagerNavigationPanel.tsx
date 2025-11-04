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
      'pathItems' | 'children' | 'cssClass' | 'separator'
    >,
    Omit<
      DialSearchProps,
      | 'onChange'
      | 'elementId'
      | 'value'
      | 'cssClass'
      | 'containerCssClass'
      | 'placeholder'
      | 'size'
    > {
  path?: string;
  makeHref?: (segments: string[], index: number) => string | undefined;
  cssClass?: string;
  breadcrumbCssClass?: string;
  onItemClick?: (href?: string) => void;

  searchable?: boolean;
  value?: string | number | null;
  elementId?: string;
  onSearchChange?: (value: string) => void;
  searchCssClass?: string;
  searchContainerCssClass?: string;
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
 * @param [titleCssClass] - Extra classes for breadcrumb titles
 * @param [path] - A full path string that will be split into breadcrumb items
 * @param [makeHref] - Factory to create hrefs for segments
 * @param [onItemClick] - Callback fired when a breadcrumb item is clicked
 * @param [cssClass] - Additional classes for the panel container
 * @param [breadcrumbCssClass] - Classes forwarded to inner `DialBreadcrumb`
 * @param [searchable=true] - Whether to render the search control
 * @param [value] - Controlled value for the search input (parent-managed)
 * @param [elementId="fm-search"] - DOM id for the internal DialSearch input
 * @param [size=SearchSize.Base] - Size of the search input (from DialSearchProps)
 * @param [onSearchChange] - Callback fired when the search value changes
 * @param [searchCssClass] - Extra classes for the search input element
 * @param [searchContainerCssClass] - Extra classes for the search container
 */
export const DialFileManagerNavigationPanel: FC<
  DialFileManagerNavigationPanelProps
> = ({
  ariaLabel = 'Breadcrumb',
  titleCssClass,
  onItemClick,

  path,
  makeHref,

  cssClass,
  breadcrumbCssClass,

  searchable = true,
  value,
  elementId = 'fm-search',
  disabled,
  readonly,
  invalid,
  onSearchChange,
  searchCssClass,
  searchContainerCssClass,
}) => {
  const breadcrumbPathItems: DialBreadcrumbPathItem[] | undefined =
    useMemo(() => {
      if (!path) return undefined;
      const segments = path
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!segments.length) return [{ title: '/' }];

      return segments.map((segment, index) => {
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
    }, [path, makeHref, onItemClick]);

  return (
    <div className={classNames(panelBaseClasses, cssClass)}>
      <div className={breadcrumbContainerClasses}>
        <DialBreadcrumb
          pathItems={breadcrumbPathItems}
          ariaLabel={ariaLabel}
          titleCssClass={titleCssClass}
          cssClass={breadcrumbCssClass}
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
            cssClass={searchCssClass}
            containerCssClass={searchContainerCssClass}
          />
        </div>
      )}
    </div>
  );
};
