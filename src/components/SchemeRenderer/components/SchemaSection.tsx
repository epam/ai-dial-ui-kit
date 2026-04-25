import { type FC, type ReactNode, useState } from 'react';
import {
  IconChevronDown,
  IconChevronRight,
  IconAlertTriangle,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { DialIcon } from '@/components/Icon/Icon';
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
}

export const SchemaSection: FC<SchemaSectionProps> = ({
  title,
  description,
  summary,
  errorCount = 0,
  level = 0,
  children,
  onRemove,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isTopLevel = level === 0;

  const containerClass = mergeClasses(
    'rounded border',
    isTopLevel ? 'border-border-secondary' : 'border-border-secondary',
  );

  const headerClass = mergeClasses(
    'flex items-center gap-2 cursor-pointer select-none transition-colors',
    isTopLevel
      ? 'px-4 py-3 bg-layer-3 hover:bg-layer-4'
      : 'px-3 py-2 bg-layer-4 hover:bg-layer-3',
    isExpanded ? 'rounded-t' : 'rounded',
  );

  const contentClass = mergeClasses(
    'border-t border-border-secondary',
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
        <span className="flex-shrink-0 text-text-secondary">
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
              ? 'dial-small-semi text-text-primary'
              : 'dial-small text-text-primary',
          )}
        >
          {title}
        </span>

        {!isExpanded && description && (
          <span className="dial-tiny text-text-secondary truncate max-w-[180px] hidden sm:block">
            {description}
          </span>
        )}

        {summary && (
          <span className="dial-tiny text-text-secondary whitespace-nowrap ml-2">
            {summary}
          </span>
        )}

        {errorCount > 0 ? (
          <span className="flex items-center gap-1 dial-tiny text-error whitespace-nowrap">
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 flex-shrink-0 text-text-secondary hover:text-error transition-colors rounded p-0.5"
            aria-label="Remove item"
          >
            <IconX size={14} stroke={2} />
          </button>
        )}
      </div>

      {isExpanded && <div className={contentClass}>{children}</div>}
    </div>
  );
};
