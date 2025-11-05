import type { FC, ReactNode, Ref } from 'react';
import { DialItemIcon } from '../ItemIcon/ItemIcon';
import type { DialItemType } from '@/types/item';
import { DialInput } from '@/components/Input/Input';
import { IconAlertCircleFilled } from '@tabler/icons-react';
import { BASE_ICON_PROPS } from '@/constants/icon';
import { DialTooltip } from '@/components/Tooltip/Tooltip';

export interface DialItemInputProps {
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

export const DialItemInput: FC<DialItemInputProps> = ({
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
          />
        )}
      </DialTooltip>
    );
  };

  return (
    <div className="flex gap-2 items-center">
      <DialItemIcon
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
