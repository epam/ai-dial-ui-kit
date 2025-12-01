import { RadioGroupOrientation } from '@/types/radio-group';

export const groupBaseClassName = 'flex flex-col gap-2';
export const optionsWrapperBaseClassName = 'flex';
export const selectedContentClassName = 'pb-1 mt-2';

export const orientationClassMap: Record<RadioGroupOrientation, string> = {
  [RadioGroupOrientation.Column]: 'flex-col gap-y-3',
  [RadioGroupOrientation.Row]: 'flex-row gap-x-6',
};
