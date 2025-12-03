import { DialPopup } from '@/components/Popup/Popup';
import { PopupSize } from '@/types/popup';
import { DialButton } from '@/components/Button/Button';
import { ButtonVariant } from '@/types/button';
import { type FC, useState, useMemo, useCallback } from 'react';
import type { DialFile } from '@/models/file';
import { DialFileNodeType } from '@/models/file';
import { DialRadioGroup } from '@/components/RadioGroup/RadioGroup';
import { RadioGroupOrientation } from '@/types/radio-group';
import type { RadioButtonWithContent } from '@/models/radio';
import { DialDropdown } from '@/components/Dropdown/Dropdown';
import type { DropdownItem } from '@/models/dropdown';
import { DialGrid } from '@/components/Grid/Grid';
import type { ColDef } from 'ag-grid-community';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';
import { BASE_FILE_MANAGER_ICON_SIZE } from '@/components/FileManager/constants';
import { DropdownTrigger } from '@/types/dropdown';
import { IconChevronDown, IconCircleFilled } from '@tabler/icons-react';
import classNames from 'classnames';
import {
  DialFileManagerConflictActions,
  DialFileManagerConflictStrategies,
} from '@/types/file-manager';

export interface FileConflictDecision {
  file: DialFile;
  action: DialFileManagerConflictActions;
}

export interface ConflictResolutionPopupProps {
  open: boolean;
  onClose: () => void;
  onReplace: () => void;
  onDuplicate: () => void;
  onDecideForEach?: (decisions: FileConflictDecision[]) => void;
  conflictingFiles: DialFile[];
  title?: string;
  singleFileTitle?: string;
  multipleFilesTitle?: string;
  message?: string;

  actionLabels?: {
    [DialFileManagerConflictActions.Replace]?: string;
    [DialFileManagerConflictActions.Duplicate]?: string;
    [DialFileManagerConflictActions.Cancel]?: string;
  };

  strategyLabels?: {
    [DialFileManagerConflictStrategies.ReplaceAll]?: string;
    [DialFileManagerConflictStrategies.DuplicateAll]?: string;
    [DialFileManagerConflictStrategies.DecideForEach]?: string;
  };

  confirmLabel?: string;
  cancelLabel?: string;
  nameColumnLabel?: string;
  actionColumnLabel?: string;
}

interface ConflictGridRow {
  id: string;
  name: string;
  path: string;
  nodeType: DialFileNodeType;
  action: DialFileManagerConflictActions;
}

/**
 * ConflictResolutionPopup
 *
 * A popup dialog for resolving file name conflicts during copy or move operations.
 * Shows different UI based on number of conflicting files:
 * - Single file: Simple Replace/Duplicate choice with radio buttons
 * - Multiple files: Replace all / Duplicate all / Decide for each strategy with optional grid
 *
 * When "Decide for each" is selected, displays a grid with dropdown selectors for individual
 * file resolution (Replace/Duplicate/Cancel).
 *
 * @example
 * ```tsx
 * // Single file conflict
 * <ConflictResolutionPopup
 *   open={isOpen}
 *   onClose={handleClose}
 *   onReplace={handleReplace}
 *   onDuplicate={handleDuplicate}
 *   conflictingFiles={[file]}
 * />
 *
 * // Multiple files with custom labels
 * <ConflictResolutionPopup
 *   open={isOpen}
 *   onClose={handleClose}
 *   onReplace={handleReplaceAll}
 *   onDuplicate={handleDuplicateAll}
 *   onDecideForEach={handleDecisions}
 *   conflictingFiles={files}
 *   actionLabels={{
 *     [DialFileManagerConflictActions.Replace]: 'Overwrite',
 *     [DialFileManagerConflictActions.Duplicate]: 'Keep Both',
 *   }}
 *   strategyLabels={{
 *     [DialFileManagerConflictStrategies.ReplaceAll]: 'Overwrite All',
 *     [DialFileManagerConflictStrategies.DuplicateAll]: 'Keep All',
 *   }}
 * />
 * ```
 *
 * @param open - Whether the popup is visible
 * @param onClose - Callback fired when the popup is closed
 * @param onReplace - Callback fired when Replace/Replace All is confirmed
 * @param onDuplicate - Callback fired when Duplicate/Duplicate All is confirmed
 * @param [onDecideForEach] - Callback fired when individual decisions are confirmed; receives array of decisions
 * @param conflictingFiles - Array of files with name conflicts
 * @param [title] - Custom title (overrides singleFileTitle and multipleFilesTitle)
 * @param [singleFileTitle="Replace Or Duplicate Item"] - Title for single file conflicts
 * @param [multipleFilesTitle="Replace Or Duplicate Items"] - Title for multiple file conflicts
 * @param [message] - Custom message (overrides default conflict description)
 * @param [actionLabels] - Custom labels for conflict actions (Replace/Duplicate/Cancel)
 * @param [strategyLabels] - Custom labels for conflict strategies (Replace all/Duplicate all/Decide for each)
 * @param [confirmLabel="Confirm"] - Label for the confirm button
 * @param [cancelLabel="Cancel"] - Label for the cancel button
 * @param [nameColumnLabel="Name"] - Label for the file name column in the grid
 * @param [actionColumnLabel="Action"] - Label for the action column in the grid
 */
