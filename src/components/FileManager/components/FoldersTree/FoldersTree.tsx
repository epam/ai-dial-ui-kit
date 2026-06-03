import { type FC, type ReactNode } from 'react';
import { IconCaretRightFilled, IconDotsVertical } from '@tabler/icons-react';
import { DialFileNodeType, type DialFile } from '@/models/file';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { DropdownTrigger } from '@/types/dropdown';
import type { DropdownItem } from '@/models/dropdown';
import classNames from 'classnames';
import {
  CARET_ICON_PROPS,
  FOLDER_LEVEL_PADDING,
  NEW_FOLDER_TEMP_NAME,
} from './constants';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import {
  getForbiddenSymbolsTooltip,
  isHiddenDotFile,
} from '@/components/FileManager/utils';
import { DialFileManagerItemName } from '@/components/FileManager/components/FileManagerItemName/FileManagerItemName';
import { DialItemType } from '@/types/item';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';
import { useExpandedPaths } from './hooks/use-expanded-paths';

export interface DialFoldersTreeProps {
  items: DialFile[];
  expandedPaths?: Set<string>;
  loadingPaths?: Set<string>;
  loadedPaths?: Set<string>;
  sharedByMePaths?: Set<string>;
  selectedPath?: string;
  renamedPath?: string;
  createdFolderPath?: string | null;
  showFiles?: boolean;
  rootItemPath?: string;
  rootItemLabel?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: ReactNode;
  onItemClick?: (item: DialFile) => void;
  onRenameSave?: (value: string) => void;
  onRenameCancel?: () => void;
  onRenameValidate?: (value: string, item: DialFile) => string | null;
  onCreateFolderSave?: (value: string) => void;
  onCreateFolderCancel?: () => void;
  getContextMenuItems?: (item: DialFile) => DropdownItem[];
  areHiddenFilesVisible?: boolean;
  onExpandedPathsChange?: (expandedPaths: Set<string>) => void;
  forbiddenSymbolsRegExp?: RegExp;
  forbiddenSymbolsTooltip?: ReactNode;
  newFolderDefaultName?: string;
}

/**
 * DialFoldersTree — A hierarchical folder tree component with nested expand/collapse support, selection highlighting,
 * and optional file display.
 *
 * Provides a fully interactive, recursive folder structure with:
 * - Expandable and collapsible items
 * - Optional file visibility
 * - Loading state indicators for specific paths
 * - Inline renaming support for folders or files
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
 *
 * <DialFoldersTree
 *   items={items}
 *   expandedPaths={expandedPaths}
 *   selectedPath="/documents/file.txt"
 *   onItemClick={(item) => console.log('Clicked:', item.path)}
 * />
 *
 * // With inline renaming and validation
 * <DialFoldersTree
 *   items={items}
 *   renamedPath="/documents"
 *   onRenameValidate={(value) => (value.trim() ? null : 'Name cannot be empty')}
 *   onRenameSave={(newValue) => console.log('Saved new name:', newValue)}
 *   onRenameCancel={() => console.log('Edit cancelled')}
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
 * @param [loadedPaths] - Set of folder paths that have loaded.
 * @param [sharedByMePaths] - Set of items paths that the user has shared with others. Enables UI indicators (icons/badges).
 * @param [selectedPath] - Path representing the currently selected folder or file.
 * @param [renamedPath] - Path of the folder or file currently being edited.
 * @param [showFiles=false] - Whether to show files in addition to folders.
 * @param [emptyStateTitle='No Folders'] - Title text displayed when there are no items.
 * @param [emptyStateDescription] - Optional description text for the empty state.
 * @param [emptyStateIcon] - Optional icon to display in the empty state.
 * @param [onItemClick] - Callback fired when a folder or file is clicked (receives the corresponding `DialFile` node).
 * @param [onRenameSave] - Callback fired when editing is confirmed with a valid name (receives the new name).
 * @param [onRenameCancel] - Callback fired when editing is cancelled.
 * @param [onRenameValidate] - Function to validate the new name during editing. Should return an error string or `null` if valid.
 * @param [getContextMenuItems] - Function returning context menu items for a given node.
 * @param [areHiddenFilesVisible=false] - Whether hidden files (dotfiles) should be visible in the tree.
 * @param [rootItemPath] - Path of the folder to treat as the custom root node (no context menu, special label).
 * @param [rootItemLabel] - Label to display for the root node instead of its actual name.
 * @param [forbiddenSymbolsRegExp] - Optional RegExp used to validate folder and file names for forbidden characters.
 * @param [forbiddenSymbolsTooltip] - Optional tooltip content displayed when a name contains forbidden characters.
 * @param [createdFolderPath] - Optional Path of the new created folder.
 * @param [onCreateFolderSave] - Optional Callback fired when create new folder is confirmed
 * @param [onCreateFolderCancel] - Optional Callback fired when create new folder is cancelled
 * @param [newFolderDefaultName] - Optional new folder default name.
 * @remarks
 * - Folder and file data must follow the `DialFile` model.
 * - The `expandedPaths`, `loadingPaths`, `selectedPath`, and `renamedPath` props are externally controlled.
 * - Inline renaming is fully customizable using `onRenameSave`, `onRenameCancel`, and `onRenameValidate`.
 * - Context menus can be attached to both folders and files using `getContextMenuItems`.
 * - Use `showFiles={false}` to render only folders for a simplified tree.
 */
