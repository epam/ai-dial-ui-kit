import type { FC, ReactNode, Ref } from 'react';
import { DialFileManagerItemIcon } from '@/components/FileManager/components/FileManagerItemIcon/FileManagerItemIcon';
import type { DialItemType } from '@/types/item';
import { DialInput } from '@/components/Input/Input';
import { IconAlertCircleFilled } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';

export interface DialFileManagerItemNameInputProps {
  type: DialItemType;
  name: string;
  shared?: boolean;
  loading?: boolean;
  elementId: string;
  iconSize?: number;
  iconStroke?: number;
  iconCssClass?: string;
  iconLabel?: string;
  iconIndicator?: ReactNode;
  inputInvalid?: boolean;
  inputInvalidMessage?: string;
  inputIconAfter?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: (value?: string) => void;
}

/**
 * Combines a file/folder icon with an editable text input.
 *
 * Used for renaming or labeling file/folder entities within the File Manager.
 * Displays:
 * - The item icon (with optional loading/shared state)
 * - An inline text input
 * - A validation tooltip when `inputInvalid` is `true`
 *
 * @example
 * ```tsx
 * <DialFileManagerItemNameInput
 *   type={DialItemType.File}
 *   name="report.pdf"
 *   elementId="file-input-1"
 *   shared
 *   onChange={(value) => console.log('New name:', value)}
 * />
 *
 * <DialFileManagerItemNameInput
 *   type={DialItemType.Folder}
 *   name="Project A"
 *   elementId="folder-input-2"
 *   inputInvalid
 *   inputInvalidMessage="Invalid name"
 * />
 * ```
 *
 * @param {Object} props
 * @param {DialItemType} props.type - The type of item (file or folder).
 * @param {string} props.name - Current name of the entity.
 * @param {string} props.elementId - Unique ID for the input element.
 * @param {boolean} [props.shared=false] - Whether the entity is shared.
 * @param {boolean} [props.loading=false] - Whether the icon is loading.
 * @param {number} [props.iconSize] - Optional size override for the icon.
 * @param {number} [props.iconStroke] - Optional stroke width override for the icon.
 * @param {string} [props.iconCssClass] - Optional CSS class for the icon.
 * @param {string} [props.iconLabel] - Optional accessible label for the icon.
 * @param {ReactNode} [props.iconIndicator] - Optional indicator to render over the icon.
 * @param {boolean} [props.inputInvalid=false] - Marks the input as invalid.
 * @param {string} [props.inputInvalidMessage] - Tooltip message shown when invalid.
 * @param {ReactNode} [props.inputIconAfter] - Optional icon shown after the input (defaults to an error icon).
 * @param {Ref<HTMLInputElement>} [props.inputRef] - Ref to access the underlying input element.
 * @param {(value: string) => void} [props.onChange] - Callback fired when input value changes.
 */
export const DialFileManagerItemNameInput: FC<
  DialFileManagerItemNameInputProps
> = ({
  name,
  type,
  elementId,
  loading = false,
  shared = false,
  iconCssClass,
  iconIndicator,
  iconLabel,
  iconSize,
  iconStroke,
  inputInvalid,
  inputInvalidMessage,
  inputIconAfter,
  inputRef,
  onChange,
}) => {
  const getInputIconAfter = () => {
    if (!inputInvalid) return null;

    return (
      <DialTooltip tooltip={inputInvalidMessage}>
        {inputIconAfter || (
          <IconAlertCircleFilled
            {...BASE_ICON_PROPS}
            className="text-icon-error"
            aria-label="alert"
          />
        )}
      </DialTooltip>
    );
  };

  return (
    <div className="flex gap-2 items-center">
      <DialFileManagerItemIcon
        name={name}
        type={type}
        label={iconLabel}
        cssClass={iconCssClass}
        indicator={iconIndicator}
        size={iconSize}
        stroke={iconStroke}
        loading={loading}
        shared={shared}
      />
      <DialInput
        containerCssClass="!h-6 py-[1px] pl-[7px] pr-[7px]"
        elementId={elementId}
        defaultValue={name}
        onChange={onChange}
        invalid={inputInvalid}
        iconAfter={getInputIconAfter()}
        inputRef={inputRef}
      />
    </div>
  );
};
