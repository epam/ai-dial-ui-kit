import type { FC } from 'react';
import {
  DialItemNameInput,
  type DialItemNameInputProps,
} from '@/components/ItemNameInput/ItemNameInput';
import { useEditableItem } from '@/hooks/use-editable-item';
import { DialItemType } from '@/types/item';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';

export interface DialEditableItemNameProps extends DialItemNameInputProps {
  name: string;
  type: DialItemType;
  elementId: string;
  editing?: boolean;
  loading?: boolean;
  shared?: boolean;
  validate?: (value: string) => string | null;
  onSave?: (value: string) => void;
  onCancel?: () => void;
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
 * import { DialEditableItemName } from '@/components/DialEditableItemName/DialEditableItemName';
 * import { DialItemType } from '@/types/item';
 *
 * function Example() {
 *   return (
 *     <DialEditableItemName
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
export const DialEditableItemName: FC<DialEditableItemNameProps> = ({
  name,
  type,
  elementId,
  editing = false,
  loading = false,
  shared = false,
  validate,
  onSave,
  onCancel,
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
    if (type === DialItemType.Folder) {
      return (
        <DialFolderName
          name={name}
          loading={loading}
          shared={shared}
          cssClass="max-w-[428px] truncate"
        />
      );
    }
    return (
      <DialFileName name={name} shared={shared} cssClass="max-w-[428px]" />
    );
  }

  return (
    <DialItemNameInput
      type={type}
      name={value}
      elementId={elementId}
      inputInvalid={invalid}
      inputInvalidMessage={invalidMessage}
      inputRef={inputRef}
      onChange={onChange}
    />
  );
};
