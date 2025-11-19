import { DialPopup } from '@/components/Popup/Popup';
import { DialFileManager, type DialFileManagerProps } from '../../FileManager';
import { PopupSize } from '@/types/popup';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';
import { IconFolderPlus } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialSwitch } from '@/components/Switch/Switch';
import { useState, useCallback, type FC } from 'react';

export interface DestinationFolderPopupProps extends DialFileManagerProps {
  onClose: () => void;
  onConfirm?: () => void;
  open: boolean;
  setDestinationFolderPath?: (path?: string) => void;
  destinationFolderPath?: string;
  copyLabel?: string;
  moveLabel?: string;
  hiddenFilesSwitcherLabel?: string;
  mode?: 'copy' | 'move';
}

/**
 * DestinationFolderPopup
 *
 * A popup dialog for selecting a destination folder when copying or moving files.
 * Displays a File Manager interface with a footer containing action buttons and
 * a toggle for showing hidden files.
 *
 * @example
 * ```tsx
 * <DestinationFolderPopup
 *   open={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleConfirm}
 *   mode="copy"
 *   items={files}
 *   rootItem={rootFolder}
 *   path={currentPath}
 *   onPathChange={setCurrentPath}
 * />
 * ```
 *
 * @param open - Whether the popup is visible
 * @param onClose - Callback fired when the popup is closed
 * @param [onConfirm] - Callback fired when the confirm button is clicked
 * @param [mode="copy"] - Operation mode: 'copy' or 'move'
 * @param [copyLabel="Copy"] - Label for the copy button
 * @param [moveLabel="Move"] - Label for the move button
 * @param [hiddenFilesSwitcherLabel="Show hidden files"] - Label for the hidden files toggle
 * @param items - Array of files to display in the File Manager
 * @param rootItem - Root folder item
 * @param path - Current path in the File Manager
 * @param onPathChange - Callback fired when the path changes
 */
export const DestinationFolderPopup: FC<DestinationFolderPopupProps> = ({
  onClose,
  onConfirm,
  open,
  copyLabel = 'Copy',
  moveLabel = 'Move',
  mode = 'copy',
  hiddenFilesSwitcherLabel = 'Show hidden files',
  ...restProps
}: DestinationFolderPopupProps) => {
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);

  const handleShowHiddenFilesChange = useCallback((value: boolean) => {
    setShowHiddenFiles(value);
  }, []);

  return (
    <DialPopup
      open={open}
      onClose={() => {
        onClose();
      }}
      size={PopupSize.Lg}
      footer={
        <div className="flex justify-between space-x-2 py-4 px-6">
          <div className="flex space-x-4">
            <DialButton
              title="Add folder"
              variant={ButtonVariant.Tertiary}
              iconBefore={<IconFolderPlus {...BASE_ICON_PROPS} />}
            />
            <div className="border border-l border-primary my-2" />
            <div
              className="inline-flex items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleShowHiddenFilesChange(!showHiddenFiles);
              }}
            >
              <DialSwitch
                title={hiddenFilesSwitcherLabel}
                isOn={showHiddenFiles}
                onChange={handleShowHiddenFilesChange}
                switchId="hidden-files-switch"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <DialButton
              onClick={onClose}
              title="Cancel"
              variant={ButtonVariant.Secondary}
            />
            <DialButton
              onClick={onConfirm}
              title={mode === 'copy' ? copyLabel : moveLabel}
              variant={ButtonVariant.Primary}
            />
          </div>
        </div>
      }
    >
      <DialFileManager
        {...restProps}
        showHiddenFiles={showHiddenFiles}
        onShowHiddenFilesChange={handleShowHiddenFilesChange}
        treeOptions={{
          ...restProps.treeOptions,
          collapsed: true,
          expandedPaths: new Set<string>([restProps.rootItem?.path || '/']),
        }}
      />
    </DialPopup>
  );
};
