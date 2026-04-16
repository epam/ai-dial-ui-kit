import { DialPopup } from '@/components/Popup/Popup';
import {
  DialFileManager,
  type DialFileManagerProps,
} from '@/components/FileManager/FileManager';
import { PopupSize } from '@/types/popup';
import {
  DialPrimaryButton,
  DialNeutralButton,
} from '@/components/Button/ButtonWrappers';
import { DialButton } from '@/components/Button/Button';
import { ButtonAppearance } from '@/types/button';
import { IconFolderPlus, IconDotsVertical, IconEye } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialSwitch } from '@/components/Switch/Switch';
import {
  useState,
  useCallback,
  type FC,
  useRef,
  type ReactNode,
  useMemo,
} from 'react';
import { DestinationFolderMode } from '@/types/file-manager';
import type { DialFileManagerActionsRef } from '@/models/file-manager';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import { mergeClasses } from '@/utils/merge-classes';
import { DialAlert, type DialAlertProps } from '@/components/Alert/Alert';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import { useIsMobileScreen } from '@/hooks/use-is-mobile-screen';
import type { DropdownItem } from '@/models/dropdown';

export interface DestinationFolderPopupProps extends DialFileManagerProps {
  onClose: () => void;
  onConfirm?: () => void;
  open: boolean;
  setDestinationFolderPath?: (path?: string) => void;
  destinationFolderPath?: string;
  copyLabel?: string;
  moveLabel?: string;
  addFolderLabel?: string;
  showHiddenFileSwitcher?: boolean;
  hiddenFilesSwitcherLabel?: string;
  mode?: 'copy' | 'move';
  header?: ReactNode;
  sourceFolder?: string;
  disabledPathTooltip?: string;
  collapsedFileTree?: boolean;
  alertProps?: DialAlertProps;
  onFolderPopupPathChange?: (newPath?: string) => void;
}

/**
 * DestinationFolderPopup
 * aliases: FolderSelector|PathChooser
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
 * @param [sourceFolder] - The source folder path for move operations
 * @param [disabledPathTooltip="Unavailable for the original path. Please select another folder"] - Tooltip text when destination is disabled
 * @param [collapsedFileTree=false] - Whether the file tree should be initially collapsed
 */
