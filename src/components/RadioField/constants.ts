import { RadioFieldOrientation } from '@/types/radioField';

export const groupBaseClasses = 'flex flex-col';
export const legendBaseClasses = 'text-sm font-medium text-primary';
export const optionsWrapperBaseClasses = 'flex mt-1';

export const orientationClassMap: Record<RadioFieldOrientation, string> = {
  [RadioFieldOrientation.Column]: 'flex-col gap-y-3',
  [RadioFieldOrientation.Row]: 'flex-row gap-x-6',
};
