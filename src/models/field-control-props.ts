import type { ReactNode } from 'react';

export interface FieldControlProps {
  fieldTitle?: string;
  optional?: boolean;
}

export interface InputBaseProps {
  elementId: string;
  value?: string | number | null;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  iconAfter?: ReactNode;
  iconBefore?: ReactNode;
  min?: number;
  max?: number;

  // additional parts props
  textBeforeInput?: string;
  textAfterInput?: string;
  prefix?: string;
  suffix?: string;
}