export const DialDestinationFolderPopup: FC<DestinationFolderPopupProps> = ({
  onClose,
  onConfirm,
  onFolderPopupPathChange,
  setDestinationFolderPath,
  open,
  copyLabel = 'Copy',
  moveLabel = 'Move',
  addFolderLabel = 'Add folder',
  mode = DestinationFolderMode.Copy,
  hiddenFilesSwitcherLabel = 'Show hidden files',
  showHiddenFileSwitcher = true,
  onUploadFiles,
  onValidateUpload,
  maxFileSize,
  header,
  sourceFolder,
  disabledPathTooltip = 'Unavailable for the original path. Please select another folder',
  path,
  collapsedFileTree = false,
  alertProps,
  ...restProps
}: DestinationFolderPopupProps) => {
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileManagerActionRef = useRef<DialFileManagerActionsRef>(null);
  const isMobile = useIsMobileScreen();

  const handleShowHiddenFilesChange = useCallback((value: boolean) => {
    setShowHiddenFiles(value);
  }, []);

  const mobileFooterDropdownItems = useMemo<DropdownItem[]>(() => {
    const footerDropdownItems = [
      {
        key: 'add-folder',
        label: addFolderLabel,
        icon: (
          <IconFolderPlus {...BASE_ICON_PROPS} className="text-secondary" />
        ),
        onClick: () => {
          fileManagerActionRef.current?.createFolder();
          setMobileMenuOpen(false);
        },
      },
    ];

    if (showHiddenFileSwitcher) {
      footerDropdownItems.push({
        key: 'show-hidden-files',
        label: hiddenFilesSwitcherLabel,
        icon: <IconEye {...BASE_ICON_PROPS} className="text-secondary" />,
        onClick: () => {
          setShowHiddenFiles((prev) => !prev);
          setMobileMenuOpen(false);
        },
      });
    }

    return footerDropdownItems;
  }, [addFolderLabel, hiddenFilesSwitcherLabel, showHiddenFileSwitcher]);

  const handleOnPathChange = useCallback(
    (nextPath?: string) => {
      if (nextPath) {
        onFolderPopupPathChange?.(nextPath);
        setDestinationFolderPath?.(nextPath);
      }
    },
    [onFolderPopupPathChange, setDestinationFolderPath],
  );

  const defaultTitle =
    mode === DestinationFolderMode.Copy ? 'Copy to' : 'Move to';

  const isDestinationDisabled = useMemo(() => {
    if (!path || !sourceFolder) {
      return false;
    }

    return sourceFolder === path;
  }, [path, sourceFolder]);

  return (
    <DialPopup
      open={open}
      onClose={() => {
        onClose();
      }}
      size={PopupSize.Lg}
      dividerFooter
      dividers={false}
      className="md:!h-[800px] !bg-layer-2"
      footer={
        <div className="flex justify-between items-center gap-2 py-4 px-4 md:px-6">
          <div className="flex items-center gap-4 min-w-0">
            {isMobile ? (
              <DialDropdown
                menu={{ items: mobileFooterDropdownItems }}
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
              >
                <DialButton
                  className="h-9 w-9 shrink-0"
                  aria-label="More options"
                  iconBefore={
                    <IconDotsVertical
                      {...BASE_ICON_PROPS}
                      className="text-secondary"
                    />
                  }
                />
              </DialDropdown>
            ) : (
              <>
                <DialPrimaryButton
                  label={addFolderLabel}
                  appearance={ButtonAppearance.Ghost}
                  iconBefore={<IconFolderPlus {...BASE_ICON_PROPS} />}
                  onClick={() => {
                    fileManagerActionRef.current?.createFolder();
                  }}
                />
                {showHiddenFileSwitcher && (
                  <>
                    <div className="w-px h-[26px] bg-controls-disable-accent my-2" />
                    <div className="inline-flex items-center cursor-pointer">
                      <DialSwitch
                        label={hiddenFilesSwitcherLabel}
                        isOn={showHiddenFiles}
                        onChange={handleShowHiddenFilesChange}
                        switchId="hidden-files-switch"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex space-x-4 items-center">
            <DialNeutralButton onClick={onClose} label="Cancel" />
            {isDestinationDisabled ? (
              <DialTooltip tooltip={disabledPathTooltip}>
                <DialPrimaryButton
                  onClick={onConfirm}
                  label={mode === 'copy' ? copyLabel : moveLabel}
                  disabled={isDestinationDisabled}
                  aria-disabled={isDestinationDisabled}
                />
              </DialTooltip>
            ) : (
              <DialPrimaryButton
                onClick={onConfirm}
                label={mode === 'copy' ? copyLabel : moveLabel}
              />
            )}
          </div>
        </div>
      }
      header={header ?? defaultTitle}
    >
      <div className="bg-layer-2 h-full flex flex-col">
        {alertProps && (
          <div className="px-6 mb-4 pt-4">
            <DialAlert {...alertProps} />
          </div>
        )}
        <div className="flex-1 min-h-0">
          <DialFileManager
            {...restProps}
            gridClassName="size-full"
            className={mergeClasses(
              restProps.className,
              'bg-layer-2 h-full flex pt-0',
            )}
            actionsRef={fileManagerActionRef}
            path={path}
            showHiddenFiles={showHiddenFiles}
            onShowHiddenFilesChange={handleShowHiddenFilesChange}
            treeOptions={{
              ...restProps.treeOptions,
              collapsed: collapsedFileTree,
              expandedPaths: new Set<string>([restProps.rootItem?.path || '/']),
              header: restProps.treeOptions?.header,
            }}
            gridOptions={{ ...restProps.gridOptions, selectionMode: undefined }}
            navigationPanelOptions={{
              elementId: 'file-manager-destination-search',
              ...restProps.navigationPanelOptions,
            }}
            onUploadFiles={onUploadFiles}
            onValidateUpload={onValidateUpload}
            onPathChange={handleOnPathChange}
            maxFileSize={maxFileSize}
          />
        </div>
      </div>
    </DialPopup>
  );
};
