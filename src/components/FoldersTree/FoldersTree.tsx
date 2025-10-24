import type { FC, ReactNode } from 'react';
import { IconCaretRightFilled, IconDotsVertical } from '@tabler/icons-react';
import { DialFileNodeType, type DialFile } from '@/models/file';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { DropdownTrigger } from '@/types/dropdown';
import { DialFolderName } from '@/components/FolderName/FolderName';
import { DialFileName } from '@/components/FileName/FileName';
import type { DropdownItem } from '@/models/dropdown';
import classNames from 'classnames';
import { CARET_ICON_PROPS, FOLDER_LEVEL_PADDING } from './constants';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';

export interface DialFoldersTreeProps {
  items: DialFile[];
  expandedPaths?: Set<string>;
  loadingPaths?: Set<string>;
  selectedPaths?: Set<string>;
  showFiles?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: ReactNode;
  onItemClick?: (item: DialFile) => void;
  getContextMenuItems?: (item: DialFile) => DropdownItem[];
}

/**
 * DialFoldersTree — A hierarchical folder tree component with nested expand/collapse support, selection highlighting,
 * and optional file display.
 *
 * Provides a fully interactive, recursive folder structure with:
 * - Expandable and collapsible items
 * - Optional file visibility
 * - Loading state indicators for specific paths
 * - Multi-item selection highlighting
 * - Context menu integration via `DialDropdown`
 * - Recursive rendering with indentation and icons
 * - Customizable empty state (title, description, and icon)
 *
 * @example
 * ```tsx
 * // Basic usage with folders and files
 * const items: DialFile[] = [
 *   {
 *     path: '/documents',
 *     name: 'Documents',
 *     nodeType: DialFileNodeType.FOLDER,
 *     items: [
 *       {
 *         path: '/documents/file.txt',
 *         name: 'file.txt',
 *         nodeType: DialFileNodeType.FILE,
 *       },
 *     ],
 *   },
 * ];
 *
 * <DialFoldersTree items={items} showFiles />
 *
 * // With expanded and selected items
 * const expandedPaths = new Set(['/documents']);
 * const selectedPaths = new Set(['/documents/file.txt']);
 *
 * <DialFoldersTree
 *   items={items}
 *   expandedPaths={expandedPaths}
 *   selectedPaths={selectedPaths}
 *   onItemClick={(item) => console.log('Clicked:', item.path)}
 * />
 *
 * // With custom empty state and context menu
 * const getContextMenuItems = (item: DialFile): DropdownItem[] => [
 *   { key: 'rename', label: 'Rename' },
 *   { key: 'delete', label: 'Delete', danger: true },
 * ];
 *
 * <DialFoldersTree
 *   items={[]}
 *   emptyStateTitle="No Content"
 *   emptyStateDescription="Upload files or create a new folder to get started."
 *   emptyStateIcon={<IconFolderPlus />}
 *   getContextMenuItems={getContextMenuItems}
 * />
 * ```
 *
 * @param [items] - Array of folder and file nodes to display in the tree.
 * @param [expandedPaths] - Set of folder paths that should be expanded.
 * @param [loadingPaths] - Set of folder paths currently loading (shows spinner or placeholder).
 * @param [selectedPaths] - Set of paths representing currently selected folders or files.
 * @param [showFiles=false] - Whether to show files in addition to folders.
 * @param [emptyStateTitle='No Folders'] - Title text displayed when there are no items.
 * @param [emptyStateDescription] - Optional description text for the empty state.
 * @param [emptyStateIcon] - Optional icon to display in the empty state.
 * @param [onItemClick] - Callback fired when a folder or file is clicked (receives the corresponding `DialFile` node).
 * @param [getContextMenuItems] - Function returning context menu items for a given node.
 *
 * @remarks
 * - Folder and file data must follow the `DialFile` model.
 * - The `expandedPaths`, `loadingPaths`, and `selectedPaths` props are externally controlled; the component itself does not manage them internally.
 * - Context menus can be attached to both folders and files using `getContextMenuItems`.
 * - Use `showFiles={false}` to render only folders for a simplified tree.
 */
export const DialFoldersTree: FC<DialFoldersTreeProps> = ({
  items,
  showFiles,
  expandedPaths = new Set(),
  loadingPaths = new Set(),
  selectedPaths = new Set(),
  emptyStateTitle = 'No Folders',
  emptyStateDescription,
  emptyStateIcon,
  onItemClick,
  getContextMenuItems,
}) => {
  const handleFolderClick = (node: DialFile) => {
    onItemClick?.(node);
  };

  const renderTree = (nodes: DialFile[], level: number) => {
    if (!nodes?.length)
      return (
        <DialNoDataContent
          title={emptyStateTitle}
          description={emptyStateDescription}
          icon={emptyStateIcon}
        />
      );

    return nodes.map((node) => {
      const { path, nodeType, name, items } = node;

      const isFolder = nodeType === DialFileNodeType.FOLDER;

      if (!isFolder && !showFiles) return;

      const hasValidItems =
        Array.isArray(items) &&
        items.length > 0 &&
        items.some((n) => n.nodeType === DialFileNodeType.FOLDER || showFiles);

      const isExpanded = expandedPaths.has(path);
      const isSelected = selectedPaths.has(path);
      const isLoading = loadingPaths.has(path);

      const selectedClass = isSelected
        ? 'bg-accent-primary-alpha border-l-2 border-l-accent-primary rounded'
        : 'border-l-2 border-l-transparent';

      const menuItems = getContextMenuItems?.(node) ?? [];

      return (
        <div key={`${path}-children`} className="cursor-pointer text-secondary">
          <div className="flex flex-col">
            <div
              style={{ paddingLeft: `${level * FOLDER_LEVEL_PADDING}px` }}
              className={mergeClasses(
                'py-[6px] pr-[6px] gap-[2px] dial-small flex justify-between hover:bg-accent-primary-alpha rounded group w-full mb-[2px]',
                selectedClass,
              )}
            >
              <div onClick={() => handleFolderClick(node)} className="w-full">
                <DialDropdown
                  trigger={[DropdownTrigger.ContextMenu]}
                  cssClass="w-full"
                  anchorToMouse
                  menu={{ items: menuItems }}
                >
                  <div className="flex-1 flex flex-row truncate items-center">
                    {!isFolder ? (
                      <DialFileName name={name!} />
                    ) : (
                      <>
                        <IconCaretRightFilled
                          {...CARET_ICON_PROPS}
                          className={classNames(
                            'flex-shrink-0',
                            isExpanded && 'rotate-90 transition-all',
                            !hasValidItems && 'text-transparent',
                          )}
                        />
                        <DialFolderName name={name!} loading={isLoading} />
                      </>
                    )}
                  </div>
                </DialDropdown>
              </div>

              {menuItems.length > 0 && (
                <DialDropdown
                  placement="bottom-start"
                  allowedPlacements={['top-start', 'top-end']}
                  menu={{ items: menuItems }}
                >
                  <DialIcon
                    className="invisible group-hover:visible text-secondary mx-2 flex flex-row gap-2 hover:text-accent-primary"
                    icon={<IconDotsVertical {...BASE_ICON_PROPS} />}
                  />
                </DialDropdown>
              )}
            </div>

            {isExpanded && items && renderTree(items, level + 1)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto">
      {renderTree(items, 0)}
    </div>
  );
};