export const DialFoldersTree: FC<DialFoldersTreeProps> = ({
  items,
  showFiles = false,
  expandedPaths: externalExpandedPaths,
  loadingPaths = new Set(),
  loadedPaths = new Set(),
  sharedByMePaths = new Set(),
  selectedPath,
  emptyStateTitle = 'No Folders',
  emptyStateDescription,
  emptyStateIcon,
  areHiddenFilesVisible = false,
  renamedPath,
  createdFolderPath,
  rootItemLabel,
  rootItemPath,
  onItemClick,
  getContextMenuItems,
  onRenameSave,
  onRenameCancel,
  onRenameValidate,
  onExpandedPathsChange,
  onCreateFolderSave,
  onCreateFolderCancel,
  forbiddenSymbolsRegExp,
  forbiddenSymbolsTooltip,
  newFolderDefaultName,
}) => {
  const { expandedPaths, togglePath } = useExpandedPaths({
    expandedPaths: externalExpandedPaths ?? new Set(),
    onExpandedPathsChange,
  });

  const handleFolderClick = (node: DialFile) => {
    onItemClick?.(node);
    togglePath(node.path);
  };

  const renderTree = (
    nodes: DialFile[],
    level: number,
    parentNode?: DialFile,
  ) => {
    let newNodes = nodes;
    if (parentNode && parentNode.path === createdFolderPath) {
      newNodes = [
        {
          folderId: NEW_FOLDER_TEMP_NAME,
          id: NEW_FOLDER_TEMP_NAME,
          items: [],
          name: newFolderDefaultName || '',
          nodeType: DialFileNodeType.FOLDER,
          parentPath: createdFolderPath,
          path: `${createdFolderPath}/${NEW_FOLDER_TEMP_NAME}`,
        },
        ...nodes,
      ];
    }
    return newNodes.map((node) => {
      const { path, nodeType, name, items } = node;

      const isFolder = nodeType === DialFileNodeType.FOLDER;

      if (!areHiddenFilesVisible && isHiddenDotFile(node)) return null;

      if (!isFolder && !showFiles) return;

      const hasValidItems =
        Array.isArray(items) &&
        items.length > 0 &&
        items.some((n) => n.nodeType === DialFileNodeType.FOLDER || showFiles);

      const isExpanded = expandedPaths.has(path);
      const isSelected = selectedPath === path;
      const isLoading = loadingPaths.has(path);
      const isRenaming =
        renamedPath === path ||
        path === `${createdFolderPath}/${NEW_FOLDER_TEMP_NAME}`;
      const isLoaded = loadedPaths.has(path);
      const isSharedByMe = sharedByMePaths.has(path);
      const isRootFolder =
        rootItemPath && rootItemLabel && path === rootItemPath && isFolder;

      const validateHandler =
        onRenameValidate && ((value: string) => onRenameValidate(value, node));

      const selectedClass = isSelected
        ? 'bg-accent-primary-alpha border-l-2 border-l-accent-primary rounded'
        : 'border-l-2 border-l-transparent';

      const menuItems = isRootFolder ? [] : (getContextMenuItems?.(node) ?? []);
      const tooltipContent = forbiddenSymbolsRegExp
        ? getForbiddenSymbolsTooltip(
            { name: node.name, isFolder },
            forbiddenSymbolsRegExp,
            forbiddenSymbolsTooltip,
          )
        : undefined;

      return (
        <div key={`${path}-children`} className="cursor-pointer text-secondary">
          <div className="flex flex-col w-full" aria-label="folder">
            <DialDropdown
              trigger={[DropdownTrigger.ContextMenu]}
              className="w-full"
              anchorToMouse
              items={menuItems}
            >
              <div
                style={{ paddingLeft: `${level * FOLDER_LEVEL_PADDING}px` }}
                className={mergeClasses(
                  'py-1 gap-[2px] dial-small-text flex justify-between hover:bg-accent-primary-alpha rounded group/item w-full mb-[2px] relative',
                  selectedClass,
                )}
                aria-selected={isSelected}
              >
                {!isRenaming && (
                  <div
                    className="absolute size-full left-0 top-0 z-0"
                    onClick={() => handleFolderClick(node)}
                  />
                )}
                <div
                  className="relative flex flex-row truncate items-center w-fit h-6 gap-x-1 pl-1"
                  onClick={() => !isRenaming && handleFolderClick(node)}
                >
                  <>
                    {isFolder && (
                      <IconCaretRightFilled
                        {...CARET_ICON_PROPS}
                        className={classNames(
                          'flex-shrink-0',
                          isExpanded && 'rotate-90 transition-all',
                          isLoaded && !hasValidItems && 'text-transparent',
                        )}
                      />
                    )}
                    <DialFileManagerItemName
                      elementId={`${path}-tree-item`}
                      name={isRootFolder ? rootItemLabel : name}
                      type={isFolder ? DialItemType.Folder : DialItemType.File}
                      loading={isLoading}
                      shared={isSharedByMe}
                      sharedIndicatorClassName={mergeClasses(
                        'group-hover/item:bg-accent-primary-alpha',
                        isSelected && 'bg-accent-primary-alpha',
                      )}
                      iconSize={BASE_FILE_MANAGER_ICON_SIZE}
                      forbiddenSymbolsRegExp={forbiddenSymbolsRegExp}
                      forbiddenSymbolsTooltip={tooltipContent}
                      {...(!isRootFolder && {
                        editing: isRenaming,
                        creating:
                          path ===
                          `${createdFolderPath}/${NEW_FOLDER_TEMP_NAME}`,
                        onSave: onRenameSave,
                        onCancel: onRenameCancel,
                        validate: validateHandler,
                        onCreateFolderSave: onCreateFolderSave,
                        onCreateFolderCancel: onCreateFolderCancel,
                      })}
                    />
                  </>
                </div>

                {menuItems.length > 0 && !isRenaming && !isRootFolder && (
                  <div className="flex-1 flex justify-end">
                    <DialDropdown
                      placement="bottom-start"
                      allowedPlacements={['top-start', 'top-end']}
                      items={menuItems}
                      className="sticky right-0"
                    >
                      <DialIcon
                        className="invisible group-hover/item:visible text-secondary mx-2 flex flex-row gap-2 hover:text-accent-primary"
                        icon={<IconDotsVertical {...BASE_ICON_PROPS} />}
                      />
                    </DialDropdown>
                  </div>
                )}
              </div>
            </DialDropdown>

            {isExpanded &&
              (items || node?.path === createdFolderPath) &&
              renderTree(items || [], level + 1, node)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 size-full overflow-y-auto" aria-label="folders-tree">
      {items.length > 0 ? (
        renderTree(items, 0)
      ) : (
        <DialNoDataContent
          title={emptyStateTitle}
          description={emptyStateDescription}
          icon={emptyStateIcon}
        />
      )}
    </div>
  );
};
