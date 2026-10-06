import type { FC, ReactNode } from 'react';

import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { AvatarShape } from '@/types/avatar';
import { EntityType } from '@/types/entity-type';
import { mergeClasses } from '@/utils/merge-classes';
import { Avatar } from '@/components/New/Avatar/Avatar';
import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { Highlight } from '@/components/New/Highlight/Highlight';

/** Identity fields of the entity rendered by `EntityIdentity`. */
export interface EntityIdentityItem {
  /** Entity category; picks the colour of the type label and the featured chip. */
  type: EntityType;
  /** Display name. */
  name: string;
  /** Version shown next to the name. */
  version?: string;
  /** Icon URL. The initials of `name` show while it is missing or fails to load. */
  iconUrl?: string;
  /** Whether the entity is marked as featured. */
  isFeatured?: boolean;
}

/** User-visible strings of `EntityIdentity`. */
export interface EntityIdentityLabels {
  /** Type label text, rendered uppercase. Defaults to the English name of `item.type`. */
  type?: string;
  /** Featured chip text. Defaults to `'Featured'`. */
  featured?: string;
}

/** Props for `EntityIdentity`. */
export interface EntityIdentityProps {
  /** The entity to display. */
  item: EntityIdentityItem;
  /** User-visible strings; pass translated ones in a localised app. */
  labels?: EntityIdentityLabels;
  /** Whether to show `item.version` next to the name. */
  showVersion?: boolean;
  /** Whether to show the featured chip when `item.isFeatured` is true. */
  hasFeaturedTag?: boolean;
  /** Width and height of the icon in px. */
  iconSize?: number;
  /** Heading level of the name, 1–6. */
  headingLevel?: number;
  /** Search query; the matching part of the name is highlighted. */
  query?: string;
  /** Content pinned to the bottom of the text column, aligned with the bottom of the icon. */
  footer?: ReactNode;
  /** Badge rendered before the featured chip, in the top-end corner. */
  statusBadge?: ReactNode;
  /** Additional CSS classes for the root. */
  className?: string;
  /** Type-scale class for the name. Defaults to `'dial-h3-text'`. */
  nameClassName?: string;
  /** Type-scale class for the type label. Defaults to `'dial-caption-lead-semi-text'`. */
  typeClassName?: string;
  /** Type-scale class for the version. Defaults to `'dial-tiny-text'`. */
  versionClassName?: string;
  /** Additional CSS classes for the icon, e.g. to change its corner radius. */
  iconClassName?: string;
  /** Additional CSS classes for the featured chip. */
  featuredChipClassName?: string;
}

const DEFAULT_TYPE_LABEL: Record<EntityType, string> = {
  [EntityType.Model]: 'Model',
  [EntityType.Agent]: 'Agent',
  [EntityType.Toolset]: 'Toolset',
  [EntityType.Skill]: 'Skill',
  [EntityType.Prompt]: 'Prompt',
};

/* Literal class names so Tailwind's content scan keeps every one of them. */
const TYPE_TEXT_CLASS: Record<EntityType, string> = {
  [EntityType.Model]: 'text-blue',
  [EntityType.Agent]: 'text-green-1',
  [EntityType.Toolset]: 'text-brown-2',
  [EntityType.Skill]: 'text-violet-1',
  [EntityType.Prompt]: 'text-violet-2',
};

const TYPE_BG_CLASS: Record<EntityType, string> = {
  [EntityType.Model]: 'bg-blue',
  [EntityType.Agent]: 'bg-green-2',
  [EntityType.Toolset]: 'bg-brown',
  [EntityType.Skill]: 'bg-violet-2',
  [EntityType.Prompt]: 'bg-violet-1',
};

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const getHeadingTag = (level: number): (typeof HEADING_TAGS)[number] =>
  HEADING_TAGS[Math.min(6, Math.max(1, Math.round(level))) - 1];

