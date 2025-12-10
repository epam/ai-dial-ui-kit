import { DialPopup } from '@/components/Popup/Popup';
import {
  DialFileManager,
  type DialFileManagerProps,
} from '@/components/FileManager/FileManager';
import { PopupSize } from '@/types/popup';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';
import { IconFolderPlus } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialSwitch } from '@/components/Switch/Switch';
import { useState, useCallback, type FC, useRef } from 'react';
import { DestinationFolderMode } from '@/types/file-manager';
import type { FileManagerActionsRef } from '@/models/file-manager';

export interface DestinationFolderPopupProps extends DialFileManagerProps {
  onClose: () => void;
  onConfirm?: () => void;
  open: boolean;
  setDestinationFolderPath?: (path?: string) => void;
  destinationFolderPath?: string;
  copyLabel?: string;
  moveLabel?: string;
  addFolderLabel?: string;
  hiddenFilesSwitcherLabel?: string;
  mode?: 'copy' | 'move';
  title?: string;
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
 *   title="Copy 3 files"
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
 * @param [mode=DestinationFolderMode.Copy] - Operation mode: 'copy' or 'move'
 * @param [copyLabel="Copy"] - Label for the copy button
 * @param [moveLabel="Move"] - Label for the move button
 * @param [addFolderLabel="Add folder"] - Label for the add folder button
 * @param [hiddenFilesSwitcherLabel="Show hidden files"] - Label for the hidden files toggle
 * @param [title] - Custom title for the popup header
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
  addFolderLabel = 'Add folder',
  mode = DestinationFolderMode.Copy,
  hiddenFilesSwitcherLabel = 'Show hidden files',
  onUploadFiles,
  onValidateUpload,
  maxFileSize,
  title,
  ...restProps
}: DestinationFolderPopupProps) => {
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const fileManagerActionRef = useRef<FileManagerActionsRef>(null);

  const handleShowHiddenFilesChange = useCallback((value: boolean) => {
    setShowHiddenFiles(value);
  }, []);

  const defaultTitle =
    mode === DestinationFolderMode.Copy ? 'Copy to' : 'Move to';

  return (
    <DialPopup
      open={open}
      onClose={() => {
        onClose();
      }}
      size={PopupSize.Lg}
      className={'md:!h-[800px]'}
      footer={
        <div className="flex justify-between space-x-2 py-4 px-6">
          <div className="flex space-x-4">
            <DialButton
              label={addFolderLabel}
              variant={ButtonVariant.Tertiary}
              iconBefore={<IconFolderPlus {...BASE_ICON_PROPS} />}
              onClick={() => {
                fileManagerActionRef.current?.createFolder?.();
              }}
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
              label="Cancel"
              variant={ButtonVariant.Secondary}
            />
            <DialButton
              onClick={onConfirm}
              label={mode === 'copy' ? copyLabel : moveLabel}
              variant={ButtonVariant.Primary}
            />
          </div>
        </div>
      }
      title={title ?? defaultTitle}
    >
      <DialFileManager
        {...restProps}
        actionsRef={fileManagerActionRef}
        showHiddenFiles={showHiddenFiles}
        onShowHiddenFilesChange={handleShowHiddenFilesChange}
        treeOptions={{
          ...restProps.treeOptions,
          collapsed: true,
          expandedPaths: new Set<string>([restProps.rootItem?.path || '/']),
        }}
        gridOptions={{
          withSelectionColumn: false,
          ...restProps.gridOptions,
        }}
        onUploadFiles={onUploadFiles}
        onValidateUpload={onValidateUpload}
        maxFileSize={maxFileSize}
      />
    </DialPopup>
  );
};
