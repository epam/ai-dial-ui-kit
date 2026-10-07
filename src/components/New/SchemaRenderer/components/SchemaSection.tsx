import { type FC, type ReactNode, useId, useState } from 'react';
import {
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconTrash,
} from '@tabler/icons-react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DangerIconButton } from '@/components/New/IconButton/IconButtonWrappers';
import { InfoButton } from '@/components/New/InfoButton/InfoButton';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
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
 * A collapsible card wrapping a group of schema properties.
 * aliases: CollapsibleSchemaSection|SchemaCard
 * Design system 2.0
 *
 * Only the chevron and the title sit inside the toggle button. The info button
 * and the remove button are its siblings, since a button nested in a button is
 * invalid and its clicks would toggle the section too.
 *
 * @example
 * ```tsx
 * <SchemaSection title="Settings" level={0} summary="3/4 fields" errorCount={1}>
 *   <p>Content</p>
 * </SchemaSection>
 * ```
 *
 * @param title - Section header title
 * @param [description] - Explanatory text, exposed through an info button in the header
 * @param [summary] - Short summary text shown in the header (e.g. "3/4 fields", "2 items")
 * @param [errorCount=0] - Number of validation errors; shows an error count when > 0
 * @param [level=0] - Nesting depth; 0 is the top-level card, 1+ the nested one
 * @param [children] - Section body, mounted only while expanded
 * @param [onRemove] - If provided, shows a remove button in the header
 * @param [defaultExpanded=true] - Whether the section starts expanded
 * @param [removeItemAriaLabel='Remove item'] - Accessible name of the remove button
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
  const contentId = useId();
  const isTopLevel = level === 0;

  return (
    <div
      className={mergeClasses(
        'flex flex-col border border-tertiary',
        isTopLevel ? 'rounded-xl bg-layer-raised' : 'rounded-lg',
        DIAL_KIT_CLASS.schemaRendererSection,
      )}
    >
      <div
        className={mergeClasses(
          'flex items-center gap-2',
          isTopLevel ? 'px-4 py-3' : 'px-3 py-2',
        )}
      >
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={isExpanded ? contentId : undefined}
          onClick={() => setIsExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded text-left text-primary focus-visible:outline focus-visible:outline-focus"
        >
          <IconChevronDown
            size={DIAL_ICON_SIZE.SM}
            stroke={DIAL_KIT_ICON_STROKE}
            aria-hidden="true"
            className={mergeClasses(
              'shrink-0 text-secondary transition-transform',
              !isExpanded && '-rotate-90',
            )}
          />
          <span
            className={mergeClasses(
              'truncate',
              isTopLevel ? 'dial-small-semi-text' : 'dial-small-text',
            )}
          >
            {title}
          </span>
        </button>

        <InfoButton caption={description} />

        {summary && (
          <span className="dial-tiny-text whitespace-nowrap text-secondary">
            {summary}
          </span>
        )}

        {errorCount > 0 ? (
          <span className="flex items-center gap-1 whitespace-nowrap dial-tiny-text text-error">
            <IconAlertTriangle
              size={DIAL_ICON_SIZE.SM}
              stroke={DIAL_KIT_ICON_STROKE}
              aria-hidden="true"
              className="shrink-0"
            />
            {errorCount} error{errorCount > 1 ? 's' : ''}
          </span>
        ) : (
          <IconCheck
            size={DIAL_ICON_SIZE.SM}
            stroke={DIAL_KIT_ICON_STROKE}
            aria-hidden="true"
            className="shrink-0 text-success"
          />
        )}

        {onRemove && (
          <DangerIconButton
            size={ElementSize.Small}
            icon={
              <IconTrash
                size={DIAL_ICON_SIZE.SM}
                stroke={DIAL_KIT_ICON_STROKE}
                aria-hidden="true"
              />
            }
            aria-label={removeItemAriaLabel}
            onClick={onRemove}
            className="shrink-0"
          />
        )}
      </div>

      {isExpanded && (
        <div
          id={contentId}
          className={mergeClasses(
            'border-t border-tertiary',
            isTopLevel ? 'p-4' : 'p-3',
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
