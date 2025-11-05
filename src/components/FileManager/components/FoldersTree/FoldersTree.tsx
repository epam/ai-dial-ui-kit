import { useState, type FC, type ReactNode } from 'react';
import { IconCaretRightFilled, IconDotsVertical } from '@tabler/icons-react';
import { DialFileNodeType, type DialFile } from '@/models/file';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { DialIcon } from '@/components/Icon/Icon';
import { DropdownTrigger } from '@/types/dropdown';
import type { DropdownItem } from '@/models/dropdown';
import classNames from 'classnames';
import { CARET_ICON_PROPS, FOLDER_LEVEL_PADDING } from './constants';
import { DialNoDataContent } from '@/components/NoDataContent/NoDataContent';
import { isHiddenDotFile } from '../../utils';
import { DialEditableItemName } from '../../../EditableItemName/EditableItemName';
import { DialItemType } from '@/types/item';

export interface DialFoldersTreeProps {
  items: DialFile[];
  expandedPaths?: Set<string>;
  loadingPaths?: Set<string>;
  selectedPath?: string;
  editedPath?: string;
  showFiles?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: ReactNode;
  onItemClick?: (item: DialFile) => void;
  onEditSave?: (value: string) => void;
  onEditCancel?: () => void;
  onEditValidate?: (value: string, item: DialFile) => string | null;
  getContextMenuItems?: (item: DialFile) => DropdownItem[];
  areHiddenFilesVisible?: boolean;
}

/**
 * DialFoldersTree — A hierarchical folder tree component with nested expand/collapse support, selection highlighting,
 * and optional file display.
 *
 * Provides a fully interactive, recursive folder structure with:
 * - Expandable and collapsible items
 * - Optional file visibility
 * - Loading state indicators for specific paths
 * - Inline name editing support for folders or files
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
 * // With inline editing and validation
 * <DialFoldersTree
 *   items={items}
 *   editedPath="/documents"
 *   onEditValidate={(value) => (value.trim() ? null : 'Name cannot be empty')}
 *   onEditSave={(newValue) => console.log('Saved new name:', newValue)}
 *   onEditCancel={() => console.log('Edit cancelled')}
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
 * @param [selectedPath] - Path representing the currently selected folder or file.
 * @param [editedPath] - Path of the folder or file currently being edited.
 * @param [showFiles=false] - Whether to show files in addition to folders.
 * @param [emptyStateTitle='No Folders'] - Title text displayed when there are no items.
 * @param [emptyStateDescription] - Optional description text for the empty state.
 * @param [emptyStateIcon] - Optional icon to display in the empty state.
 * @param [onItemClick] - Callback fired when a folder or file is clicked (receives the corresponding `DialFile` node).
 * @param [onEditSave] - Callback fired when editing is confirmed with a valid name (receives the new name).
 * @param [onEditCancel] - Callback fired when editing is cancelled.
 * @param [onEditValidate] - Function to validate the new name during editing. Should return an error string or `null` if valid.
 * @param [getContextMenuItems] - Function returning context menu items for a given node.
 * @param [areHiddenFilesVisible=false] - Whether hidden files (dotfiles) should be visible in the tree.
 *
 * @remarks
 * - Folder and file data must follow the `DialFile` model.
 * - The `expandedPaths`, `loadingPaths`, `selectedPath`, and `editedPath` props are externally controlled.
 * - Inline editing is fully customizable using `onEditSave`, `onEditCancel`, and `onEditValidate`.
 * - Context menus can be attached to both folders and files using `getContextMenuItems`.
 * - Use `showFiles={false}` to render only folders for a simplified tree.
 */
