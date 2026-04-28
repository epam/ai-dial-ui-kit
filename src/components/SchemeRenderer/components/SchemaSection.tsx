import { type FC, type ReactNode, useState } from 'react';
import {
  IconChevronDown,
  IconChevronRight,
  IconAlertTriangle,
  IconCheck,
} from '@tabler/icons-react';
import { DialIcon } from '@/components/Icon/Icon';
import { DialInfoButton } from '@/components/InfoButton/InfoButton';
import { DialRemoveButton } from '@/components/RemoveButton/RemoveButton';
import { ElementSize } from '@/types/size';
import { mergeClasses } from '@/utils/merge-classes';

export interface SchemaSectionProps {
  title: string;
  description?: string;
  summary?: string;
  errorCount?: number;
  level?: number;
  children?: ReactNode;
  onRemove?: () => void;
  defaultExpanded?: boolean;
  removeItemAriaLabel?: string;
}

/**
 * A collapsible section card used to wrap schema property groups.
 * aliases: CollapsibleSchemaSection|SchemaCard
 *
 * @example
 * ```tsx
 * <SchemaSection title="Settings" level={0} summary="3/4 fields" errorCount={1}>
 *   <p>Content</p>
 * </SchemaSection>
 * ```
 *
 * @param title - Section header title
 * @param [description] - Optional description shown in collapsed state
 * @param [summary] - Short summary text shown in the header (e.g. "3/4 fields", "2 items")
 * @param [errorCount=0] - Number of validation errors; shows error badge when > 0
 * @param [level=0] - Nesting depth; 0 = top-level card style, 1+ = nested style
 * @param [children] - Section body content rendered when expanded
 * @param [onRemove] - If provided, shows a remove button in the section header
 * @param [defaultExpanded=true] - Whether the section starts in the expanded state
 */
export const SchemaSection: FC<SchemaSectionProps> = ({
  title,
  description,
  summary,
  errorCount = 0,
  level = 0,
  children,
  onRemove,
  defaultExpanded = true,
  removeItemAriaLabel = 'Remove item',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isTopLevel = level === 0;

  const containerClass = 'rounded border border-secondary';

  const headerClass = mergeClasses(
    'flex items-center gap-2 cursor-pointer select-none transition-colors',
    isTopLevel
      ? 'px-4 py-3 bg-layer-3 hover:bg-layer-4'
      : 'px-3 py-2 bg-layer-4 hover:bg-layer-3',
    isExpanded ? 'rounded-t' : 'rounded',
  );

  const contentClass = mergeClasses(
    'border-t border-secondary',
    isTopLevel ? 'p-4' : 'p-3',
  );

  return (
    <div className={containerClass}>
      <div
        className={headerClass}
        onClick={() => setIsExpanded((v) => !v)}
        role="button"
        aria-expanded={isExpanded}
      >
        <span className="flex-shrink-0 text-secondary">
          {isExpanded ? (
            <IconChevronDown size={16} stroke={2} />
          ) : (
            <IconChevronRight size={16} stroke={2} />
          )}
        </span>

        <span
          className={mergeClasses(
            'flex-1 truncate',
            isTopLevel
              ? 'dial-small-semi-text text-primary'
              : 'dial-small-text text-primary',
          )}
        >
          {title}
        </span>

        {description && <DialInfoButton caption={description} />}

        {summary && (
          <span className="dial-tiny-text text-secondary whitespace-nowrap ml-2">
            {summary}
          </span>
        )}

        {errorCount > 0 ? (
          <span className="flex items-center gap-1 dial-tiny-text text-error whitespace-nowrap">
            <DialIcon icon={<IconAlertTriangle size={13} stroke={2} />} />
            {errorCount} error{errorCount > 1 ? 's' : ''}
          </span>
        ) : (
          <DialIcon
            icon={<IconCheck size={13} stroke={2} />}
            className="text-success flex-shrink-0"
          />
        )}

        {onRemove && (
          <DialRemoveButton
            size={ElementSize.Small}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={removeItemAriaLabel}
            className="ml-1 flex-shrink-0 p-0.5"
          />
        )}
      </div>

      {isExpanded && <div className={contentClass}>{children}</div>}
    </div>
  );
};
