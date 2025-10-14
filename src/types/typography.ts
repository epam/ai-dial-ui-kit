import type { ReactNode } from 'react';

export interface DialTypographyBaseProps {
  color?: TextColor;
  lineHeight150?: boolean;
  align?: TextAlign;
  cssClass?: string;
  children: ReactNode;
  id?: string;
}

export enum TextVariant {
  Body = 'body',
  Small = 'small',
  Tiny = 'tiny',
  Caption = 'caption',
}

export enum TextColor {
  Primary = 'primary',
  Secondary = 'secondary',
  Error = 'error',
  Transparent = 'transparent',
  Warning = 'warning',
  Success = 'success',
  White = 'white',
  AccentPrimary = 'accent-primary',
  AccentSecondary = 'accent-secondary',
  AccentTertiary = 'accent-tertiary',
  ControlsPermanent = 'controls-permanent',
  ControlsTemporary = 'controls-temporary',
  Info = 'info',
}

export enum TextAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}
