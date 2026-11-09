import type { FC, ReactNode } from 'react';

import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { SkeletonVariant } from '@/types/skeleton';
import { mergeClasses } from '@/utils/merge-classes';
import { ErrorText } from '@/components/New/CaptionText/CaptionText';
import {
  EntityIdentity,
  type EntityIdentityItem,
} from '@/components/New/EntityIdentity/EntityIdentity';
import { Skeleton } from '@/components/Skeleton/Skeleton';

/** User-visible strings of `SelectedEntityCard`. */
export interface SelectedEntityCardLabels {
  /** Type label text, passed to `EntityIdentity`. Defaults to the English name of `item.type`. */
  type?: string;
  /** Text shown when nothing is selected. Defaults to `'Not selected'`. */
  placeholder?: string;
}

/** Props for `SelectedEntityCard`. */
export interface SelectedEntityCardProps {
  /** Id of the selected entity, `''` when there is none. Shown as-is when `item` is missing. */
  entityId: string;
  /** The selected entity as the catalog lists it; missing when the catalog does not. */
  item?: EntityIdentityItem;
  /** Whether the catalog is still loading; a skeleton stands in for a selected entity meanwhile. */
  isLoading?: boolean;
  /** Dims the card. */
  isDisabled?: boolean;
  /** Error text under the card; it also turns the card's border red. */
  error?: string;
  /** What rides on the selection (an effort, a context window), as a line under the name. */
  details?: ReactNode;
  /** User-visible strings; pass translated ones in a localised app. */
  labels?: SelectedEntityCardLabels;
  /** Whether to show the type label above the name — off when a heading next to the card already names it. */
  showType?: boolean;
  /** Width and height of the icon in px. */
  iconSize?: number;
  /** Heading level of the name, 1–6. */
  headingLevel?: number;
  /** Additional CSS classes for the card. */
  className?: string;
}

/* The skeleton draws on the raised layer the card sits on; the neutral control fill keeps it visible. */
const SKELETON_CLASS = 'bg-control-neutral-active';

const CardSkeleton: FC<{ iconSize: number }> = ({ iconSize }) => (
  <div className="flex items-center gap-2">
    {/* The icon's own corner radius; Skeleton's variant classes would override one passed to it. */}
    <div className="shrink-0 overflow-hidden rounded-[14px]">
      <Skeleton
        variant={SkeletonVariant.Rectangular}
        width={iconSize}
        height={iconSize}
        className={SKELETON_CLASS}
      />
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Skeleton
        variant={SkeletonVariant.Text}
        width="30%"
        height={12}
        className={SKELETON_CLASS}
      />
      <Skeleton
        variant={SkeletonVariant.Text}
        width="60%"
        height={16}
        className={SKELETON_CLASS}
      />
    </div>
  </div>
);

/**
 * The card of a form field that holds one selected entity — a model, an agent,
 * a toolset: its identity, a skeleton while the catalog loads, its raw id when
 * the catalog does not list it, or a placeholder when nothing is selected.
 * aliases: SelectedModelCard|ModelCard|EntityCard
 * Design system 2.0
 *
 * The control that changes the selection lives next to the card, not in it:
 * the card is not interactive.
 *
 * @example
 * ```tsx
 * <SelectedEntityCard
 *   entityId="gpt-4o"
 *   item={{ type: EntityType.Model, name: 'GPT-4o', version: '2024-11-20' }}
 *   isLoading={isLoading}
 *   labels={{ type: t('Model'), placeholder: t('Select model') }}
 * />
 * ```
 *
 * @param entityId - Id of the selected entity, `''` when there is none
 * @param [item] - The selected entity as the catalog lists it
 * @param [isLoading=false] - Whether the catalog is still loading
 * @param [isDisabled=false] - Dims the card
 * @param [error] - Error text under the card; also turns its border red
 * @param [details] - A line under the name
 * @param [labels] - User-visible strings
 * @param [showType=true] - Whether to show the type label
 * @param [iconSize=44] - Icon size in px
 * @param [headingLevel=4] - Heading level of the name
 * @param [className] - Additional CSS classes for the card
 */
export const SelectedEntityCard: FC<SelectedEntityCardProps> = ({
  entityId,
  item,
  isLoading = false,
  isDisabled = false,
  error,
  details,
  labels,
  showType = true,
  iconSize = 44,
  headingLevel = 4,
  className,
}) => {
  const detailsLine =
    details != null ? (
      <span className="dial-caption-text text-secondary">{details}</span>
    ) : undefined;

  const renderContent = (): ReactNode => {
    if (!entityId) {
      return (
        <span className="dial-body-semi-text block truncate text-secondary">
          {labels?.placeholder ?? 'Not selected'}
        </span>
      );
    }
    if (isLoading) return <CardSkeleton iconSize={iconSize} />;
    if (item == null) {
      return (
        <div className="flex flex-col gap-1">
          <span className="dial-body-semi-text block truncate text-secondary">
            {entityId}
          </span>
          {detailsLine}
        </div>
      );
    }
    return (
      <EntityIdentity
        item={item}
        labels={{ type: labels?.type }}
        hasFeaturedTag={false}
        iconSize={iconSize}
        headingLevel={headingLevel}
        nameClassName="dial-body-semi-text"
        showType={showType}
        footer={detailsLine}
      />
    );
  };

  return (
    <div>
      <div
        className={mergeClasses(
          'rounded-2xl border bg-layer-raised p-3',
          error ? 'border-error' : 'border-tertiary',
          isDisabled && 'opacity-50',
          className,
          DIAL_KIT_CLASS.selectedEntityCard,
        )}
      >
        {renderContent()}
      </div>
      <ErrorText text={error} className="mt-1 block" />
    </div>
  );
};
