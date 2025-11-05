import type { FC } from 'react';
import { DialItemInput, type DialItemInputProps } from '../ItemInput/ItemInput';
import { useEditableItem } from '../../hooks/use-editable-item';
import { DialItemType } from '@/types/item';
import { DialFileName } from '@/components/FileName/FileName';
import { DialFolderName } from '@/components/FolderName/FolderName';

export interface DialEditableItemNameProps extends DialItemInputProps {
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
      validate,
      onSave,
      isEditing: editing,
      onCancel,
    });

  if (!editing) {
    if (type === DialItemType.Folder) {
      return <DialFolderName name={name} loading={loading} shared={shared} />;
    }
    return <DialFileName name={name} shared={shared} />;
  }

  return (
    <DialItemInput
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
