import { TextAlign, TextColor, TextVariant } from '@/types/typography';

export const textVariantClassMap: Record<TextVariant, string> = {
  body: 'text-[16px]',
  small: 'text-[14px]',
  tiny: 'text-[12px]',
  caption: 'text-[10px]',
};

export const textDefaultLeadingClassMap: Record<TextVariant, string> = {
  [TextVariant.Body]: 'leading-[28px]',
  [TextVariant.Small]: 'leading-[16px]',
  [TextVariant.Tiny]: 'leading-[14px]',
  [TextVariant.Caption]: 'leading-[12px]',
};

export const textColors: Record<TextColor, string> = {
  [TextColor.Transparent]: 'text-transparent',
  [TextColor.Primary]: 'text-primary',
  [TextColor.Secondary]: 'text-secondary',
  [TextColor.Error]: 'text-error',
  [TextColor.Warning]: 'text-warning',
  [TextColor.Info]: 'text-info',
  [TextColor.Success]: 'text-success',
  [TextColor.White]: 'text-white',
  [TextColor.AccentPrimary]: 'text-accent-primary',
  [TextColor.AccentSecondary]: 'text-accent-secondary',
  [TextColor.AccentTertiary]: 'text-accent-tertiary',
  [TextColor.ControlsPermanent]: 'text-controls-permanent',
  [TextColor.ControlsTemporary]: 'text-controls-temporary',
};

export const alignClassMap: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const defaultTitleTagByLevel = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const;

export const titleLevelClassMap = {
  1: 'text-[20px] font-semibold leading-[24px]',
  2: 'text-[20px] font-normal leading-[24px]',
  3: 'text-[16px] font-semibold leading-[18px]',
} as const;
