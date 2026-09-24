import type { FC } from 'react';

import {
  FileName,
  type FileNameProps,
} from '@/components/New/FileName/FileName';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { DialItemType } from '@/types/item';
import { mergeClasses } from '@/utils/merge-classes';

/** Props for `FolderName`. */
export type FolderNameProps = Omit<FileNameProps, 'type' | 'fileExtension'>;

/**
 * A folder name with the folder icon, truncated with a tooltip when it does
 * not fit.
 * aliases: FolderDisplay|DirectoryName
 * Design system 2.0
 *
 * A `FileName` fixed to `DialItemType.Folder`, so it shares every behaviour of
 * it — decorative icon, visually-hidden shared label, `details` line and the
 * `loading` spinner. Its root carries `dial-kit-folder-name` on top of
 * `dial-kit-file-name`.
 *
 * @example
 * ```tsx
 * <FolderName name="Organization" shared />
 * <FolderName name="Uploads" loading />
 * ```
 *
 * @param name - Folder name
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
export const FolderName: FC<FolderNameProps> = ({ className, ...props }) => (
  <FileName
    {...props}
    type={DialItemType.Folder}
    className={mergeClasses(className, DIAL_KIT_CLASS.folderName)}
  />
);