/**
 * The identity block of a DIAL entity: its icon, a coloured type label, the
 * name and the version, with an optional featured chip.
 * aliases: EntityHeader|ModelHeader|AppIdentity
 * Design system 2.0
 *
 * The type label is plain uppercase text coloured by `item.type`. The icon is
 * a square `Avatar`, so a missing or broken image falls back to the initials of
 * the name. The icon is decorative: the name next to it already names the
 * entity.
 *
 * @example
 * ```tsx
 * <EntityIdentity
 *   item={{ type: EntityType.Model, name: 'GPT-4o', version: '2024-11-20' }}
 *   labels={{ type: t('Model') }}
 * />
 * ```
 *
 * @param item - The entity to display
 * @param [labels] - User-visible strings
 * @param [showVersion=true] - Whether to show the version
 * @param [hasFeaturedTag=true] - Whether to show the featured chip for a featured entity
 * @param [iconSize=48] - Icon size in px
 * @param [headingLevel=3] - Heading level of the name
 * @param [query] - Search query highlighted in the name
 * @param [footer] - Content pinned to the bottom of the text column
 * @param [statusBadge] - Badge in the top-end corner
 */
export const EntityIdentity: FC<EntityIdentityProps> = ({
  item,
  labels,
  showVersion = true,
  hasFeaturedTag = true,
  iconSize = 48,
  headingLevel = 3,
  query,
  footer,
  statusBadge,
  className,
  nameClassName = 'dial-h3-text',
  typeClassName = 'dial-caption-lead-semi-text',
  versionClassName = 'dial-tiny-text',
  iconClassName,
  featuredChipClassName,
}) => {
  const HeadingTag = getHeadingTag(headingLevel);
  const isFeaturedShown = hasFeaturedTag && !!item.isFeatured;
  const hasCornerContent = statusBadge != null || isFeaturedShown;
  const version = showVersion ? item.version : undefined;

  return (
    <div
      className={mergeClasses(
        'flex items-start gap-2',
        className,
        DIAL_KIT_CLASS.entityIdentity,
      )}
    >
      <Avatar
        name={item.name}
        src={item.iconUrl}
        size={iconSize}
        shape={AvatarShape.Square}
        className={mergeClasses('rounded-[14px]', iconClassName)}
      />

      <div
        className={mergeClasses(
          'flex min-w-0 flex-1 flex-col gap-1',
          footer != null && 'self-stretch',
        )}
      >
        <div className="relative flex items-center justify-between">
          <span
            className={mergeClasses(
              'uppercase',
              typeClassName,
              TYPE_TEXT_CLASS[item.type],
            )}
          >
            {labels?.type ?? DEFAULT_TYPE_LABEL[item.type]}
          </span>
          {hasCornerContent && (
            <div className="absolute end-0 top-[-6px] flex items-center gap-2">
              {statusBadge}
              {isFeaturedShown && (
                <span
                  className={mergeClasses(
                    'flex h-6 items-center justify-center rounded-2xl px-2',
                    'dial-caption-lead-semi-text',
                    TYPE_BG_CLASS[item.type],
                    TYPE_TEXT_CLASS[item.type],
                    featuredChipClassName,
                  )}
                >
                  {labels?.featured ?? 'Featured'}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex min-w-0 items-center gap-2">
          {/* `shrink` + `min-w-0` (not `flex-1`) keep the version next to the
              name while still letting the name give way to an ellipsis. */}
          <HeadingTag
            className={mergeClasses(
              'min-w-0 shrink text-primary',
              nameClassName,
            )}
          >
            {query ? (
              <Highlight text={item.name} query={query} maxLines={1} />
            ) : (
              <EllipsisTooltip text={item.name} />
            )}
          </HeadingTag>
          {version != null && (
            /* Capped at 30% of the row so a long version truncates instead of
               squeezing the name out. */
            <EllipsisTooltip
              className={mergeClasses(
                'max-w-[30%] shrink-0 text-secondary',
                versionClassName,
              )}
              text={version}
            />
          )}
        </div>

        {footer != null && <div className="mt-auto pt-1">{footer}</div>}
      </div>
    </div>
  );
};
