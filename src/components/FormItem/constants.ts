import { FormItemOrientation } from '@/types/form-item';

export const containerBaseClassName = 'w-full flex gap-2';
export const orientationClassMap: Record<FormItemOrientation, string> = {
  [FormItemOrientation.Vertical]: 'flex-col',
  [FormItemOrientation.Horizontal]: 'flex-row items-end',
};
