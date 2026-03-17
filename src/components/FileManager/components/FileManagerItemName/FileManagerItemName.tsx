import type { FC, ReactNode } from 'react';
import {
  DialFileManagerItemNameInput,
  type DialFileManagerItemNameInputProps,
} from '@/components/FileManager/components/FileManagerItemNameInput/FileManagerItemNameInput';
import { useEditableItem } from '@/hooks/use-editable-item';
import { DialItemType } from '@/types/item';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';
import { BASE_ICON_SIZE } from '@/constants/icon';

export interface DialFileManagerItemNameProps
  extends DialFileManagerItemNameInputProps {
  name: string;
  type: DialItemType;
  elementId: string;
  editing?: boolean;
  loading?: boolean;
  shared?: boolean;
  details?: ReactNode;
  sharedIndicatorTooltip?: ReactNode;
  fileExtension?: string;
  validate?: (value: string) => string | null;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  hideTooltip?: boolean;
  nameValidationRegExp?: RegExp;
}

/**
 * A component that renders a file or folder name with optional edit mode.
 *
 * When `editing` is `false`, it displays a read-only name via:
 * - `DialFolderName` for folders
 * - `DialFileName` for files
 *
 * When `editing` is `true`, it renders an editable input using `DialItemNameInput`,
 * driven by validation and change logic from the `useEditableItem` hook.
 *
 * @example
 * ```tsx
 * import { DialFileManagerItemName } from '@/components/DialFileManagerItemName/DialFileManagerItemName';
 * import { DialItemType } from '@/types/item';
 *
 * function Example() {
 *   return (
 *     <DialFileManagerItemName
 *       name="Project"
 *       type={DialItemType.Folder}
 *       elementId="folder-123"
 *       editing={true}
 *       validate={(value) => (value.trim() ? null : 'Name cannot be empty')}
 *       onSave={(newName) => console.log('Saved:', newName)}
 *       onCancel={() => console.log('Canceled')}
 *     />
 *   );
 * }
 * ```
 *
 * @param props - Component props.
 * @returns Rendered file or folder name element (editable or static).
 */
export const DialFileManagerItemName: FC<DialFileManagerItemNameProps> = ({
  name,
  type,
  elementId,
  editing = false,
  loading = false,
  shared = false,
  iconSize = BASE_ICON_SIZE,
  validate,
  onSave,
  fileExtension,
  onCancel,
  inputContainerClassName,
  sharedIndicatorClassName,
  sharedIndicatorTooltip,
  hideTooltip = false,
  nameValidationRegExp,
  ...restProps
}) => {
  const { value, invalid, invalidMessage, onChange, inputRef } =
    useEditableItem({
      value: name,
      isEditing: editing,
      onValidate: validate,
      onCancel,
      onSave,
    });

  if (!editing) {
    const hasRestrictedSymbolsInName = nameValidationRegExp?.test(name);

    if (type === DialItemType.Folder) {
      return (
        <DialFolderName
          name={name}
          loading={loading}
          shared={shared}
          iconSize={iconSize}
          className="max-w-[428px] truncate"
          sharedIndicatorClassName={sharedIndicatorClassName}
          hideTooltip={hideTooltip}
          isInvalidName={hasRestrictedSymbolsInName}
        />
      );
    }

    return (
      <DialFileName
        className="max-w-[428px]"
        {...restProps}
        name={name}
        shared={shared}
        iconSize={iconSize}
        sharedIndicatorClassName={sharedIndicatorClassName}
        hideTooltip={hideTooltip}
        isInvalidName={hasRestrictedSymbolsInName}
      />
    );
  }

  return (
    <DialFileManagerItemNameInput
      type={type}
      name={value}
      elementId={elementId}
      inputInvalid={invalid}
      inputInvalidMessage={invalidMessage}
      inputRef={inputRef}
      onChange={onChange}
      iconSize={iconSize}
      fileExtension={fileExtension}
      inputContainerClassName={inputContainerClassName}
      sharedIndicatorTooltip={sharedIndicatorTooltip}
      sharedIndicatorClassName={sharedIndicatorClassName}
    />
  );
};