export const ConflictResolutionPopup: FC<ConflictResolutionPopupProps> = ({
  open,
  onClose,
  onReplace,
  onDuplicate,
  onDecideForEach,
  conflictingFiles,
  singleFileTitle = 'Replace Or Duplicate Item',
  multipleFilesTitle = 'Replace Or Duplicate Items',
  message,
  actionLabels,
  strategyLabels,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  nameColumnLabel = 'Name',
  actionColumnLabel = 'Action',
}) => {
  const isSingleFile = conflictingFiles.length === 1;
  const fileName = isSingleFile ? conflictingFiles[0]?.name : '';

  const replaceLabel =
    actionLabels?.[DialFileManagerConflictActions.Replace] ?? 'Replace';
  const duplicateLabel =
    actionLabels?.[DialFileManagerConflictActions.Duplicate] ?? 'Duplicate';
  const cancelActionLabel =
    actionLabels?.[DialFileManagerConflictActions.Cancel] ?? 'Cancel';

  const replaceAllLabel =
    strategyLabels?.[DialFileManagerConflictStrategies.ReplaceAll] ??
    'Replace all';
  const duplicateAllLabel =
    strategyLabels?.[DialFileManagerConflictStrategies.DuplicateAll] ??
    'Duplicate all';
  const decideForEachLabel =
    strategyLabels?.[DialFileManagerConflictStrategies.DecideForEach] ??
    'Decide for each';

  const [singleFileMode, setSingleFileMode] =
    useState<DialFileManagerConflictActions>(
      DialFileManagerConflictActions.Replace,
    );

  const [strategy, setStrategy] = useState<DialFileManagerConflictStrategies>(
    DialFileManagerConflictStrategies.ReplaceAll,
  );
  const [fileDecisions, setFileDecisions] = useState<
    Map<string, DialFileManagerConflictActions>
  >(
    new Map(
      conflictingFiles.map((file) => [
        file.path,
        DialFileManagerConflictActions.Replace,
      ]),
    ),
  );

  const [openDropdownPath, setOpenDropdownPath] = useState<string | undefined>(
    undefined,
  );

  const title = isSingleFile ? singleFileTitle : multipleFilesTitle;

  const defaultSingleFileMessage = (
    <>
      Item with the name <span className="text-primary">"{fileName}"</span>{' '}
      already exists in this destination.
    </>
  );

  const defaultMultipleFilesMessage = `${conflictingFiles.length} items with the same names already exist in this destination.`;

  const displayMessage =
    message ??
    (isSingleFile ? defaultSingleFileMessage : defaultMultipleFilesMessage);

  // Radio options for single file
  const singleFileRadioOptions: RadioButtonWithContent[] = useMemo(
    () => [
      {
        id: DialFileManagerConflictActions.Replace,
        name: replaceLabel,
      },
      {
        id: DialFileManagerConflictActions.Duplicate,
        name: duplicateLabel,
      },
    ],
    [replaceLabel, duplicateLabel],
  );

  const gridRows = useMemo<ConflictGridRow[]>(() => {
    return conflictingFiles.map((file) => ({
      id: file.path,
      name: file.name,
      path: file.path,
      nodeType: file.nodeType ?? DialFileNodeType.ITEM,
      action:
        fileDecisions.get(file.path) || DialFileManagerConflictActions.Replace,
    }));
  }, [conflictingFiles, fileDecisions]);

  const columnDefs = useMemo<ColDef<ConflictGridRow>[]>(() => {
    return [
      {
        field: 'name',
        headerName: nameColumnLabel,
        flex: 1,
        minWidth: 200,
        floatingFilter: false,
        filter: false,
        resizable: false,
        cellRenderer: (params: { data: ConflictGridRow }) => {
          return params.data?.nodeType === DialFileNodeType.FOLDER ? (
            <DialFolderName
              name={params.data.name}
              iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            />
          ) : (
            <DialFileName
              name={params.data.name}
              iconSize={BASE_FILE_MANAGER_ICON_SIZE}
            />
          );
        },
      },
      {
        field: 'action',
        headerName: actionColumnLabel,
        width: 140,
        suppressSizeToFit: true,
        sortable: false,
        filter: false,
        floatingFilter: false,
        resizable: false,
        cellRenderer: (params: { data: ConflictGridRow }) => {
          if (!params.data) return null;

          const dropdownItems: DropdownItem[] = [
            {
              key: DialFileManagerConflictActions.Replace,
              label: replaceLabel,
              icon: (
                <IconCircleFilled size={10} className="text-accent-tertiary" />
              ),
            },
            {
              key: DialFileManagerConflictActions.Duplicate,
              label: duplicateLabel,
              icon: (
                <IconCircleFilled size={10} className="text-accent-secondary" />
              ),
            },
            {
              key: DialFileManagerConflictActions.Cancel,
              label: cancelActionLabel,
              icon: <IconCircleFilled size={10} className="text-error" />,
            },
          ];

          const activeItem = dropdownItems.find(
            (item) => item.key === params.data.action,
          );

          const isOpen = openDropdownPath === params.data.path;

          return (
            <div className="flex items-center h-full">
              <DialDropdown
                trigger={[DropdownTrigger.Click]}
                open={isOpen}
                menu={{
                  items: dropdownItems,
                  onClick: ({ key }) => {
                    setFileDecisions((prev) => {
                      const next = new Map(prev);
                      next.set(
                        params.data.path,
                        key as DialFileManagerConflictActions,
                      );
                      return next;
                    });
                    setOpenDropdownPath(undefined);
                  },
                }}
                placement="bottom-start"
                matchReferenceWidth={false}
                allowedPlacements={['bottom-start', 'top-start']}
                onOpenChange={(open) => {
                  setOpenDropdownPath(open ? params.data.path : undefined);
                }}
              >
                <button type="button" className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    {activeItem?.icon}
                    {activeItem?.label ?? replaceLabel}
                  </span>
                  <IconChevronDown
                    size={16}
                    className={classNames(
                      'text-secondary transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
              </DialDropdown>
            </div>
          );
        },
      },
    ];
  }, [
    nameColumnLabel,
    actionColumnLabel,
    replaceLabel,
    duplicateLabel,
    cancelActionLabel,
    openDropdownPath,
  ]);

  const multipleFilesRadioOptions: RadioButtonWithContent[] = useMemo(
    () => [
      {
        id: DialFileManagerConflictStrategies.ReplaceAll,
        name: replaceAllLabel,
      },
      {
        id: DialFileManagerConflictStrategies.DuplicateAll,
        name: duplicateAllLabel,
      },
      {
        id: DialFileManagerConflictStrategies.DecideForEach,
        name: decideForEachLabel,
        content:
          strategy === DialFileManagerConflictStrategies.DecideForEach ? (
            <div className="mt-4">
              <DialGrid<ConflictGridRow>
                columnDefs={columnDefs}
                rowData={gridRows}
                getRowId={(row) => row.id}
                withSelectionColumn={false}
                wrapCustomCellRenderers={false}
                alternateOddRowColors={false}
                additionalGridOptions={{
                  domLayout: 'autoHeight',
                }}
              />
            </div>
          ) : undefined,
      },
    ],
    [
      replaceAllLabel,
      duplicateAllLabel,
      decideForEachLabel,
      strategy,
      columnDefs,
      gridRows,
    ],
  );

  const handleConfirm = useCallback(() => {
    if (isSingleFile) {
      if (singleFileMode === DialFileManagerConflictActions.Replace) {
        onReplace();
      } else {
        onDuplicate();
      }
    } else {
      if (strategy === DialFileManagerConflictStrategies.ReplaceAll) {
        onReplace();
      } else if (strategy === DialFileManagerConflictStrategies.DuplicateAll) {
        onDuplicate();
      } else if (
        strategy === DialFileManagerConflictStrategies.DecideForEach &&
        onDecideForEach
      ) {
        const decisions: FileConflictDecision[] = conflictingFiles.map(
          (file) => ({
            file,
            action:
              fileDecisions.get(file.path) ||
              DialFileManagerConflictActions.Replace,
          }),
        );
        onDecideForEach(decisions);
      }
    }
  }, [
    isSingleFile,
    singleFileMode,
    strategy,
    fileDecisions,
    conflictingFiles,
    onReplace,
    onDuplicate,
    onDecideForEach,
  ]);

  return (
    <DialPopup
      open={open}
      onClose={onClose}
      size={PopupSize.Md}
      title={title}
      dividers={false}
      footer={
        <div className="flex justify-end gap-3 py-4 px-6">
          <DialButton
            onClick={onClose}
            label={cancelLabel}
            variant={ButtonVariant.Secondary}
          />
          <DialButton
            onClick={handleConfirm}
            label={confirmLabel}
            variant={ButtonVariant.Primary}
          />
        </div>
      }
    >
      <div className="px-6 py-4">
        <p className="text-secondary mb-4">{displayMessage}</p>

        {isSingleFile ? (
          <DialRadioGroup
            elementId="single-file-conflict"
            radioButtons={singleFileRadioOptions}
            activeRadioButton={singleFileMode}
            orientation={RadioGroupOrientation.Column}
            onChange={(id) =>
              setSingleFileMode(id as DialFileManagerConflictActions)
            }
          />
        ) : (
          <DialRadioGroup
            elementId="multiple-files-conflict"
            radioButtons={multipleFilesRadioOptions}
            activeRadioButton={strategy}
            orientation={RadioGroupOrientation.Column}
            onChange={(id) =>
              setStrategy(id as DialFileManagerConflictStrategies)
            }
            formItemChildrenClassName="gap-3"
          />
        )}
      </div>
    </DialPopup>
  );
};
