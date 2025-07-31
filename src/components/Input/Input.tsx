import type { FC, ReactNode } from 'react';
import classNames from 'classnames';

export interface DialInputProps {
  inputId: string;
  type?: string;
  value?: string | number | null;
  placeholder?: string;
  containerCssClass?: string;
  cssClass?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  hideBorder?: boolean;
  onChange?: (value: string) => void;
  iconAfterInput?: ReactNode;
  iconBeforeInput?: ReactNode;
}

export const DialInput: FC<DialInputProps> = ({
  iconBeforeInput,
  iconAfterInput,
  hideBorder,
  value,
  inputId,
  placeholder = '',
  cssClass = '',
  containerCssClass,
  type = 'text',
  disabled,
  readonly,
  invalid,
  onChange,
}) => {
  return (
    <div
      className={classNames(
        'dial-input-field flex flex-row items-center justify-between',
        hideBorder ? 'dial-input-no-border' : 'dial-input',
        invalid && 'dial-input-error',
        disabled && 'dial-input-disable',
        readonly && 'dial-input-readonly',
        containerCssClass,
      )}
    >
      {iconBeforeInput}
      <input
        type={type}
        autoComplete="new-password"
        id={inputId}
        placeholder={placeholder}
        value={value || ''}
        title={value ? String(value) : ''}
        disabled={disabled}
        className={classNames(
          'border-0 bg-transparent',
          iconBeforeInput ? 'pl-2' : '',
          iconAfterInput ? 'pr-2' : '',
          cssClass,
        )}
        onChange={(event) => !readonly && onChange?.(event.currentTarget.value)}
      />
      {iconAfterInput}
    </div>
  );
};