export const DialFoldersTree: FC<DialFoldersTreeProps> = ({
  items,
  showFiles = false,
  expandedPaths = new Set(),
  loadingPaths = new Set(),
  selectedPath,
  emptyStateTitle = 'No Folders',
  emptyStateDescription,
  emptyStateIcon,
  areHiddenFilesVisible = false,
  editedPath,
  onItemClick,
  getContextMenuItems,
  onEditSave,
  onEditCancel,
  onEditValidate,
}) => {
  const [expandedItems, setExpandedItems] =
    useState<Set<string>>(expandedPaths);

  const handleFolderClick = (node: DialFile) => {
    onItemClick?.(node);
    if (expandedItems.has(node.path)) {
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(node.path);
        return newSet;
      });
    } else {
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        newSet.add(node.path);
        return newSet;
      });
    }
  };

  const renderTree = (nodes: DialFile[], level: number) => {
    return nodes.map((node) => {
      const { path, nodeType, name, items } = node;

      const isFolder = nodeType === DialFileNodeType.FOLDER;

      if (!areHiddenFilesVisible && isHiddenDotFile(node)) return null;

      if (!isFolder && !showFiles) return;

      const hasValidItems =
        Array.isArray(items) &&
        items.length > 0 &&
        items.some((n) => n.nodeType === DialFileNodeType.FOLDER || showFiles);

      const isExpanded = expandedItems.has(path);
      const isSelected = selectedPath === path;
      const isLoading = loadingPaths.has(path);
      const isEditing = editedPath === path;

      const validateHandler =
        onEditValidate && ((value: string) => onEditValidate(value, node));

      const selectedClass = isSelected
        ? 'bg-accent-primary-alpha border-l-2 border-l-accent-primary rounded'
        : 'border-l-2 border-l-transparent';

      const menuItems = getContextMenuItems?.(node) ?? [];

      return (
        <div key={`${path}-children`} className="cursor-pointer text-secondary">
          <div className="flex flex-col min-w-fit w-full">
            <DialDropdown
              trigger={[DropdownTrigger.ContextMenu]}
              cssClass="w-full"
              anchorToMouse
              menu={{ items: menuItems }}
            >
              <div
                style={{ paddingLeft: `${level * FOLDER_LEVEL_PADDING}px` }}
                className={mergeClasses(
                  'py-1 gap-[2px] dial-small flex justify-between hover:bg-accent-primary-alpha rounded group w-full mb-[2px] relative',
                  selectedClass,
                )}
              >
                {!isEditing && (
                  <div
                    className="absolute size-full left-0 top-0"
                    onClick={() => handleFolderClick(node)}
                  />
                )}
                <div
                  className="flex flex-row truncate items-center w-fit h-6"
                  onClick={() => !isEditing && handleFolderClick(node)}
                >
                  <>
                    {isFolder && (
                      <IconCaretRightFilled
                        {...CARET_ICON_PROPS}
                        className={classNames(
                          'flex-shrink-0',
                          isExpanded && 'rotate-90 transition-all',
                          !hasValidItems && 'text-transparent',
                        )}
                      />
                    )}
                    <DialEditableItemName
                      elementId={`${path}-tree-item`}
                      name={name}
                      type={isFolder ? DialItemType.Folder : DialItemType.File}
                      loading={isLoading}
                      editing={isEditing}
                      onSave={onEditSave}
                      onCancel={onEditCancel}
                      validate={validateHandler}
                    />
                  </>
                </div>

                {menuItems.length > 0 && !isEditing && (
                  <div className="flex-1 flex justify-end">
                    <DialDropdown
                      placement="bottom-start"
                      allowedPlacements={['top-start', 'top-end']}
                      menu={{ items: menuItems }}
                      cssClass="sticky right-0"
                    >
                      <DialIcon
                        className="invisible group-hover:visible text-secondary mx-2 flex flex-row gap-2 hover:text-accent-primary"
                        icon={<IconDotsVertical {...BASE_ICON_PROPS} />}
                      />
                    </DialDropdown>
                  </div>
                )}
              </div>
            </DialDropdown>

            {isExpanded && items && renderTree(items, level + 1)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto">
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
