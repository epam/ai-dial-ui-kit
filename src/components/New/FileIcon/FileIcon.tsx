import type { FC, ReactNode } from 'react';

import { SharedEntityIndicator } from '@/components/New/SharedEntityIndicator/SharedEntityIndicator';
import { Spinner } from '@/components/Spinner/Spinner';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { DialItemType } from '@/types/item';
import { mergeClasses } from '@/utils/merge-classes';
import { getFileGlyphKind } from './constants';
import { FileGlyph } from './icons/FileGlyph';
import { FolderGlyph } from './icons/FolderGlyph';

/** Props for `FileIcon`. */
export interface FileIconProps {
  /** Whether the item is a file or a folder. */
  type: DialItemType;
  /** Item name; a file's extension is read from it unless `fileExtension` is set. */
  name: string;
  /** Extension to pick the glyph by, overriding the one in `name`. With or without a leading dot. */
  fileExtension?: string;
  /** Draws the shared badge in the bottom-left corner. */
  shared?: boolean;
  /** Replaces the glyph with a spinner. */
  loading?: boolean;
  /** Glyph size in px. Defaults to `DIAL_ICON_SIZE.MD` (20). */
  size?: number;
  /** Additional CSS classes for the root element. */
  className?: string;
  /** Hides the icon from assistive technology when the row already names the item. */
  decorative?: boolean;
  /** Accessible name. Defaults to "PDF file", "File" or "Folder", with ", shared" appended when shared. */
  label?: string;
  /** Accessible name of the spinner shown while `loading`. */
  loadingLabel?: string;
  /** Additional CSS classes for the shared badge. */
  sharedIndicatorClassName?: string;
  /** Tooltip shown over the shared badge. */
  sharedIndicatorTooltip?: ReactNode;
}

const getExtension = (name: string, fileExtension?: string): string => {
  const raw =
    fileExtension ?? (name.includes('.') ? name.split('.').pop() : '');

  return (raw ?? '').trim().replace(/^\./, '').toLowerCase();
};

const getDefaultLabel = (type: DialItemType, extension: string): string => {
  if (type === DialItemType.Folder) return 'Folder';

  return extension ? `${extension.toUpperCase()} file` : 'File';
};

const renderGlyph = (
  type: DialItemType,
  extension: string,
  size: number,
): ReactNode => {
  if (type === DialItemType.Folder) {
    return <FolderGlyph size={size} />;
  }

  return <FileGlyph size={size} kind={getFileGlyphKind(extension)} />;
};

/**
 * The icon of a file or folder row in a file manager: a file-type glyph picked
 * by extension, or a folder, with an optional shared badge and loading state.
 * aliases: FileTypeIcon|EntityIcon
 * Design system 2.0
 *
 * The root is a `role="img"` whose name says what the item is, and that it is
 * shared — the badge itself is drawn inside the image, so its tooltip is a
 * pointer-only hint and never the only place the state is conveyed. While
 * `loading`, the root drops the role and holds a `Spinner`, which announces
 * itself as a status. Pass `decorative` when the row already names the item.
 *
 * @example
 * ```tsx
 * <FileIcon name="report.pdf" type={DialItemType.File} shared />
 * <FileIcon name="Projects" type={DialItemType.Folder} loading />
 * ```
 *
 * @param type - Whether the item is a file or a folder
 * @param name - Item name; a file's extension is read from it
 * @param [fileExtension] - Extension overriding the one in `name`
 * @param [shared=false] - Draws the shared badge
 * @param [loading=false] - Replaces the glyph with a spinner
 * @param [size=DIAL_ICON_SIZE.MD] - Glyph size in px
 * @param [className] - Additional CSS classes for the root element
 * @param [decorative=false] - Hides the icon from assistive technology
 * @param [label] - Accessible name, overriding the generated one
 * @param [loadingLabel='Loading'] - Accessible name of the spinner
 * @param [sharedIndicatorClassName] - Additional CSS classes for the shared badge
 * @param [sharedIndicatorTooltip='Shared'] - Tooltip shown over the shared badge
 */
export const FileIcon: FC<FileIconProps> = ({
  type,
  name,
  fileExtension,
  shared = false,
  loading = false,
  size = DIAL_ICON_SIZE.MD,
  className,
  decorative = false,
  label,
  loadingLabel = 'Loading',
  sharedIndicatorClassName,
  sharedIndicatorTooltip,
}) => {
  if (type !== DialItemType.File && type !== DialItemType.Folder) {
    return null;
  }

  const extension =
    type === DialItemType.File ? getExtension(name, fileExtension) : '';
  const defaultLabel = getDefaultLabel(type, extension);
  const accessibleName =
    label ?? (shared ? `${defaultLabel}, shared` : defaultLabel);

  const a11yProps = decorative
    ? { 'aria-hidden': true }
    : loading
      ? {}
      : { role: 'img', 'aria-label': accessibleName };

  return (
    <span
      className={mergeClasses(
        'relative inline-flex shrink-0 items-center justify-center text-secondary',
        className,
        DIAL_KIT_CLASS.fileIcon,
      )}
      {...a11yProps}
    >
      {loading ? (
        <Spinner size={size} ariaLabel={loadingLabel} />
      ) : (
        renderGlyph(type, extension, size)
      )}
      {shared && (
        <SharedEntityIndicator
          tooltip={sharedIndicatorTooltip}
          className={mergeClasses(
            'absolute -bottom-0.5 -left-0.5',
            sharedIndicatorClassName,
          )}
        />
      )}
    </span>
  );
};
