import { useState, type FC } from 'react';
import { IconCaretRightFilled, IconDotsVertical } from '@tabler/icons-react';
import { DialFileNodeType, type DialFile } from '@/models/file';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';
import { DialDropdown } from '../Dropdown/Dropdown';
import { DialIcon } from '../Icon/Icon';
import { DropdownTrigger } from '@/types/dropdown';
import { DialFolderName } from '../FolderName/FolderName';
import { DialFileName } from '../FileName/FileName';
import type { DropdownItem } from '@/models/dropdown';
import classNames from 'classnames';
import { CARET_ICON_PROPS } from './constants';

export interface DialFoldersTreeProps {
  folders: DialFile[];
  expandedFolders: Set<string>;
  renderEmptyState?: React.ReactNode;
  showFiles?: boolean;
  onToggleFolder?: (folder: DialFile) => void;
  getContextMenuItems?: (node: DialFile) => DropdownItem[];
}

export const DialFoldersTree: FC<DialFoldersTreeProps> = ({
  folders,
  expandedFolders,
  onToggleFolder,
  renderEmptyState,
  showFiles,
  getContextMenuItems,
}) => {
  const [selectedFolderPath, setSelectedFolderPath] = useState('');

  const handleFolderClick = (node: DialFile) => {
    setSelectedFolderPath(node.path);
    onToggleFolder?.(node);
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

      const isExpanded = expandedFolders.has(path);
      const isSelected = selectedFolderPath === path;

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
                        <DialFolderName name={name!} />
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
      {renderTree(folders, 0)}
    </div>
  );
};
