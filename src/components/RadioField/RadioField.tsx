import classNames from 'classnames';
import type { FC, ReactNode } from 'react';

import { DialRadioButton } from '@/components/RadioButton/RadioButton';
import {
  groupBaseClasses,
  optionsWrapperBaseClasses,
  orientationClassMap,
} from './constants';
import type { RadioFieldOrientation } from '@/types/radio-field';
import { DialFieldLabel } from '@/components/Field/Field';

export interface RadioButtonModel {
  id: string;
  name?: string;
  description?: ReactNode;
}

export interface DialRadioFieldProps {
  fieldTitle?: string;
  elementId: string;
  radioCssClass?: string;
  disabled?: boolean;
  radioButtons: RadioButtonModel[];
  activeRadioButton: string;
  orientation: RadioFieldOrientation;
  onChange: (radio: string) => void;
}

/**
 * Groups multiple `DialRadio` controls under a `DialField` label with row/column orientation.
 *
 * Uses a plain container with `role="radiogroup"` for accessibility. The field label is rendered
 * via `DialField` (replacing the legacy `Field` component).
 *
 * @example
 * ```tsx
 * <DialRadioField
 *   fieldTitle="Attachments"
 *   elementId="attachments"
 *   orientation={RadioFieldOrientation.Row}
 *   activeRadioButton="none"
 *   radioButtons={[
 *     { id: 'none', name: '— None —' },
 *     { id: 'all', name: 'All attachments' },
 *   ]}
 *   onChange={(v) => console.log('selected', v)}
 * />
 * ```
 */
export const DialRadioField: FC<DialRadioFieldProps> = ({
  fieldTitle,
  radioCssClass,
  disabled,
  elementId,
  radioButtons,
  activeRadioButton,
  orientation,
  onChange,
}) => {
  return (
    <div className={groupBaseClasses}>
      {fieldTitle && (
        <DialFieldLabel fieldTitle={fieldTitle} htmlFor={elementId} />
      )}

      <div
        role="radiogroup"
        aria-label={fieldTitle}
        aria-disabled={disabled || undefined}
        data-testid="radiofield-options"
        className={classNames(
          optionsWrapperBaseClasses,
          orientationClassMap[orientation],
        )}
      >
        {radioButtons.map((radio) => (
          <DialRadioButton
            key={radio.id}
            name={elementId}
            value={radio.id}
            inputId={radio.id}
            disabled={disabled}
            cssClass={radioCssClass}
            title={radio.name}
            description={radio.description}
            checked={radio.id === activeRadioButton}
            onChange={(v) => onChange(v)}
          />
        ))}
      </div>
    </div>
  );
};
