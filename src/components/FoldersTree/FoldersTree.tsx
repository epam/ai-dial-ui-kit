import { useState, type FC } from 'react';
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
import { CARET_ICON_PROPS } from './constants';

export interface DialFoldersTreeProps {
  items: DialFile[];
  expandedPaths?: Set<string>;
  loadingPaths?: Set<string>;
  renderEmptyState?: React.ReactNode;
  showFiles?: boolean;
  onItemClick?: (item: DialFile) => void;
  getContextMenuItems?: (item: DialFile) => DropdownItem[];
}

/**
 * DialFoldersTree — A hierarchical folder tree component with nested expand/collapse support and optional file display.
 *
 * Provides a fully interactive, recursive folder structure with:
 * - Expandable/collapsible items
 * - Optional file visibility
 * - Loading state indicators for specific paths
 * - Context menu integration via DialDropdown
 * - Visual selection highlighting
 * - Recursive rendering with indentation and icons
 * - Empty state rendering when no data is available
 *
 * @example
 * ```tsx
 * const getContextMenuItems = (node: DialFile): DropdownItem[] => [
 *   { key: 'rename', label: 'Rename' },
 *   { key: 'delete', label: 'Delete' },
 * ];
 *
 * <DialFoldersTree
 *   items={items}
 *   getContextMenuItems={getContextMenuItems}
 *   showFiles
 *   onItemsClick={(item) => console.log('Selected:', item.path)}
 * />
 * ```
 *
 * @param [items] - Array of folder and file nodes to display in the tree
 * @param [expandedPaths] - Set of folder paths that should be expanded
 * @param [loadingPaths] - Set of folder paths currently loading (shows spinner or placeholder)
 * @param [renderEmptyState] - React node to render when the folder list is empty
 * @param [showFiles=false] - Whether to show files in addition to folders
 * @param [onItemClick] - Callback fired when a folder is clicked (receives the corresponding node)
 * @param [getContextMenuItems] - Function returning context menu items for a given node
 *
 * @remarks
 * - Folder and file data must follow the `DialFile` model.
 * - The `expandedFolders` and `loadingPaths` props are externally controlled; the component itself only tracks selection state internally.
 * - Context menus can be attached to both folders and files, depending on `getContextMenuItems`.
 */
export const DialFoldersTree: FC<DialFoldersTreeProps> = ({
  items,
  expandedPaths = new Set(),
  loadingPaths = new Set(),
  renderEmptyState,
  showFiles,
  onItemClick,
  getContextMenuItems,
}) => {
  const [selectedItemPath, setSelectedItemPath] = useState('');

  const handleFolderClick = (node: DialFile) => {
    setSelectedItemPath(node.path);
    onItemClick?.(node);
  };

  const renderTree = (nodes: DialFile[], level: number) => {
    if (!nodes?.length) return renderEmptyState ?? null;

    return nodes.map((node) => {
      const { path, nodeType, name, items } = node;

      const isFolder = nodeType === DialFileNodeType.FOLDER;

      if (!isFolder && !showFiles) return;

      const hasValidItems =
        Array.isArray(items) &&
        items.length > 0 &&
        items.some((n) => n.nodeType === DialFileNodeType.FOLDER || showFiles);

      const isExpanded = expandedPaths.has(path);
      const isSelected = selectedItemPath === path;
      const isLoading = loadingPaths.has(path);

      const selectedClass = isSelected
        ? 'bg-accent-primary-alpha border-l-2 border-l-accent-primary rounded'
        : 'border-l-2 border-l-transparent';

      const menuItems = getContextMenuItems?.(node) ?? [];

      return (
        <div key={`${path}-children`} className="cursor-pointer text-secondary">
          <div className="flex flex-col">
            <div
              style={{ paddingLeft: `${level * 26}px` }}
              className={mergeClasses(
                'py-[6px] pr-[6px] gap-[2px] dial-small flex justify-between hover:bg-layer-3 rounded group w-full',
                selectedClass,
              )}
            >
              <div
                onClick={() => handleFolderClick(node as DialFile)}
                className="w-full"
              >
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
                    className="invisible group-hover:visible text-secondary mx-2 flex flex-row gap-2"
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
