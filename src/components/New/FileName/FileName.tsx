import type { FC, ReactNode } from 'react';

import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { FileIcon } from '@/components/New/FileIcon/FileIcon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { DialItemType } from '@/types/item';
import { mergeClasses } from '@/utils/merge-classes';

/** Props for `FileName`. */
export interface FileNameProps {
  /** Full item name, with or without an extension. */
  name: string;
  /** Whether the item is a file or a folder. Defaults to a file. */
  type?: DialItemType;
  /** Extension to pick the icon by, overriding the one in `name`. */
  fileExtension?: string;
  /** Draws the shared badge on the icon. */
  shared?: boolean;
  /** Replaces the icon with a spinner, which announces itself as a status. */
  loading?: boolean;
  /** Accessible name of the spinner shown while `loading`. */
  loadingLabel?: string;
  /** Icon size in px. Defaults to the `FileIcon` size (20). */
  iconSize?: number;
  /** Metadata under the name (size, date); switches the text to two lines. */
  details?: ReactNode;
  /** Mutes the name, marking it as containing invalid characters. */
  isInvalidName?: boolean;
  /** Additional CSS classes for the root element. */
  className?: string;
  /** Additional CSS classes for the name text. */
  nameClassName?: string;
  /** Additional CSS classes for the shared badge. */
  sharedIndicatorClassName?: string;
  /** Tooltip shown over the shared badge. */
  sharedIndicatorTooltip?: ReactNode;
  /** Screen-reader text announcing the shared state. */
  sharedLabel?: string;
  /** Suppresses the full-name tooltip even while the name is truncated. */
  hideTooltip?: boolean;
  /** Shown instead of the full name while it is truncated. */
  tooltipContent?: ReactNode;
}

/**
 * A file or folder name with its type icon, truncated with a tooltip when it
 * does not fit.
 * aliases: FileDisplay|NameDisplay
 * Design system 2.0
 *
 * The visible name already says what the item is, so the icon is decorative;
 * the shared state, which only the badge shows, is announced by a
 * visually-hidden `sharedLabel` after the name instead.
 *
 * While `loading` the icon is swapped for a `Spinner`, which is left in the
 * accessibility tree so the busy state is announced.
 *
 * With `details` the text switches to two lines — the name, then the metadata.
 *
 * @example
 * ```tsx
 * <FileName name="Document.pdf" shared />
 * <FileName
 *   name="Document.pdf"
 *   details={<span className="dial-tiny-text text-secondary">24 KB · Jul 20</span>}
 * />
 * ```
 *
 * @param name - Full item name, with or without an extension
 * @param [type=DialItemType.File] - Whether the item is a file or a folder
 * @param [fileExtension] - Extension overriding the one in `name`
 * @param [shared=false] - Draws the shared badge on the icon
 * @param [loading=false] - Replaces the icon with a spinner
 * @param [loadingLabel='Loading'] - Accessible name of the spinner
 * @param [iconSize] - Icon size in px
 * @param [details] - Metadata under the name
 * @param [isInvalidName=false] - Mutes the name, marking it as invalid
 * @param [className] - Additional CSS classes for the root element
 * @param [nameClassName] - Additional CSS classes for the name text
 * @param [sharedIndicatorClassName] - Additional CSS classes for the shared badge
 * @param [sharedIndicatorTooltip='Shared'] - Tooltip shown over the shared badge
 * @param [sharedLabel='Shared'] - Screen-reader text announcing the shared state
 * @param [hideTooltip=false] - Suppresses the full-name tooltip
 * @param [tooltipContent] - Shown instead of the full name while truncated
 */
export const FileName: FC<FileNameProps> = ({
  name,
  type = DialItemType.File,
  fileExtension,
  shared = false,
  loading = false,
  loadingLabel,
  iconSize,
  details,
  isInvalidName = false,
  className,
  nameClassName,
  sharedIndicatorClassName,
  sharedIndicatorTooltip,
  sharedLabel = 'Shared',
  hideTooltip = false,
  tooltipContent,
}) => (
  <div
    className={mergeClasses(
      'flex w-full min-w-0 items-center gap-2',
      className,
      DIAL_KIT_CLASS.fileName,
    )}
  >
    <FileIcon
      name={name}
      type={type}
      fileExtension={fileExtension}
      shared={shared}
      loading={loading}
      loadingLabel={loadingLabel}
      size={iconSize}
      sharedIndicatorClassName={sharedIndicatorClassName}
      sharedIndicatorTooltip={sharedIndicatorTooltip}
      decorative={!loading}
    />
    <div
      className={mergeClasses('flex min-w-0 flex-1', {
        'flex-col gap-1': !!details,
      })}
    >
      <EllipsisTooltip
        className={mergeClasses(
          'dial-small-paragraph-text',
          isInvalidName ? 'text-secondary' : 'text-primary',
          nameClassName,
        )}
        text={name}
        hideTooltip={hideTooltip}
        customTooltipContent={tooltipContent}
      />
      {shared && <span className="sr-only">{sharedLabel}</span>}
      {details}
    </div>
  </div>
);
