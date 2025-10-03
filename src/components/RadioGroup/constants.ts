import { RadioGroupOrientation } from '@/types/radio-group';

export const groupBaseClasses = 'flex flex-col gap-2';
export const optionsWrapperBaseClasses = 'flex';
export const selectedContentClasses = 'pb-1';

export const orientationClassMap: Record<RadioGroupOrientation, string> = {
  [RadioGroupOrientation.Column]: 'flex-col gap-y-3',
  [RadioGroupOrientation.Row]: 'flex-row gap-x-6',
};
